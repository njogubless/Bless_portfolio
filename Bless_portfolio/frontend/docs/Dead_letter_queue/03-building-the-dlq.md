# Part 3 — Building the Dead Letter Queue

*Hardening the Reconciliation Worker, Part 3 of 7*

---

A dead letter queue is a destination for messages that the system has decided not to attempt again. That is the whole concept. Everything interesting is in the details: where it lives, what it stores, and what contract it offers to the humans who have to act on it.

The framing that keeps designs honest: **a DLQ is not an error log. It is a work queue for humans.** Every entry represents a unit of unfinished business that someone must resolve, and it should be designed with the same care as any other queue — with a producer contract, a consumer (a person, or a repair job), a retention policy, and a definition of done.

## 1. Broker-native dead lettering

### RabbitMQ: dead letter exchanges

RabbitMQ has the most complete native support. A queue is declared with a dead-letter exchange, and messages are routed there when they are rejected with `requeue=false`, when they expire via TTL, or when a length limit is exceeded.

```python
channel.exchange_declare("reconcile.dlx", exchange_type="direct", durable=True)
channel.queue_declare("reconcile.dlq", durable=True)
channel.queue_bind("reconcile.dlq", "reconcile.dlx", routing_key="reconcile")

channel.queue_declare(
    "reconcile",
    durable=True,
    arguments={
        "x-dead-letter-exchange": "reconcile.dlx",
        "x-dead-letter-routing-key": "reconcile",
        "x-queue-type": "quorum",
        "x-delivery-limit": 5,     # quorum queues: auto dead-letter after N redeliveries
    },
)
```

`x-delivery-limit` on quorum queues is the single most valuable line here: the broker itself caps redeliveries, so even a bug in your application's retry logic cannot produce an infinite loop. RabbitMQ also adds an `x-death` header recording the reason, count, original exchange and timestamps — the beginnings of an envelope, though a thin one.

### SQS: redrive policy

```json
{
  "RedrivePolicy": {
    "deadLetterTargetArn": "arn:aws:sqs:eu-west-1:123456789012:reconcile-dlq",
    "maxReceiveCount": 5
  }
}
```

After five receives without deletion, SQS moves the message to the DLQ automatically. It is genuinely zero-effort, and AWS provides a built-in *redrive* operation to move messages back. Two caveats: the DLQ inherits the source queue's retention (set it to the maximum, 14 days, or you will silently lose dead letters), and `maxReceiveCount` counts *receives*, so a message that times out due to slow processing burns budget without ever having failed.

### Kafka: no native DLQ

Kafka has no dead letter concept. The consumer must implement it: on a non-retryable failure, produce the record to a `.DLT` topic and commit the offset so the partition advances.

```python
def handle(record):
    try:
        process(record)
    except PermanentError as exc:
        producer.send(
            "reconcile.DLT",
            key=record.key,
            value=record.value,                      # raw bytes, unparsed
            headers=[
                ("dlt-original-topic", record.topic.encode()),
                ("dlt-original-partition", str(record.partition).encode()),
                ("dlt-original-offset", str(record.offset).encode()),
                ("dlt-error-class", type(exc).__name__.encode()),
                ("dlt-error-code", exc.code.encode()),
            ],
        )
        producer.flush()          # flush BEFORE committing the offset
    consumer.commit()
```

The ordering matters: flush the DLT produce before committing, or a crash between the two loses the message entirely. Note also that dead-lettering breaks Kafka's per-key ordering guarantee — event 3 is parked while events 4 and 5 proceed. For a ledger this can be significant, and Part 6 discusses ordering on replay.

### Celery on Redis: nothing

Celery has no dead letter mechanism, and Redis has no equivalent primitive. A task that exhausts retries is recorded as FAILURE in the result backend, which by default expires in 24 hours and contains a traceback string rather than your payload. For most Django/Celery teams this means the DLQ is something you build — which, for reconciliation, turns out to be the better outcome anyway.

## 2. Why reconciliation wants a table, not a queue

Broker-native dead lettering is excellent at stopping the loop. It is poor at everything that comes after, because a queue is a bad interface for the questions you actually ask about dead letters:

- How many failures does tenant 47 have, and are they all the same bug?
- Which of these represent money that has not been posted?
- Show me everything that failed with `SCHEMA_INVALID` between Friday and Monday.
- Which of these were already fixed and replayed, by whom, and when?

Those are queries. A queue can't answer them; it can only give you messages one at a time, and reading a message to inspect it either consumes it or requires awkward peeking. A Postgres table answers all of them with SQL, joins to your tenant and ledger tables, participates in the same transaction as your business writes, and gives you an audit trail for free.

