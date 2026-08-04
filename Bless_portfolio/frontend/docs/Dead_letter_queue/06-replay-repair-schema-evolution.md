# Part 6 — Replay, Repair, and Schema Evolution

*Hardening the Reconciliation Worker, Part 6 of 7*

---

Everything so far has been about getting messages *into* the dead letter store safely. This part is about getting them out. Replay is where a DLQ either earns its existence or reveals itself as an expensive log table — and it is consistently the least-designed part of the system, usually written under incident pressure as a one-off script.

Build it before you need it. The first time you replay should not be at 02:00 with a merchant on the phone.

## 1. Replay is a product feature

Treat it as such. It needs:

- **An interface** — a management command for engineers, an admin action for support, and ideally a self-service view for tenants who can fix their own data.
- **Authorisation** — replaying writes to the ledger. It is a privileged operation and must be permission-gated and logged with an actor.
- **Idempotency** — Part 2's constraints are what make replay safe. Without them, replay is a duplicate-payment generator.
- **Rate limiting** — 40,000 messages replayed at full speed is a self-inflicted denial of service on the dependency that was probably already struggling.
- **Observability** — replays should be traceable back to the dead letter they came from, and forward to the outcome.

## 2. Selection: never "replay everything"

Replay operates on a *selection*, and the selection is nearly always a fingerprint group, because a fingerprint group is exactly "the set of messages affected by the bug I just fixed."

```python
def selection(*, fingerprint=None, error_code=None, tenant_id=None,
              since=None, until=None, limit=None):
    qs = DeadLetter.objects.filter(status=DeadLetter.Status.PENDING)
    if fingerprint: qs = qs.filter(fingerprint=fingerprint)
    if error_code:  qs = qs.filter(error_code=error_code)
    if tenant_id:   qs = qs.filter(tenant_id=tenant_id)
    if since:       qs = qs.filter(last_failed_at__gte=since)
    if until:       qs = qs.filter(last_failed_at__lte=until)
    qs = qs.exclude(replay_count__gte=3)     # stop ping-pong at the source
    return qs.order_by("first_failed_at")[:limit] if limit else qs.order_by("first_failed_at")
```

Two deliberate choices. `replay_count >= 3` is excluded automatically, because a message that has failed three replays needs a human decision, not a fourth attempt. And ordering is by `first_failed_at` — original arrival order, not dead-letter order — which matters for the sequencing discussion below.

## 3. Dry run is mandatory

The replay command should default to *not* replaying. Make the destructive path require an explicit flag.

```python
class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--fingerprint")
        parser.add_argument("--tenant")
        parser.add_argument("--limit", type=int, default=100)
        parser.add_argument("--rate", type=int, default=10, help="messages/second")
        parser.add_argument("--execute", action="store_true",
                            help="Without this flag, dry run only.")

    def handle(self, *args, **opts):
        items = selection(fingerprint=opts["fingerprint"],
                          tenant_id=opts["tenant"], limit=opts["limit"])

        summary = items.values("tenant_id", "error_code").annotate(
            n=Count("id"),
            amount=Sum(Cast(KeyTextTransform("amount", "raw_payload"),
                            DecimalField(max_digits=20, decimal_places=4))),
        )
        for row in summary:
            self.stdout.write(
                f"{row['tenant_id']}  {row['error_code']:24}  "
                f"{row['n']:6} msgs  {row['amount'] or 0:>14,.2f}"
            )

        if not opts["execute"]:
            self.stdout.write(self.style.WARNING("DRY RUN — pass --execute to replay"))
            return

        replay(items, rate=opts["rate"], actor=get_system_actor())
```

The dry run output shows tenant, error class, count and monetary value — which is what tells you whether you are about to replay 12 messages or 12,000, and whether you are about to move KES 200 or KES 20 million. That number has stopped bad replays more than once.

## 4. Rate-limited execution

