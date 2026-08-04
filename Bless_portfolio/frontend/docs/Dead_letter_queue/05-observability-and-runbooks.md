# Part 5 — Observability: Metrics, Fingerprints, and Runbooks

*Hardening the Reconciliation Worker, Part 5 of 7*

---

A dead letter queue nobody looks at is a slower, more expensive version of dropping the message. This part is about the operational contract: what you measure, what wakes someone up, and what that person does next.

The mental model: **the DLQ is a work queue whose consumer is a human.** Every queue metric you would apply to a machine-consumed queue applies here too — depth, arrival rate, age of oldest item, drain rate — and the drain rate is now a property of your team's process, not your worker pool.

## 1. The metrics that matter

**Arrival rate** — `dlq_arrivals_total{tenant, error_code, task}`, a counter. The primary alerting signal. Depth tells you accumulated debt; *rate* tells you something is happening right now.

**Depth by status** — `dlq_open_items{tenant, status}`, a gauge. Only `pending` and `investigating` count as open. If this only goes up over months, your team has no resolution process and the rest of this design is theatre.

**Age of oldest open item** — `dlq_oldest_age_seconds{tenant}`. The best single indicator of a graveyard forming. In a financial context this is also a business metric: it is the age of the oldest transaction that has not been posted.

**Distinct tenants affected** — `dlq_tenants_affected_15m`. Discussed in Part 4; the fastest way to classify an incident's blast radius.

**Distinct fingerprints** — `dlq_fingerprints_open`. Ten thousand items across three fingerprints is three bugs. Ten thousand items across four thousand fingerprints is systemic and much worse.

**Retry exhaustion rate** — `retries_exhausted_total / tasks_total`. Rising exhaustion with a flat DLQ arrival rate means your retry budget is masking a degradation.

**Redelivery ratio** — `deliveries_total / messages_total`. Should hover near 1. A sustained ratio above ~1.2 means either flaky dependencies or the visibility-timeout bug from Part 2.

**Replay outcomes** — `dlq_replays_total{outcome}` where outcome is `succeeded`, `failed_again`, `discarded`. A replay that fails again is important signal: your fix didn't work, and you are now at risk of a replay ping-pong loop.

**Money in limbo** — `dlq_unreconciled_amount{tenant, currency}`, a gauge summing the amounts in open dead letters. This is the metric you show a non-technical stakeholder, and the one that gets the work prioritised. It converts "we have 812 dead letters" into "KES 4.1M is unposted," which is the same fact in a language the business acts on.

## 2. Alerting: rate and age, not depth

Depth alone is a bad page. It is high after any incident and stays high while you legitimately work through the backlog, so it either fires constantly or gets set so high it never fires.

A workable policy:

| Alert | Condition | Severity |
|---|---|---|
| Sudden failure spike | `rate(dlq_arrivals[5m])` > 10× tenant's 7-day baseline | Page |
| Platform-wide failure | `dlq_tenants_affected_15m` > 10 | Page |
| New failure class | A fingerprint never seen before, > 20 occurrences in 10m | Page |
| Money in limbo | `dlq_unreconciled_amount` > threshold per tenant tier | Page |
| Stale backlog | `dlq_oldest_age_seconds` > 72h | Ticket |
| Graveyard forming | `dlq_open_items` rising for 7 consecutive days | Ticket |
| Replay ping-pong | Item with `replay_count` ≥ 3 | Ticket |

**"New failure class" is the highest-value alert in this table** and the one teams most often lack. A fingerprint that has never been seen before, appearing shortly after a deploy, is a regression with a timestamp and a release SHA attached. That alert routinely turns a two-hour investigation into a two-minute rollback decision.

Route by ownership: platform-wide signals page the on-call engineer; single-tenant integration failures should go to whoever owns customer integrations, because the fix is usually a conversation with the merchant, not a code change.

## 3. Fingerprinting: 4,000 rows, one incident

Raw dead letters are unusable at volume. Grouping is what makes them tractable, and grouping requires a stable fingerprint.

The naive approach — hash the error message — fails because messages contain variable data: `"invoice 4471 not found"` and `"invoice 4472 not found"` are the same bug with different hashes. Hash the *structure* instead:

```python
def fingerprint_for(exc: Exception) -> str:
    frames = traceback.extract_tb(exc.__traceback__)
    app_frames = [f for f in frames if "/site-packages/" not in f.filename]
    skeleton = "|".join(f"{f.filename}:{f.name}:{f.lineno}" for f in (app_frames or frames)[-8:])
    return hashlib.sha256(f"{type(exc).__name__}|{skeleton}".encode()).hexdigest()[:32]
```

Filtering to application frames matters: three different library call paths that all bottom out in the same bug in your code should group together. Two caveats — line numbers change on every refactor, so a fingerprint is stable within a release series but not across them (store `release_sha` alongside so you can see the transition), and for `PermanentError` you should prefer the explicit `error_code` over the traceback, since the code is a deliberate, stable identity you control.

Build the triage view around fingerprints, not rows:

