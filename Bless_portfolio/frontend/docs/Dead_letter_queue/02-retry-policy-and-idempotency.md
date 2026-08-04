# Part 2 — Retry Policy: Backoff, Budgets, and Idempotency

*Hardening the Reconciliation Worker, Part 2 of 7*

---

Part 1 established that retry is the default behaviour of an at-least-once system. This part is about controlling it. Two rules govern everything below:

1. **A retry you cannot afford to have execute twice is a bug, not a retry.** Idempotency comes first, chronologically and architecturally.
2. **Retries are a load multiplier aimed at a system that is already unhealthy.** Every retry policy is also a self-DDoS policy if you get the parameters wrong.

## 1. Idempotency first

Under at-least-once delivery, duplicate execution is not an edge case, it is a scheduled event. It happens on worker crash, on visibility timeout expiry mid-processing, on network partition during ack, on consumer group rebalance, and on every manual replay you will ever run.

For a reconciliation worker, the invariant is: *processing the same provider event N times must produce the same ledger state as processing it once.*

The weak way to do this is a read-then-write check:

```python
if not LedgerEntry.objects.filter(provider_ref=ref).exists():
    LedgerEntry.objects.create(...)     # race window lives here
```

Two workers running concurrently — which is exactly what happens on visibility-timeout redelivery — will both see `False` and both insert. The check must be enforced by the database, not by application control flow.

**Use a unique constraint, and let the insert be the check:**

```sql
CREATE TABLE ledger_entry (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    provider_ref    TEXT NOT NULL,
    amount          NUMERIC(20,4) NOT NULL,
    currency        CHAR(3) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_ledger_tenant_ref UNIQUE (tenant_id, provider_ref)
);
```

The scope of that key is a design decision with teeth. `(tenant_id, provider_ref)` is right for most SaaS: provider references are only unique within a merchant's account, and a global unique index on `provider_ref` alone will eventually cause one tenant's write to fail because a different tenant happened to receive the same reference. That failure is a cross-tenant data bug wearing an `IntegrityError` costume.

**Then make the whole unit of work atomic and idempotent:**

```python
from django.db import transaction, IntegrityError

def apply_reconciliation(payload: CallbackPayload) -> str:
    try:
        with transaction.atomic():
            entry = LedgerEntry.objects.create(
                tenant_id=payload.tenant_id,
                provider_ref=payload.provider_ref,
                amount=payload.amount,
                currency=payload.currency,
            )
            Invoice.objects.filter(
                tenant_id=payload.tenant_id,
                provider_ref=payload.provider_ref,
            ).update(status="PAID", settled_at=payload.occurred_at)
            return "applied"
    except IntegrityError as exc:
        if _is_unique_violation(exc, "uq_ledger_tenant_ref"):
            return "duplicate_ignored"    # success, not failure
        raise
```

Two details worth stealing. First, the duplicate path returns *success* — a redelivered message that has already been applied must acknowledge cleanly, not retry and not dead letter. Second, the constraint name is checked explicitly. Catching bare `IntegrityError` and assuming "duplicate" will one day swallow a foreign key violation and silently drop a payment.

**Where the side effect isn't a database write** — sending an SMS, calling a settlement API, emitting a webhook — the unique constraint trick doesn't apply. Use an idempotency key passed to the downstream service (Stripe and most modern payment APIs support this natively), or record intent in a table inside the same transaction and perform the side effect from an outbox after commit. Never perform a non-idempotent external side effect inside a retryable task without one of these.

**Non-atomic multi-step tasks are the remaining trap.** If a task writes the ledger, then calls the provider, then updates the invoice, a failure at step two leaves partial state that step one will not redo on retry. Either wrap the whole thing in a transaction (and keep external calls out of it), or split into separate tasks each with its own idempotency key, chained on success. A long task with several independent side effects is a task that cannot be safely retried.

## 2. Backoff and jitter

Only once idempotency holds should you tune aggression.