**The pragmatic architecture is both:** broker-native dead lettering as the last-resort safety net that catches what your application never got to handle (worker OOM, deserialization failures before your code runs, bugs in the retry logic itself), and an application-level dead letter table as the primary, semantically rich store that your team and your admin UI actually work with.

## 3. Envelope design

This is where most implementations are too thin, and thinness is only discovered three months later when you try to replay and can't. Store the following:

**Identity and routing**
`id` (UUID, stable across replays), `tenant_id`, `queue`/`task_name`, `correlation_id`, `causation_id`.

**The payload**
`raw_payload` — the original bytes or JSON, exactly as received, before any parsing or coercion. Plus `content_type` and `schema_version`. If you store a transformed payload, you cannot replay after fixing the transformer, which is the single most common reason to replay.

**Failure detail**
`error_code` (stable, machine-readable — `SCHEMA_INVALID`, `TENANT_SUSPENDED`, `RETRIES_EXHAUSTED`), `error_class`, `error_message`, `traceback`, and `fingerprint` (a hash of the normalised traceback — see Part 5, this is what turns 4,000 rows into one incident).

**Lifecycle**
`attempts`, `first_failed_at`, `last_failed_at`, `dead_lettered_at`, `status` (`pending`, `investigating`, `replaying`, `resolved`, `discarded`), `resolution`, `resolved_by`, `resolved_at`, `replay_count`, `origin_dead_letter_id` (set when a replay itself dies, so you can detect ping-ponging).

**Provenance**
`worker_hostname`, `release_sha`, `broker_message_id`, `received_at`. Knowing which deploy introduced a failure class collapses investigation time dramatically.

```python
class DeadLetter(models.Model):
    class Status(models.TextChoices):
        PENDING      = "pending"
        INVESTIGATING= "investigating"
        REPLAYING    = "replaying"
        RESOLVED     = "resolved"
        DISCARDED    = "discarded"

    id             = models.UUIDField(primary_key=True, default=uuid4)
    tenant         = models.ForeignKey("tenants.Tenant", on_delete=models.PROTECT)
    task_name      = models.CharField(max_length=200)
    correlation_id = models.CharField(max_length=64, db_index=True)

    raw_payload    = models.JSONField()
    content_type   = models.CharField(max_length=64, default="application/json")
    schema_version = models.IntegerField(default=1)

    error_code     = models.CharField(max_length=64, db_index=True)
    error_class    = models.CharField(max_length=200)
    error_message  = models.TextField()
    traceback      = models.TextField(blank=True)
    fingerprint    = models.CharField(max_length=64, db_index=True)

    attempts       = models.IntegerField(default=0)
    first_failed_at= models.DateTimeField()
    last_failed_at = models.DateTimeField()
    status         = models.CharField(max_length=20, choices=Status.choices,
                                      default=Status.PENDING, db_index=True)
    resolution     = models.TextField(blank=True)
    resolved_by    = models.ForeignKey("auth.User", null=True, on_delete=models.SET_NULL)
    resolved_at    = models.DateTimeField(null=True)
    replay_count   = models.IntegerField(default=0)
    origin         = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)

    release_sha    = models.CharField(max_length=40, blank=True)
    worker_host    = models.CharField(max_length=200, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant", "status", "-last_failed_at"]),
            models.Index(fields=["fingerprint", "status"]),
            models.Index(fields=["status", "-last_failed_at"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["tenant", "task_name", "correlation_id"],
                condition=Q(status__in=["pending", "investigating"]),
                name="uq_open_dead_letter",
            ),
        ]
```

That partial unique constraint is doing real work: it collapses repeated failures of the *same* logical message into one open row with an incrementing `attempts` counter, instead of 200 rows. A DLQ that duplicates rows per attempt is a DLQ nobody can triage.

## 4. The write path

