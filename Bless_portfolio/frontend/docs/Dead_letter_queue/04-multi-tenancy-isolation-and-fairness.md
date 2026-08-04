# Part 4 — Multi-Tenancy: Isolation, Fairness, and Blast Radius

*Hardening the Reconciliation Worker, Part 4 of 7*

---

Everything in Parts 1–3 applies to a single-tenant system. Multi-tenancy changes the problem qualitatively, because in a shared worker pool **a failure is no longer contained to the party that caused it**. One merchant with a broken integration can degrade reconciliation for every other merchant on the platform, and none of them can do anything about it.

The organising question for this part: *when tenant A sends garbage, what does tenant B experience?* If the answer is anything other than "nothing," you have work to do.

## 1. The noisy neighbour, three ways

**Volume.** One tenant onboards and replays 400,000 historical transactions through the same queue everyone else uses. FIFO ordering means every other tenant's callbacks now sit behind a six-hour backlog. Nothing has failed; the system is simply unfair.

**Failure.** One tenant's provider integration starts returning malformed payloads at 50/second. Each burns retries, occupies concurrency slots, and floods your DLQ. Even with perfect dead lettering, the *throughput* consumed by failing is throughput denied to everyone else.

**Poison.** With Kafka, all of tenant A's events land on one partition — but that partition also carries tenants C, F, and M (partitions are assigned by key hash, not by tenant). A poison pill stalls the partition, and three unrelated tenants stop reconciling entirely. This is the worst case because the affected tenants have no relationship to the cause and no visibility into it.

## 2. Queue topology: the isolation/complexity trade-off

**Single shared queue.** Simplest, worst isolation. Viable only at low volume with a small tenant count and short tasks.

**Queue per tenant.** Perfect isolation, and unworkable past a few dozen tenants — brokers degrade badly with thousands of queues, consumers must be assigned dynamically, and idle queues still cost resources. Reserve it for a handful of very large tenants that justify dedicated capacity, which doubles as an enterprise tier feature.

**Sharded queues (the practical default).** A fixed set of queues — say 16 — with tenants assigned by consistent hash. A poison pill affects the ~1/16 of tenants sharing that shard, not all of them. Capacity is bounded and predictable, and you can pin a problematic tenant to a quarantine shard by overriding its assignment.

```python
QUEUE_SHARDS = 16

def queue_for(tenant_id: str) -> str:
    override = shard_overrides.get(tenant_id)      # cached from DB/Redis
    if override:
        return override                            # e.g. "reconcile.quarantine"
    h = int(hashlib.blake2b(tenant_id.encode(), digest_size=8).hexdigest(), 16)
    return f"reconcile.shard.{h % QUEUE_SHARDS}"

reconcile.apply_async(kwargs={"raw": payload}, queue=queue_for(tenant_id))
```

**Priority lanes crossed with shards.** Separate `interactive` (a user is waiting — checkout callbacks) from `bulk` (statement imports, backfills, replays) and give each its own worker pool. This solves the volume noisy-neighbour case cleanly: a tenant's 400,000-row backfill physically cannot consume the workers serving live callbacks. If you implement only one thing from this article, make it this one — it is cheap and the payoff is immediate.

**Weighted fair queueing** — round-robin across tenants with weights, so no single tenant consumes more than its share of a pool — is the rigorous answer, and it is a real amount of machinery to build on Celery. Shards plus lanes plus concurrency caps gets you 90% of the benefit. A simple per-tenant concurrency cap via a Redis semaphore covers most of the rest:

```python
def acquire_tenant_slot(tenant_id: str, limit: int) -> bool:
    key = f"conc:{tenant_id}"
    n = r.incr(key)
    r.expire(key, 300)
    if n > limit:
        r.decr(key)
        return False
    return True
```

If the slot can't be acquired, re-queue with a short delay — and, as in Part 2, **do not count it as a retry attempt**. The message did no work.