**Fixed-interval retry is the wrong default.** If the failure cause is an overloaded dependency, retrying every 2 seconds adds load to the thing you need to recover. Exponential backoff gives the dependency room:

```
delay = min(base * 2 ** attempt, cap)
```

With `base=2, cap=600`: 2s, 4s, 8s, 16s, 32s… capped at 10 minutes.

**Jitter is not optional.** A dependency outage fails a thousand messages at roughly the same instant. Without jitter, all thousand retry at exactly `t+2`, then `t+6`, then `t+14` — a synchronised thundering herd that re-breaks the dependency the moment it recovers. Full jitter is the standard fix:

```python
import random

def backoff_delay(attempt: int, base: float = 2.0, cap: float = 600.0) -> float:
    return random.uniform(0, min(cap, base * (2 ** attempt)))
```

In Celery this is configuration rather than code:

```python
@app.task(
    bind=True,
    autoretry_for=(TransientError,),
    retry_backoff=2,          # base delay in seconds, doubles each attempt
    retry_backoff_max=600,    # cap
    retry_jitter=True,        # randomise — leave this on
    max_retries=6,
    acks_late=True,
    reject_on_worker_lost=True,
)
def reconcile(self, raw: dict):
    ...
```

`acks_late=True` is what makes a hard worker kill (OOM, SIGKILL, node eviction) redeliver rather than vanish. `reject_on_worker_lost=True` is its necessary companion. The cost is that you are now explicitly in duplicate-execution territory — which section 1 already handled.

**Attempt caps by failure class**, following Part 1's taxonomy:

| Class | Max attempts | Rationale |
|---|---|---|
| Permanent | 0 | The payload is wrong. Dead letter immediately. |
| Ambiguous | 2–3 | Cheap benefit of the doubt, bounded blast radius. |
| Transient | 5–8 | Long enough to ride out a typical dependency outage. |

Convert wall-clock to attempts deliberately. Six attempts with base 2 and a 600s cap spans roughly 20 minutes. If your database failover takes 90 seconds, that's ample. If your provider's maintenance windows are two hours, six attempts will dead letter a pile of perfectly good messages, and you should either raise the cap or — better — use a circuit breaker.

## 3. Circuit breakers: the thing retries can't do

Backoff limits how hard *one message* pushes. It does nothing about ten thousand messages each independently discovering that the provider is down. Each one burns its retry budget, exhausts it, and lands in the DLQ. You then have ten thousand dead-lettered messages that were never actually malformed, and a replay job ahead of you.

A circuit breaker fixes the class of problem, not the instance: when the failure rate against a dependency crosses a threshold, stop calling it entirely and stop consuming work that needs it.

```python
import time, redis

r = redis.Redis()

class CircuitOpen(TransientError):
    pass

def call_provider(tenant_id: str, fn, *args):
    key = f"cb:provider:{tenant_id}"
    state = r.hgetall(key)

    if state.get(b"state") == b"open":
        if time.time() < float(state[b"opens_until"]):
            raise CircuitOpen("provider circuit open")
        r.hset(key, "state", "half_open")     # allow one probe through

    try:
        result = fn(*args)
    except TransientError:
        failures = r.hincrby(key, "failures", 1)
        r.expire(key, 300)
        if failures >= 20:
            r.hset(key, mapping={"state": "open", "opens_until": time.time() + 60})
        raise
    else:
        r.delete(key)                          # closed again
        return result
```

The important interaction with the DLQ: **a message that fails because the circuit is open should not count against its retry budget.** It never reached the dependency. Either re-queue it with a delay equal to the circuit's cooldown, or exclude `CircuitOpen` from attempt counting. Otherwise your breaker — a protection mechanism — becomes the thing that mass-dead-letters healthy traffic.

In a multi-tenant system, key the breaker per tenant where the dependency is per tenant (one merchant's misconfigured API credentials shouldn't trip the circuit for everyone), and globally where the dependency is shared. Part 4 develops this.

## 4. Retry budgets: bounding the multiplier

Per-message attempt caps bound one message. They do not bound the system. During a broad outage, a queue of 50,000 messages with a cap of 6 generates up to 300,000 executions — often against a dependency that is failing *because* of load.

