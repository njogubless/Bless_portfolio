# Part 1 — Delivery Semantics and the Anatomy of a Poison Pill

*Hardening the Reconciliation Worker, Part 1 of 7*

---

Before you can reason about a dead letter queue, you have to be precise about why a message comes back at all. Most engineers know that queues "retry on failure." Far fewer can say exactly what mechanism causes the retry, who decides, and what state the message is in while it happens. That vagueness is where poison pills breed.

## 1. Delivery semantics: pick your poison

There are three delivery guarantees a broker can offer, and only two of them are real.

**At-most-once.** The consumer acknowledges the message before processing it. If the worker crashes mid-work, the message is gone. No duplicates, guaranteed data loss under failure. Occasionally correct — metrics sampling, cache warming. Never correct for money.

**At-least-once.** The consumer acknowledges *after* successful processing. If the worker crashes, times out, or throws before acknowledging, the broker redelivers. No data loss, guaranteed duplicates under failure. This is what you almost always want, and it is the default in RabbitMQ with manual acks, SQS, and Kafka with manual offset commits.

**Exactly-once.** Marketing. Kafka offers exactly-once *semantics* within the Kafka boundary (transactional producer + consumer offsets committed in the same transaction), which is real and useful and does not extend to your Postgres write, your ledger update, or the HTTP call you make to the payment provider. The moment your side effect leaves the broker's transactional domain, you are back to at-least-once plus idempotency. Design for that.

**The consequence that matters:** if you have chosen at-least-once — and you have — then *retry is the default behaviour of your system*, not an opt-in feature. Every unhandled exception is an instruction to the broker to try again. A dead letter queue is how you revoke that instruction.

## 2. Acknowledgement models, per broker

The redelivery mechanism differs enough between brokers that copy-pasted advice actively misleads.

**RabbitMQ.** The consumer holds an unacknowledged delivery. `basic.ack` removes it; `basic.nack`/`basic.reject` with `requeue=true` puts it back on the queue — typically at the head, which is what produces the tight, log-flooding loop. With `requeue=false`, the message is discarded *or* routed to a dead-letter exchange if one is configured. A crashed or disconnected consumer causes automatic redelivery of everything it held unacknowledged.

**SQS.** There is no ack/nack. A received message becomes invisible for the duration of the *visibility timeout*. Delete it and it's gone; fail to delete it and it silently reappears when the timer expires. `ApproximateReceiveCount` tracks how many times this has happened. Crucially, a message that takes longer to process than the visibility timeout will be redelivered **while your worker is still processing it** — the single most common source of "impossible" duplicate processing in production.

**Kafka.** Nothing is redelivered in the RabbitMQ sense. The consumer group holds an offset; if you don't commit it, you re-read the same offset on the next poll or after a rebalance. A message that always throws means the offset never advances and **the entire partition stops**. Not just that message — every message behind it on that partition, potentially for many tenants. Kafka poison pills are the most damaging class because the blast radius is a whole partition, and there is no native dead lettering to bail you out.

**Celery on Redis.** Celery's Redis transport emulates visibility timeouts (`broker_transport_options={'visibility_timeout': ...}`, default one hour). With `task_acks_late=True`, a task that raises after retries are exhausted is simply marked FAILURE — Redis has no dead letter concept at all. Anything resembling a DLQ is something you build. This is the situation most Django/Celery shops are actually in, and it is why Part 3 argues for an application-level dead letter store.

## 3. What a poison pill actually costs you

A poison pill is a message that will fail on every attempt, forever, because the failure is a property of the message rather than of the environment. A truncated JSON body. A `amount` field that arrived as `"N/A"`. A callback referencing a `checkout_request_id` that was never persisted because the originating request rolled back.

The naive cost is "one record doesn't get processed." The real costs compound:

- **Retry amplification.** One message failing every 2 seconds for a weekend is ~200,000 executions. If each one opens a DB connection and does three queries, you have burned 600,000 queries on a message that was doomed at parse time.
- **Head-of-line blocking.** With Kafka partitions, or with prefetch and ordered delivery in RabbitMQ, the failing message delays the messages behind it. Your p99 for *every other tenant* degrades because one merchant's integration sent malformed data.
- **Alert fatigue and log burial.** The same traceback 200,000 times buries every other error in the window. The incident you actually needed to see is somewhere in there.
- **Worker starvation.** Concurrency slots occupied by a doomed message are slots not processing real work. At sufficient volume, a handful of poison pills consumes a whole worker pool.
- **Cost.** In cloud terms this is real money: SQS requests, egress, CPU, connection pool pressure that forces you to scale Postgres.

## 4. The two failure modes you must not conflate

There is a tempting shortcut:

```python
@app.task
def reconcile(payload):
    try:
        _reconcile(payload)
    except Exception:
        logger.exception("reconciliation failed")
        # swallowed — no retry, no loop, no problem
```

This stops the loop by converting every failure into silent data loss. A transient database blip now permanently drops a payment record, and the only evidence is a log line that rotated out of retention eleven days ago. In a reconciliation pipeline, this is strictly worse than the poison pill it was written to fix: the poison pill is loud, and loud problems get fixed.

The correct move is to classify, then act:

**Transient failures** are properties of the *environment*, not the message. Connection resets, deadlocks, upstream 502s and timeouts, lock contention, rate limits. The same message will very likely succeed later. Retry these — with backoff, which is Part 2.

**Permanent failures** are properties of the *message*. Schema violations, unparseable values, missing required fields, references to entities that will never exist, business rules that can never be satisfied by this payload. Retrying is pure waste. Dead letter these immediately, on the first attempt — do not spend five exponential retries proving that a missing field is still missing.

**Ambiguous failures** are the hard middle. `IntegrityError` might be a genuine duplicate (permanent, and possibly benign) or a race with a concurrent writer (transient). `404 from the provider` might mean "not yet visible" (transient, common with eventually-consistent payment APIs) or "never existed" (permanent). Default ambiguous cases to transient with a **low** max-attempt count — a bounded number of retries, then dead letter. You get the benefit of the doubt without the infinite loop.

## 5. Making the taxonomy structural

Classification must live in the type system, not in a chain of `if isinstance` checks scattered across handlers. Define the taxonomy once and make every failure path choose a branch:

```python
class ReconciliationError(Exception):
    """Base for all reconciliation failures."""


class TransientError(ReconciliationError):
    """Environmental. The same payload will likely succeed later."""


class PermanentError(ReconciliationError):
    """A property of the payload. Retrying cannot help."""
    def __init__(self, message, *, code, field=None):
        super().__init__(message)
        self.code = code          # stable, machine-readable, e.g. "SCHEMA_INVALID"
        self.field = field        # which part of the payload is at fault


class AmbiguousError(ReconciliationError):
    """Could be either. Bounded retries, then dead letter."""
```

Then map third-party exceptions at the boundary, where you still have the context to judge:

```python
import httpx
from django.db import OperationalError, IntegrityError
from pydantic import ValidationError

def classify(exc: Exception) -> ReconciliationError:
    match exc:
        case ValidationError():
            return PermanentError(str(exc), code="SCHEMA_INVALID")
        case httpx.TimeoutException() | httpx.ConnectError():
            return TransientError(str(exc))
        case httpx.HTTPStatusError() if exc.response.status_code >= 500:
            return TransientError(str(exc))
        case httpx.HTTPStatusError() if exc.response.status_code == 429:
            return TransientError(str(exc))
        case httpx.HTTPStatusError() if exc.response.status_code == 404:
            return AmbiguousError(str(exc))     # provider may be lagging
        case httpx.HTTPStatusError():
            return PermanentError(str(exc), code="PROVIDER_REJECTED")
        case OperationalError():
            return TransientError(str(exc))
        case IntegrityError():
            return AmbiguousError(str(exc))
        case _:
            # Unknown exceptions are ambiguous, not transient.
            # An unrecognised bug should not be retried 20 times.
            return AmbiguousError(str(exc))
```

The default case is the one people get wrong. Unknown exception types are usually *bugs* — `AttributeError`, `KeyError`, `TypeError` — and bugs are deterministic. Treating unknowns as transient means every new code defect becomes a retry storm. Treating them as ambiguous, with a max of two or three attempts, contains the damage while leaving room for the occasional genuinely flaky unknown.

## 6. Validate before you do work

The cheapest poison pill is one you never let into the expensive part of the pipeline. Parse and validate the payload at the very top of the task, before any I/O:

```python
from pydantic import BaseModel, ValidationError, Field
from decimal import Decimal
from datetime import datetime

class CallbackPayload(BaseModel):
    tenant_id: str
    provider_ref: str = Field(min_length=1)
    amount: Decimal = Field(gt=0)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    occurred_at: datetime
    schema_version: int = 1


@app.task(bind=True)
def reconcile(self, raw: dict):
    try:
        payload = CallbackPayload.model_validate(raw)
    except ValidationError as exc:
        # Zero retries. The shape is wrong and will stay wrong.
        dead_letter(raw, reason="SCHEMA_INVALID", detail=exc.json())
        return
    _reconcile(payload)
```

Two things are happening here. First, a whole class of failure is diverted before it can touch the database or the provider API. Second — and this matters more than it looks — the boundary between "malformed" and "correct but unprocessable" becomes a line of code rather than a judgement call, which means it is testable.

Note that `dead_letter()` receives `raw`, not `payload`. Always preserve the original. The moment you dead-letter a parsed or partially-transformed object, you have destroyed your ability to replay the message after you fix the parser. Part 3 goes into what else the envelope must carry.

---

## Takeaways

1. At-least-once delivery means retry is your system's default; a DLQ is the mechanism for revoking it.
2. Know your broker's specific redelivery mechanism — visibility timeouts, unacked deliveries and uncommitted offsets fail in materially different ways, and Kafka's blast radius is a whole partition.
3. Never swallow exceptions to stop a loop. Silent data loss in a reconciliation pipeline is worse than a loud failure.
4. Classify failures as transient, permanent or ambiguous, in the type system, and let the class drive retry behaviour.
5. Default unknown exceptions to ambiguous with a low attempt cap — most unknowns are bugs, and bugs are deterministic.
6. Validate at the boundary before doing I/O, and dead letter the *raw* payload.

**Next:** [Part 2 — Retry Policy: Backoff, Budgets, and Idempotency](02-retry-policy-and-idempotency.md), where we make retrying safe before we make it aggressive.