## 3. Tenant quarantine: the circuit breaker for a customer

Circuit breakers protect dependencies. Tenant quarantine protects *the platform from a tenant*, and it is the highest-leverage control in a multi-tenant worker.

The rule: when a tenant's failure rate crosses a threshold, stop consuming that tenant's work entirely. Park incoming messages, keep processing everyone else, alert the on-call engineer and (this part matters commercially) notify the tenant.

```python
QUARANTINE_WINDOW = 300      # seconds
QUARANTINE_THRESHOLD = 0.5   # fraction failing
QUARANTINE_MIN_SAMPLE = 20   # don't trip on 2 of 3

def record_outcome(tenant_id: str, ok: bool) -> None:
    key = f"health:{tenant_id}"
    field = "ok" if ok else "fail"
    pipe = r.pipeline()
    pipe.hincrby(key, field, 1)
    pipe.expire(key, QUARANTINE_WINDOW)
    pipe.execute()

def should_quarantine(tenant_id: str) -> bool:
    h = r.hgetall(f"health:{tenant_id}")
    ok = int(h.get(b"ok", 0)); fail = int(h.get(b"fail", 0))
    total = ok + fail
    return total >= QUARANTINE_MIN_SAMPLE and (fail / total) >= QUARANTINE_THRESHOLD
```

Quarantine is not the same as dead lettering. A quarantined tenant's messages are **parked, not failed** — held in a paused queue or a staging table with `status='quarantined'`, ready to resume once the underlying issue is fixed. Dead-lettering 50,000 messages because a tenant rotated an API key is technically correct and operationally miserable; parking them and resuming in one action is the difference between a five-minute recovery and a day of replay work.

Design decisions worth making explicitly:

- **Quarantine is per tenant *and* per failure class.** A tenant failing on `SCHEMA_INVALID` should not have their statement imports paused too.
- **Exit criteria must exist.** Auto-exit after a cooldown with a probe batch, or manual release from an admin action. A quarantine with no exit path is an outage you forgot about.
- **Tenants must be told.** "We paused reconciliation for your account at 14:20 because 87% of callbacks failed validation" is a far better customer experience than silent degradation, and it converts a platform incident into a customer-side fix.

## 4. Tenant-scoped alerting

Absolute thresholds are wrong in multi-tenant systems. `dlq_depth > 100` means "catastrophe" for a tenant that processes 200 transactions a day and "Tuesday" for one processing two million.

Alert on **relative** signals:

- Tenant DLQ arrival rate as a fraction of that tenant's own throughput (page at >5%).
- Deviation from the tenant's own 7-day baseline (page at >3σ, or a simple 10× multiple).
- Number of *distinct tenants* with new dead letters in the last 15 minutes — the single best signal for distinguishing a platform-wide bug from one merchant's broken integration. One tenant: their problem. Forty tenants: your problem, and it probably correlates with a deploy.

That last metric is worth building even if you build nothing else in Part 5. It answers the first question of every incident.

## 5. Data protection: the DLQ is a PII lake

This is the part that gets skipped and later shows up in a security review.

Your dead letter table contains raw provider payloads: customer names, phone numbers, account identifiers, amounts, sometimes partial card data. It sits in a table that is queried ad hoc by engineers during incidents, exported to CSV for analysis, and screenshotted into Slack threads. It is, in practical terms, the least-governed copy of your most sensitive data.

Minimum controls:

**Row-level security so a tenant context cannot see another tenant's dead letters.** If your admin surfaces the DLQ to tenants (and a self-service DLQ view is a genuinely good feature), this is not optional:

