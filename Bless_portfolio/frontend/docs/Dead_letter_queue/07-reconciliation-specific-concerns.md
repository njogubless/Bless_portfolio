# Part 7 — Reconciliation Is Different: Technical Failures vs Business Exceptions

*Hardening the Reconciliation Worker, Part 7 of 7*

---

Six parts of correct dead letter queue design will still let you build the wrong system, because reconciliation contains a category of failure that a DLQ is structurally unsuited to hold — and it looks exactly like the failures a DLQ is for.

## 1. The category error

Consider two messages arriving at your worker.

**Message A** has a truncated JSON body. It cannot be parsed. It will never be parseable. This is a **technical failure** — the message is unprocessable, the system cannot act, and it belongs in the dead letter queue.

**Message B** is perfectly well-formed. It says the provider settled KES 12,400 against reference `NLJ7RT61SV`. Your database has no invoice with that reference. Your matcher raises `InvoiceNotFound` and — because Part 1 told you to treat missing referenced entities as permanent failures — the message is dead-lettered.

Message B is not a failure. **Message B is a result.** It is an unmatched transaction, which is the single most ordinary output of any reconciliation process, and it may well match tomorrow when the delayed originating request finally lands, or when the merchant's end-of-day file arrives, or when a manual journal is posted. You have just taken a normal business outcome and filed it in an engineering error queue.

The consequences are specific and bad:

- Real money is now tracked in a table designed for engineering triage, invisible to finance.
- Nobody in the business can see it. Finance closes the month with a discrepancy and no explanation.
- It has no lifecycle beyond "an engineer resolves it" — but the resolution is a finance decision, not a code fix.
- If it *would* have matched two hours later, it never gets the chance, because dead lettering removed it from the pipeline.
- Your DLQ metrics are now polluted: a growing backlog that looks like a code problem is actually a business process.

**The rule:** the dead letter queue answers *"the system could not process this message."* It must never answer *"the business could not match this transaction."* Those need separate stores, separate lifecycles, separate owners and separate dashboards.

## 2. Two stores, two owners

| | Dead letter store | Exceptions ledger |
|---|---|---|
| Holds | Unprocessable messages | Unmatched or discrepant transactions |
| Cause | Malformed data, bugs, exhausted retries | Timing, missing counterparty record, amount mismatch |
| Owner | Engineering | Finance / operations |
| Resolution | Fix code or data, replay | Match, adjust, write off, escalate |
| Normal steady state | Empty | Non-empty — always |
| Alert on | Any sustained arrival | Age and aggregate value, not existence |
| Money representation | Should not hold money | Explicitly holds money, in suspense |

The last row is the design principle. **A dead letter should not be the only record that money exists.** If a payment arrives and cannot be matched, the money must be recorded somewhere in the accounting system, in a suspense account, immediately — not left implicit inside a JSON blob in an engineering table.

## 3. Suspense accounts

Double-entry accounting solved this a long time before message queues existed. An unmatched receipt is not "pending processing"; it is a real credit that must be balanced by a debit somewhere. That somewhere is a suspense account.

When reconciliation cannot match an incoming settlement:

```
Dr  Bank / Provider Settlement    12,400
Cr  Suspense — Unmatched Receipts 12,400
```

When it is later matched to invoice 8891:

```
Dr  Suspense — Unmatched Receipts 12,400
Cr  Accounts Receivable            12,400
```

Now the money is *on the balance sheet* from the moment it arrives. It is visible to finance, it is included in the trial balance, it is auditable, and the reconciliation backlog becomes a number a CFO can look at — the suspense account balance — rather than a row count in an engineering tool.

The engineering translation: the worker that cannot match a transaction should still **complete successfully**, having written an `unmatched` record and posted a suspense entry. It has done its job. It processed the message and produced the correct outcome for the information available. Nothing failed.

```python
def reconcile_settlement(payload) -> str:
    invoice = Invoice.objects.filter(
        tenant_id=payload.tenant_id, provider_ref=payload.provider_ref
    ).first()

    if invoice is None:
        # NOT a failure. A business exception with an accounting representation.
        UnmatchedTransaction.objects.get_or_create(
            tenant_id=payload.tenant_id,
            provider_ref=payload.provider_ref,
            defaults=dict(
                amount=payload.amount, currency=payload.currency,
                occurred_at=payload.occurred_at, raw=payload.model_dump(mode="json"),
                status=UnmatchedStatus.AWAITING_MATCH,
                match_deadline=payload.occurred_at + MATCHING_WINDOW,
            ),
        )
        post_suspense_entry(payload)
        return "unmatched_recorded"          # task succeeds, message acknowledged

    return apply_payment(invoice, payload)
```

## 4. Matching windows and the retry that isn't a retry

Unmatched transactions should be *re-matched*, not retried. The distinction is real: a retry re-executes the same message; a re-match runs the matcher again over accumulated state that has since changed.

Run a periodic sweep — every 15 minutes, then hourly, then daily as items age — that attempts to match everything in `AWAITING_MATCH`. Most timing-difference exceptions resolve on their own within one or two sweeps, because the counterparty record simply arrived late.

```python
@app.task
def sweep_unmatched(tenant_id: str):
    with tenant_context(tenant_id):
        qs = UnmatchedTransaction.objects.filter(
            tenant_id=tenant_id, status=UnmatchedStatus.AWAITING_MATCH
        ).order_by("occurred_at")

        for txn in qs.iterator(chunk_size=500):
            invoice = find_candidate(txn)              # exact, then fuzzy/tolerance
            if invoice:
                clear_from_suspense(txn, invoice)
                txn.status = UnmatchedStatus.MATCHED
                txn.matched_invoice = invoice
                txn.matched_at = timezone.now()
                txn.match_method = "auto_sweep"
                txn.save()
            elif timezone.now() > txn.match_deadline:
                txn.status = UnmatchedStatus.ESCALATED   # human decision required
                txn.save()
                notify_finance(txn)
```