A retry budget caps retries as a proportion of total work, system-wide:

> Retries may not exceed 20% of total request volume in any 60-second window.

Above that ratio, retries are dropped straight to the DLQ rather than scheduled. This is a deliberate trade: some messages that would have succeeded on attempt four get dead-lettered, in exchange for the system not amplifying its own outage. Implement it as a Redis sliding-window counter checked before scheduling a retry; export it as a metric, because a saturated retry budget is one of the highest-signal alerts you can have.

## 5. The visibility timeout bug

This deserves its own section because it is subtle, common, and produces "impossible" symptoms.

If a task takes longer than the broker's visibility timeout (SQS `VisibilityTimeout`, Celery-on-Redis `visibility_timeout`, RabbitMQ `consumer_timeout`), the broker concludes the consumer is dead and redelivers **while the original worker is still running**. Two workers now process the same message concurrently. Symptoms: duplicate ledger rows, deadlocks between the two copies, `ApproximateReceiveCount` climbing on messages that eventually succeed, and totals that are wrong by exactly one transaction.

Rules:

- Set the visibility timeout to **at least 3× your p99 task duration**, not your median.
- For genuinely long tasks, extend the timeout during processing (SQS `ChangeMessageVisibility` heartbeat) rather than setting a huge static value — a huge value means a genuinely crashed worker's messages are stuck invisible for that whole period.
- Better: keep tasks short. Split long reconciliation runs into per-batch tasks. A 4-hour statement reconciliation should be a coordinator that fans out into hundreds of small idempotent units.
- Never let a task's *retry* delay exceed the visibility timeout in brokers where the retry is implemented by re-enqueueing the same delivery.

## 6. Putting the retry path together

```python
@app.task(bind=True, acks_late=True, reject_on_worker_lost=True, max_retries=8)
def reconcile(self, raw: dict):
    attempt = self.request.retries

    try:
        payload = CallbackPayload.model_validate(raw)
    except ValidationError as exc:
        return dead_letter(raw, code="SCHEMA_INVALID", detail=exc.json(), attempts=attempt)

    try:
        with tenant_context(payload.tenant_id):
            return apply_reconciliation(payload)

    except Exception as exc:
        err = classify(exc)

        if isinstance(err, PermanentError):
            return dead_letter(raw, code=err.code, detail=str(err), attempts=attempt)

        if isinstance(err, CircuitOpen):
            # Not the message's fault — don't spend its budget.
            raise self.retry(exc=err, countdown=60, max_retries=None)

        limit = 3 if isinstance(err, AmbiguousError) else 8
        if attempt >= limit or not retry_budget.allow():
            return dead_letter(
                raw, code="RETRIES_EXHAUSTED", detail=str(err), attempts=attempt
            )

        raise self.retry(exc=err, countdown=backoff_delay(attempt))
```

Every exit from this function is deliberate: applied, duplicate-ignored, dead-lettered with a machine-readable reason, or scheduled for a retry whose delay and budget are both bounded. There is no path that loops forever and no path that silently drops data.

---

## Takeaways

1. Idempotency is a prerequisite for retries, not a companion feature. Enforce it with database constraints scoped to `(tenant_id, ref)`, never with read-then-write checks.
2. A duplicate that has already been applied is a *success*. Acknowledge it.
3. Exponential backoff with full jitter, always. Synchronised retries re-break recovering dependencies.
4. Cap attempts by failure class: 0 for permanent, 2–3 for ambiguous, 5–8 for transient.
5. Circuit breakers fix the failure class; make sure open-circuit failures don't consume a message's retry budget, or your breaker will mass-dead-letter healthy traffic.
6. Retry budgets bound system-wide amplification. Alert on budget saturation.
7. Visibility timeout must exceed p99 task duration by a wide margin, or you get concurrent duplicate processing that looks impossible from the logs.

**Next:** [Part 3 — Building the Dead Letter Queue](03-building-the-dlq.md).