```python
def replay(items, *, rate: int, actor):
    interval = 1.0 / max(rate, 1)
    replayed = 0

    for dl in items.iterator(chunk_size=500):
        with transaction.atomic():
            locked = (DeadLetter.objects
                      .select_for_update(skip_locked=True)
                      .filter(pk=dl.pk, status=DeadLetter.Status.PENDING)
                      .first())
            if locked is None:
                continue                      # another operator got there first

            locked.status = DeadLetter.Status.REPLAYING
            locked.replay_count += 1
            locked.save(update_fields=["status", "replay_count"])

            transaction.on_commit(lambda dl=locked: reconcile.apply_async(
                kwargs={"raw": dl.raw_payload, "tenant_id": str(dl.tenant_id)},
                queue=f"reconcile.replay.{shard_for(dl.tenant_id)}",
                headers={"replay_of": str(dl.id), "replayed_by": str(actor.id)},
            ))

        replayed += 1
        time.sleep(interval)

    metrics.increment("dlq.replay.dispatched", replayed)
```

Four things earning their place:

**`select_for_update(skip_locked=True)` with a status re-check.** Two engineers running the same replay during an incident is normal, not exotic. This makes concurrent replays safe.

**A dedicated replay queue.** Replay traffic must not compete with live callbacks — the same interactive/bulk separation from Part 4. A replay of a week's backlog should never delay a customer's checkout confirmation.

**`transaction.on_commit`.** Dispatching inside the transaction risks the worker picking up the task before the status update commits, and processing a message whose row still says `pending`.

**`status = REPLAYING`, not `resolved`.** The item is not resolved until the replay *succeeds*. The task's success path closes it out:

```python
def on_success(self, retval, task_id, args, kwargs):
    replay_of = self.request.headers.get("replay_of") if self.request.headers else None
    if replay_of:
        DeadLetter.objects.filter(pk=replay_of).update(
            status=DeadLetter.Status.RESOLVED,
            resolved_at=timezone.now(),
            resolution=f"replayed successfully ({retval})",
        )
```

And the failure path must set it back to `pending` rather than creating a second row — the `origin` foreign key from Part 3 exists precisely so a replay that dies again links back to its source instead of duplicating it.

## 5. Ordering on replay

This is the subtle one.

Dead lettering breaks ordering. If events 3, 4 and 5 concern the same invoice, and 3 is dead-lettered while 4 and 5 process, replaying 3 an hour later applies a stale event on top of newer state. In reconciliation this can look like a settled invoice reverting to pending, or a balance moving backwards.

Three defences, in increasing order of rigour:

**Make handlers commutative.** The strongest option where it's achievable. Design the reconciliation so that applying events in any order converges to the same state: prefer `status = highest_rank(current, incoming)` over `status = incoming`, and prefer accumulating immutable ledger entries over mutating a balance field. Order-independent handlers make the whole problem disappear.

**Version guard.** Each event carries a monotonic sequence or timestamp from the source; the handler refuses to apply an event older than the entity's current version.

```python
updated = Invoice.objects.filter(
    tenant_id=tid, provider_ref=ref, source_version__lt=payload.source_version
).update(status=payload.status, source_version=payload.source_version)

if not updated:
    return "stale_event_ignored"     # success — a newer event already won
```

**Per-entity sequencing.** Hold subsequent events for an entity while an earlier one is dead-lettered. Correct, and expensive — it reintroduces head-of-line blocking at entity granularity. Reserve it for genuinely order-dependent state machines.

For most reconciliation work, commutative handlers plus a version guard is the right answer, and it is also what makes replay boring — which is the goal.

## 6. Repair, with an audit trail

Sometimes the payload itself must change: a missing field defaulted, a malformed timestamp corrected, a mis-keyed tenant reference fixed after confirming with the merchant.

**Never mutate `raw_payload`.** It is your evidence. Store the repair as a separate, additive record:

```python
class DeadLetterRepair(models.Model):
    dead_letter = models.ForeignKey(DeadLetter, on_delete=models.CASCADE,
                                    related_name="repairs")
    patch       = models.JSONField()          # JSON Merge Patch applied to raw_payload
    reason      = models.TextField()          # why, in prose, for the auditor
    evidence    = models.TextField(blank=True) # ticket, email, provider case number
    created_by  = models.ForeignKey("auth.User", on_delete=models.PROTECT)
    created_at  = models.DateTimeField(auto_now_add=True)


def effective_payload(dl: DeadLetter) -> dict:
    payload = copy.deepcopy(dl.raw_payload)
    for repair in dl.repairs.order_by("created_at"):
        payload = merge_patch(payload, repair.patch)
    return payload
```