The **matching window** — how long an item may sit awaiting an automatic match before escalating to a human — is a business parameter, not a technical one. It depends on the provider's settlement cycle, the merchant's file delivery schedule, and the accounting close calendar. Mobile money callbacks might warrant 24 hours; a bank settlement file that arrives T+2 might warrant a week. Get this number from finance, make it per-tenant configurable, and do not invent it in code review.

**Tolerance rules** belong here too. A settlement of 12,399.98 against an invoice of 12,400.00 is almost certainly the same transaction minus a rounding or FX difference. Define tolerance explicitly (absolute and percentage, whichever is smaller), auto-match within it, and post the difference to a designated variance account. Never let tolerance matching silently swallow a difference with no accounting record.

## 5. Three-way reconciliation

Real reconciliation compares three sources, not two: the provider's callbacks (real-time, sometimes lossy), the provider's statement or settlement file (authoritative, delayed), and your internal ledger (what you believe happened).

Each pairing produces a distinct exception class, and each has a different resolution:

- **In callbacks, not in ledger** — a callback was missed or failed. Genuinely likely to involve the DLQ.
- **In ledger, not in statement** — you recorded something the provider did not settle. Possible double-post, or a genuine timing difference.
- **In statement, not in ledger** — money arrived that you never recorded. The most urgent class; the customer has paid and your system does not know it.
- **In both, amounts differ** — fees, FX, partial settlement, or a bug.
- **Duplicated in one source** — provider retried a callback, or your idempotency failed.

Modelling these as distinct, named exception types rather than a generic "unmatched" bucket is what makes the exceptions ledger actionable. A finance analyst can work a queue of *"statement rows with no internal record"* far more effectively than a queue of *"reconciliation problems."*

## 6. Invariants worth encoding as tests

Reconciliation systems benefit disproportionately from a small set of invariants asserted continuously — as scheduled checks that alert, not just as unit tests.

1. **Conservation.** For each tenant and currency: `sum(settled) == sum(applied to invoices) + sum(suspense) + sum(written off)`. If this ever fails, something has been lost or created. It is the master check.
2. **No orphaned money.** Every dead letter whose payload carries an amount has a corresponding suspense entry or a documented discard with a compensating journal.
3. **No dead letter older than the matching window.** If one exists, it was misclassified — a business exception filed as a technical failure. This check is how you catch the category error of section 1 automatically.
4. **Idempotency holds.** `count(distinct provider_ref) == count(ledger entries)` per tenant.
5. **Suspense ages down.** The oldest item in suspense is younger than the matching window plus the escalation SLA. A suspense account that only grows is a reconciliation process that has quietly stopped working.

Invariant 3 is the one I would add first. It is a single query, and it converts the most expensive design mistake in this series into an automated alert.

## 7. Immutability and audit

Two rules, non-negotiable in financial reconciliation:

**Never mutate a posted ledger entry.** Corrections are new, offsetting entries — a reversal plus a corrected posting — carrying a reference to what they correct. A ledger you can `UPDATE` is a ledger you cannot audit, and replay makes this acute: a replayed message that mutates history changes the past, whereas one that appends a compensating entry leaves an accurate record of what the system knew and when.

**Every state transition is attributed.** Who matched it, who wrote it off, who discarded the dead letter, who repaired the payload, which automated sweep and which rule version. In a system that moves money, "the system did it" is not an acceptable answer to an auditor, and every table in this series — dead letters, repairs, unmatched transactions, ledger entries — should carry actor and timestamp on every transition.

## 8. Where this leaves the DLQ

After all seven parts, the dead letter queue in a reconciliation system has a narrow and well-defined role:

> It holds messages the system could not process due to a technical fault — malformed payloads, bugs, exhausted retries against genuinely broken dependencies — for as long as it takes an engineer to fix the cause and replay them. Its steady state is empty.

Everything else — unmatched transactions, amount discrepancies, timing differences, items awaiting a human decision — lives in the exceptions ledger, is represented in suspense on the balance sheet, is owned by finance, and is entirely normal.

Getting that boundary right matters more than any implementation detail in Parts 1 through 6. A team with a mediocre DLQ and a clean separation between technical failures and business exceptions will run a healthier reconciliation pipeline than a team with an excellent DLQ that has quietly become the place where unexplained money goes to be forgotten.

---

## Takeaways

1. "Cannot process this message" and "cannot match this transaction" are different failures with different owners. Never route both to the DLQ.
2. An unmatched transaction is a *result*, not an error. The task should succeed, record it, and acknowledge the message.
3. Give unmatched money an accounting representation immediately — a suspense account entry — so it is visible on the balance sheet, not buried in a JSON blob.
4. Re-match on a sweep against changed state; do not retry the original message. Matching windows and tolerances are business parameters, not engineering defaults.
5. Model three-way reconciliation exceptions as distinct named classes; a generic "unmatched" bucket is not actionable for the people who must clear it.
6. Encode invariants as continuous checks — especially "no dead letter older than the matching window," which catches the category error automatically.
7. Never mutate posted ledger entries; correct with offsetting entries. Attribute every transition.
8. A healthy reconciliation DLQ is empty most of the time. A healthy exceptions ledger never is.

---

*End of series. [Back to the index](00-series-index.md).*
