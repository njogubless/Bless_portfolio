# Hardening the Reconciliation Worker

### A seven-part series on retries, dead letter queues, and failure handling in a multi-tenant SaaS

---

Most teams discover dead letter queues the same way: something in production is stuck in a loop, logs are full of the same traceback repeating every two seconds, and a queue that should be empty has forty thousand messages in it. Someone says "we should add a DLQ" and the ticket gets written.

Then the DLQ gets built as a table nobody reads, and eighteen months later there are 200,000 rows in it, some of which represent money that was never posted to a ledger.

This series is about doing it properly. It treats the dead letter queue not as a bug-catching afterthought but as a designed component of the system with its own operational contract: what enters it, what it stores, who is paged when it fills, how a message leaves it, and what happens to the business state in the meantime.

The running example is a **reconciliation worker in a multi-tenant SaaS** — a background consumer that ingests payment provider callbacks and statements, matches them against internal records, and updates a ledger. Multi-tenancy is not decoration here. It changes the isolation model, the alerting thresholds, the replay semantics, and the data protection requirements in ways that single-tenant advice ignores.

### Stack assumptions

Examples are Python: **Celery** on Redis or RabbitMQ, **Django/DRF** and **FastAPI**, **PostgreSQL**. Where broker behaviour differs materially, RabbitMQ, SQS and Kafka are each covered on their own terms, because the semantics are genuinely not interchangeable. The architectural arguments are language-agnostic; the code is there to make them concrete.

---

## The series

**[Part 1 — Delivery Semantics and the Anatomy of a Poison Pill](01-delivery-semantics-and-poison-pills.md)**
Why a worker retries forever in the first place. At-least-once delivery, acknowledgement models, head-of-line blocking, and a failure taxonomy that actually drives control flow.

**[Part 2 — Retry Policy: Backoff, Budgets, and Idempotency](02-retry-policy-and-idempotency.md)**
Exponential backoff with jitter, retry budgets, circuit breakers, visibility timeouts, and the idempotency work you must do *before* retries are safe.

**[Part 3 — Building the Dead Letter Queue](03-building-the-dlq.md)**
Broker-native dead lettering versus an application-level dead letter store. Envelope design. Why reconciliation workloads usually want a table, not a queue.

**[Part 4 — Multi-Tenancy: Isolation, Fairness, and Blast Radius](04-multi-tenancy-isolation-and-fairness.md)**
Noisy neighbours, per-tenant quarantine, fair scheduling, tenant-scoped dead letter storage, and the cross-tenant leakage bugs that hide in replay code.

**[Part 5 — Observability: Metrics, Fingerprints, and Runbooks](05-observability-and-runbooks.md)**
What to measure, what to alert on, how to collapse 4,000 failures into one incident, and the triage decision tree an on-call engineer follows at 03:00.

**[Part 6 — Replay, Repair, and Schema Evolution](06-replay-repair-schema-evolution.md)**
Replay as a first-class feature: dry runs, rate limiting, ordering, payload repair with audit trails, and versioned envelopes that survive a year of schema drift.

**[Part 7 — Reconciliation Is Different: Technical Failures vs Business Exceptions](07-reconciliation-specific-concerns.md)**
The most expensive mistake in this whole design: dead-lettering a transaction that simply hasn't matched *yet*. Suspense accounts, matching windows, and money-safety invariants.

---

## How to read it

Parts 1–3 are foundational and sequential. Part 4 is the one that matters if you are shipping SaaS. Parts 5 and 6 are operational and can be read independently. Part 7 is domain-specific to reconciliation and financial workloads, and is the part most likely to save you from a genuinely bad incident.

If you only read one: **Part 7**. It describes a category error that a correctly-built DLQ will happily help you commit.