Replay then uses `effective_payload(dl)`. The original is intact, the change is attributed, the justification is recorded, and the transformation is reproducible. In a financial system this is not bureaucracy — it is the difference between "we corrected a malformed callback" and "an engineer changed a payment amount in the database."

Constrain what may be repaired. A whitelist of repairable fields, with amounts and tenant identifiers excluded or requiring a second approver, prevents the repair mechanism from becoming a backdoor for editing money.

## 7. Schema evolution: replaying a message from six months ago

Dead letters outlive deploys. A message dead-lettered in March, replayed in September, is being handed to a consumer whose schema has moved on twice. Two failure modes: the old payload no longer validates, or worse, it validates and means something different.

**Version every envelope at write time.** `schema_version` is stored in the dead letter row, from the payload if present and from the consumer's current version if not.

**Write upcasters, not compatibility branches.** Keep the consumer single-version and migrate old payloads forward on the way in:

```python
UPCASTERS = {}

def upcaster(from_version):
    def deco(fn):
        UPCASTERS[from_version] = fn
        return fn
    return deco


@upcaster(1)
def v1_to_v2(p):
    p = dict(p)
    p["currency"] = p.pop("curr", "KES")           # renamed field
    p["schema_version"] = 2
    return p


@upcaster(2)
def v2_to_v3(p):
    p = dict(p)
    p["amount"] = str(Decimal(p["amount_cents"]) / 100)   # unit change
    p.pop("amount_cents")
    p["schema_version"] = 3
    return p


def upcast(payload: dict, target: int = CURRENT_SCHEMA_VERSION) -> dict:
    v = payload.get("schema_version", 1)
    while v < target:
        if v not in UPCASTERS:
            raise PermanentError(f"no upcaster from v{v}", code="SCHEMA_UNUPGRADABLE")
        payload = UPCASTERS[v](payload)
        v = payload["schema_version"]
    return payload
```

Upcasters are small, individually testable, and compose into a chain of any length. They also serve normal in-flight messages during a rolling deploy, so they are not replay-only machinery.

The unit change in `v2_to_v3` is the case to fear: a payload with a bare `amount: 1500` and no version marker is ambiguous between 1,500 and 15.00 forever. **Version from day one**, even when there is only one version. It costs one field and it is the difference between a mechanical migration and an archaeological one.

## 8. Terminal states

Not everything can be replayed. Every item needs a way to end:

- **`resolved`** — replayed successfully, or verified as already applied.
- **`discarded`** — genuinely unprocessable, with a mandatory reason and actor. Retained (payload optionally stripped) as an audit record. Never `DELETE`.
- **`resolved_manually`** — the business state was corrected outside the pipeline, typically a manual journal entry. Record the journal reference on the row so a future auditor can follow the trail.

Discarding money-bearing messages without a compensating record is the one outcome this whole design exists to prevent. If an item carried an amount and is being discarded, the resolution note must reference where that amount ended up.

---

## Takeaways

1. Build replay before the incident. Command, admin action, permissions, audit — treat it as a feature.
2. Select by fingerprint group; dry run by default; require an explicit `--execute`.
3. Show tenant, count and monetary value in the dry run. That summary prevents bad replays.
4. Rate-limit, use a dedicated replay queue, lock rows with `skip_locked`, and dispatch `on_commit`.
5. Dead lettering breaks ordering. Prefer commutative handlers plus a version guard over per-entity sequencing.
6. Never mutate the raw payload. Store repairs as attributed, reasoned, additive patches, and restrict which fields may be repaired.
7. Version envelopes from day one and migrate forward with composable upcasters.
8. Every item reaches a terminal state. Discarding a money-bearing message requires a compensating record.

**Next:** [Part 7 — Reconciliation Is Different: Technical Failures vs Business Exceptions](07-reconciliation-specific-concerns.md).