```sql
ALTER TABLE dead_letter ENABLE ROW LEVEL SECURITY;

CREATE POLICY dead_letter_tenant_isolation ON dead_letter
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

Combined with a connection-level `SET LOCAL app.tenant_id`, this makes cross-tenant leakage a database-enforced impossibility rather than an ORM filter someone forgot.

**Redaction at write time.** Strip or hash the fields you know are sensitive and don't need for replay. Be careful: over-redaction destroys replayability. The usable middle is to redact fields that are never inputs to reconciliation logic (customer name, phone) and encrypt at rest those that are (account references, amounts) using a column-level key.

**Retention.** Resolved dead letters should not live forever. A policy of "resolved rows purged after 90 days, discarded rows retained for 7 years as an audit record with payload stripped" satisfies both operational and compliance needs. Write it down and enforce it with a scheduled job, or the table will grow until someone deletes it in a panic.

**Access audit.** Log who read dead letter payloads. In a financial context you will eventually be asked.

## 6. The replay bug nobody tests for

Here is the failure I want you to remember from this article.

Multi-tenant applications typically carry tenant context implicitly — a thread-local, a context var, middleware set from the request, a `set_current_tenant()` call at the top of the worker loop. Replay code is usually written as an admin action or a management command, which runs *outside* the normal request path where that context is established.

```python
# Looks fine. Is a cross-tenant data breach.
def replay(dead_letter_ids):
    for dl in DeadLetter.objects.filter(id__in=dead_letter_ids):
        reconcile.delay(raw=dl.raw_payload)   # tenant context = whoever is logged in
```

If the task or any layer beneath it resolves the tenant from ambient context rather than from the payload, you have just written tenant A's transactions into tenant B's ledger — silently, with correct-looking data, discovered weeks later during a month-end close.

The fix is a discipline, not a patch: **tenant context is always derived from the message envelope, explicitly, at the entry point of every task, and it is asserted rather than assumed.**

```python
def replay(dead_letter_ids, *, actor):
    for dl in DeadLetter.objects.filter(id__in=dead_letter_ids):
        assert dl.raw_payload.get("tenant_id") == str(dl.tenant_id), \
            f"envelope/payload tenant mismatch on {dl.id}"
        reconcile.apply_async(
            kwargs={"raw": dl.raw_payload, "tenant_id": str(dl.tenant_id)},
            queue=queue_for(str(dl.tenant_id)),
            headers={"replay_of": str(dl.id), "replayed_by": actor.id},
        )


@app.task(base=ReconcileTask, bind=True)
def reconcile(self, raw, tenant_id):
    with tenant_context(tenant_id):     # sets app.tenant_id, RLS applies
        if raw.get("tenant_id") != tenant_id:
            raise PermanentError("tenant mismatch", code="TENANT_MISMATCH")
        ...
```

The `tenant_context` manager should set the Postgres session variable that RLS reads, so that even a logic bug in the task body cannot write across tenants. Defence in depth: the assertion catches it in application code, RLS catches it in the database.

Test this. Write an explicit test that replays tenant A's dead letter while tenant B's context is active and asserts that nothing is written to B. It is a five-line test that guards against one of the few genuinely unrecoverable bugs in this design.

---

## Takeaways

1. In shared workers, one tenant's failure is everyone's latency. Design isolation deliberately.
2. Sharded queues (16–32) plus separate interactive/bulk lanes gives most of the isolation benefit for a fraction of the complexity of per-tenant queues.
3. Tenant quarantine — parking a tenant's work, not failing it — is the highest-leverage control you can add. Give it explicit exit criteria and notify the tenant.
4. Alert on relative, tenant-scoped signals. "Distinct tenants with new dead letters in 15 minutes" separates a platform bug from a merchant bug in one glance.
5. The dead letter table is your least-governed copy of sensitive data. RLS, redaction, retention and access audit are part of the design, not follow-up work.
6. Always derive tenant context from the envelope, assert it in the task, and enforce it with RLS. Replay paths run outside your normal context plumbing and are where cross-tenant writes happen.

**Next:** [Part 5 — Observability: Metrics, Fingerprints, and Runbooks](05-observability-and-runbooks.md).