```sql
SELECT fingerprint,
       error_code,
       count(*)                        AS occurrences,
       count(DISTINCT tenant_id)       AS tenants,
       min(first_failed_at)            AS started,
       max(last_failed_at)             AS latest,
       sum((raw_payload->>'amount')::numeric) FILTER (
           WHERE raw_payload ? 'amount') AS amount_at_risk,
       (array_agg(id ORDER BY last_failed_at DESC))[1] AS sample_id
FROM dead_letter
WHERE status IN ('pending', 'investigating')
GROUP BY fingerprint, error_code
ORDER BY occurrences DESC;
```

One screen, one row per bug, sorted by impact, with a sample to open and money at risk quantified. That query is the whole triage UI, and it is worth putting behind an admin page.

## 4. Correlation and tracing

Every message needs a `correlation_id` that survives the whole journey: the inbound webhook request, the enqueue, every retry, the dead letter row, and every replay. In practice, use the provider's reference where one exists (it is naturally unique and it is what a support engineer will search for when a merchant calls), and generate one where it doesn't.

Log it structurally on every hop:

```python
logger.error(
    "reconciliation.dead_lettered",
    extra={
        "correlation_id": correlation_id,
        "tenant_id": tenant_id,
        "error_code": code,
        "fingerprint": fp,
        "attempts": attempts,
        "trace_id": current_trace_id(),
        "release_sha": settings.RELEASE_SHA,
    },
)
```

With OpenTelemetry, propagate the trace context in the message headers and store `trace_id` on the dead letter row. The payoff is direct: from an entry in the DLQ you can open the exact trace of the failing execution, including the downstream calls it made, months after the fact.

## 5. The triage runbook

Alerts without a runbook produce an engineer at 03:00 reading source code. Write the decision tree down.

**Step 1 — Classify the blast radius.**
Run the fingerprint query. One tenant, one fingerprint → tenant integration issue, likely not a page-worthy platform event; consider quarantining the tenant and handing off to the integrations owner. Many tenants, one fingerprint → platform bug, check recent deploys against `release_sha`. Many fingerprints, many tenants → infrastructure event (database, broker, network); check dependency health before reading any application code.

**Step 2 — Stop the bleeding.**
Is the DLQ still filling? If yes, the priority is the arrival rate, not the backlog. Options in order of preference: quarantine the affected tenant(s); disable the affected task via feature flag; roll back the deploy. Do not start replaying while arrivals continue — you will be replaying into the same failure and inflating `replay_count`.

**Step 3 — Determine the fix class.** This is the decision that determines everything downstream:

- **Bad code, good data** → fix, deploy, replay unmodified. The common and happy case.
- **Good code, bad data, repairable** → repair the payload (with an audit record — Part 6), then replay.
- **Good code, bad data, unrepairable** → the payload is genuinely unusable. Discard with a documented reason, and if money is involved, raise a manual journal entry. It must not simply be deleted.
- **Good code, good data, missing prerequisite** → the referenced entity doesn't exist yet, or arrived out of order. Usually this means the item should never have been dead-lettered at all; see Part 7.
- **Duplicate of already-applied work** → resolve as `duplicate_ignored`. Verify against the ledger before closing.

**Step 4 — Replay, in a controlled way.** Dry run, small batch, verify, then the rest. Part 6 covers the mechanics.

**Step 5 — Close the loop.** Every dead letter must reach a terminal status with a resolution note and an actor. Then ask the question that prevents recurrence: *should this have been dead-lettered at all?* If the answer is no — it was transient, or it was a business exception — the fix belongs in the classification logic of Part 1, not in the triage process.

## 6. Reviewing the DLQ as a practice

Two rituals keep this from decaying:

**A weekly triage rotation.** One engineer owns DLQ triage for the week: clear open items, group new fingerprints, file tickets for anything systemic. Half an hour if the system is healthy, and if it is much more than that, that is itself the finding.

**A monthly failure-class review.** Look at the aggregate: which error codes dominate, which tenants recur, what proportion of items were replayed successfully (a high number means you are dead-lettering things that should have been retried, or that your fixes are good), and whether `dlq_open_items` trends up or down over the month.

The health target is simple and worth stating in an SLO: **open items trend to zero, and the oldest is younger than a week.** A DLQ that is empty most of the time is one whose alerts you will still believe in a year.

---

## Takeaways

1. Measure arrival rate and age, not just depth. Depth is accumulated debt; rate is a live incident.
2. `dlq_tenants_affected` and "new fingerprint after a deploy" are the two highest-signal alerts you can build.
3. Fingerprint on traceback structure (application frames only), not on error message text, and store the release SHA alongside.
4. Triage by fingerprint group, not by row. One SQL query is a usable triage UI.
5. Propagate a correlation ID from webhook to dead letter to replay, and store the trace ID so you can open the original execution months later.
6. Expose "unreconciled amount" as a business metric — it is how this work gets prioritised.
7. Write the runbook, rotate the triage duty, and treat a growing DLQ as an SLO breach rather than background noise.

**Next:** [Part 6 — Replay, Repair, and Schema Evolution](06-replay-repair-schema-evolution.md).