```python
import hashlib, traceback as tb_mod
from django.db import transaction
from django.utils import timezone

def fingerprint_for(exc: Exception) -> str:
    """Hash the traceback structure, not its values, so the same bug groups."""
    frames = tb_mod.extract_tb(exc.__traceback__)
    skeleton = "|".join(f"{f.filename}:{f.name}:{f.lineno}" for f in frames[-8:])
    return hashlib.sha256(f"{type(exc).__name__}|{skeleton}".encode()).hexdigest()[:32]


@transaction.atomic
def dead_letter(raw, *, code, detail, attempts, task_name, tenant_id,
                correlation_id, exc=None):
    now = timezone.now()
    dl, created = DeadLetter.objects.get_or_create(
        tenant_id=tenant_id,
        task_name=task_name,
        correlation_id=correlation_id,
        status__in=[DeadLetter.Status.PENDING, DeadLetter.Status.INVESTIGATING],
        defaults=dict(
            raw_payload=raw,
            error_code=code,
            error_class=type(exc).__name__ if exc else code,
            error_message=detail[:4000],
            traceback="".join(tb_mod.format_exception(exc))[:20000] if exc else "",
            fingerprint=fingerprint_for(exc) if exc else code,
            attempts=attempts,
            first_failed_at=now,
            last_failed_at=now,
            release_sha=settings.RELEASE_SHA,
            worker_host=socket.gethostname(),
        ),
    )
    if not created:
        dl.attempts += 1
        dl.last_failed_at = now
        dl.error_message = detail[:4000]
        dl.save(update_fields=["attempts", "last_failed_at", "error_message"])

    metrics.increment("dlq.arrived", tags={"code": code, "tenant": str(tenant_id)})
    return dl.id
```

**Two failure modes of the write path itself, which you must handle:**

*The dead letter write fails.* If Postgres is down, `dead_letter()` raises, the task fails, and the broker redelivers — which is correct, because the message is not yet safely parked. But if the DB is down and you were dead-lettering *because* of a DB error, you now have a retry loop. Guard it: if the dead letter write fails, fall back to emitting the raw envelope to a broker-native DLQ or to structured logs at ERROR with a dedicated marker that your log pipeline routes to storage. Never let the safety net's failure become silent data loss.

*The payload is too large.* Provider statements and batch callbacks can be megabytes. Storing them inline bloats the table and slows every query. Above a threshold (say 256 KB), write the payload to object storage and keep a URI in the row. Keep the metadata in Postgres — the row must remain queryable.

## 5. Wiring it in without touching every task

Celery's `on_failure` hook gives you a single choke point for the retries-exhausted path:

```python
class ReconcileTask(app.Task):
    autoretry_for = (TransientError,)
    retry_backoff = 2
    retry_backoff_max = 600
    retry_jitter = True
    max_retries = 6
    acks_late = True
    reject_on_worker_lost = True

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Fires after retries are exhausted, or on a non-retryable exception."""
        raw = kwargs.get("raw") or (args[0] if args else {})
        dead_letter(
            raw,
            code=getattr(exc, "code", "RETRIES_EXHAUSTED"),
            detail=str(exc),
            attempts=self.request.retries,
            task_name=self.name,
            tenant_id=raw.get("tenant_id"),
            correlation_id=raw.get("provider_ref", task_id),
            exc=exc,
        )


@app.task(base=ReconcileTask, bind=True)
def reconcile(self, raw: dict):
    ...
```

Every task inheriting `ReconcileTask` gets dead lettering for free, which matters because the failure you didn't anticipate is by definition in the task you didn't instrument.

## 6. What a DLQ is not

- **Not an error log.** Logs are for diagnosis; the DLQ is for *resolution*. If entries can sit there permanently without anyone acting, you have built a log with worse ergonomics.
- **Not a substitute for validation at the source.** A steadily-filling DLQ means the producer is broken. The DLQ stops the bleeding; the fix is upstream.
- **Not a place for business exceptions.** An unmatched transaction that might match tomorrow does not belong here. This distinction is important enough to be its own article — Part 7.
- **Not exempt from data protection.** Those raw payloads contain customer PII and financial detail, now sitting in a table with looser access controls than your production tables and a retention policy nobody wrote. Part 4 addresses this directly.

---

## Takeaways

1. Use broker-native dead lettering as a safety net — especially RabbitMQ quorum queues' `x-delivery-limit`, which caps redeliveries below your application logic.
2. Use an application-level dead letter *table* as the primary store: queryable, joinable, auditable, and transactional with your business writes.
3. Store the raw payload, never a parsed one. Replay after fixing the parser is the main use case.
4. Design the envelope for triage: stable error codes, traceback fingerprints, lifecycle status, resolution audit, and release SHA.
5. Collapse repeated failures of the same logical message into one row with a partial unique constraint.
6. Handle the failure of the dead-letter write itself; the safety net needs a safety net.
7. A DLQ is a work queue for humans. If nothing consumes it, it is a graveyard.

**Next:** [Part 4 — Multi-Tenancy: Isolation, Fairness, and Blast Radius](04-multi-tenancy-isolation-and-fairness.md).
