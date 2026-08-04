// Static blog content. Content is preserved verbatim from the original
// site's data/posts.js. See ADR-002 in README for why this stays static
// rather than round-tripping through the Django /api/blog/ endpoints
// (which exist in the backend but were already orphaned in the previous
// build — the frontend never actually called them).

const posts = [
  {
    id: 1,
    slug: 'flutter-state-management-riverpod',
    title: 'Why I switched to Riverpod for Flutter state management',
    excerpt:
      "After wrestling with Provider and Bloc, Riverpod clicked. Here's what changed and why I haven't looked back.",
    category: 'mobile',
    readingTime: '5 min read',
    createdAt: '2026-03-10',
    tags: ['flutter', 'riverpod', 'dart', 'state-management'],
    content: `## The problem with Provider

Provider works, but it starts to feel brittle as your app grows. Widget trees get deep, context lookups get messy, and testing becomes a chore.

## Why Riverpod

Riverpod is compile-safe, context-free, and testable by default. You declare providers at the top level and consume them anywhere — no \`BuildContext\` threading required.

\`\`\`dart
final userProvider = FutureProvider<User>((ref) async {
  return ref.read(authRepositoryProvider).getCurrentUser();
});
\`\`\`

## The real win: async providers

\`AsyncNotifierProvider\` handles loading, error, and data states out of the box. No more manual \`isLoading\` booleans.

## Conclusion

If you're starting a new Flutter project, start with Riverpod. The learning curve is real but short, and the payoff in maintainability is worth it.`,
  },
  {
    id: 2,
    slug: 'dockerising-django-production',
    title: 'Dockerising a Django app for production — the right way',
    excerpt:
      'Most Docker tutorials stop at "it runs locally." Here\'s how I actually ship Django to production with Docker Compose, Nginx, and CI/CD.',
    category: 'backend',
    readingTime: '8 min read',
    createdAt: '2026-02-18',
    tags: ['django', 'docker', 'devops', 'nginx', 'ci-cd'],
    content: `## Why most Docker setups break in production

A \`Dockerfile\` that works on your laptop often fails in prod because of missing environment variables, wrong user permissions, or a dev server (runserver) masquerading as production.

## The stack

- **Gunicorn** as the WSGI server
- **Nginx** as reverse proxy + static file server
- **Docker Compose** to wire it together
- **GitHub Actions** for CI/CD

## The Dockerfile

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## Nginx config

Nginx handles SSL termination and serves \`/static/\` directly — keeping Gunicorn free for actual requests.

## CI/CD

On every push to \`main\`, GitHub Actions runs tests, builds the image, pushes to a registry, and deploys. Zero-downtime via \`docker compose up -d --no-deps app\`.

## Key lessons

1. Never use \`runserver\` in production.
2. Always set \`DEBUG=False\` via environment variables, not hardcoded.
3. Collect static files at build time, not runtime.`,
  },
  {
    id: 3,
    slug: 'kubernetes-for-solo-devs',
    title: "Kubernetes is worth learning even if you're a solo developer",
    excerpt:
      "You don't need a team of 50 to benefit from K8s. Here's how I use Minikube locally and why it made me a better engineer.",
    category: 'infrastructure',
    readingTime: '6 min read',
    createdAt: '2026-01-22',
    tags: ['kubernetes', 'devops', 'docker', 'infrastructure'],
    content: `## The "you don't need K8s" argument

It's true — most solo projects don't need Kubernetes in production. But learning it changes how you think about deployments, scaling, and fault tolerance.

## What I built

A Django app running on Minikube with:

- A \`Deployment\` managing 3 replicas
- A \`Service\` exposing the app internally
- An \`Ingress\` routing traffic via Nginx
- \`ConfigMaps\` and \`Secrets\` for environment config

## The mental shift

K8s forces you to think declaratively. You describe what you *want*, not what to *do*. That mindset translates directly to Terraform, Ansible, and even good API design.

## Where to start

1. Install Minikube locally.
2. Deploy a simple app with \`kubectl apply -f deployment.yaml\`.
3. Break things intentionally and watch K8s self-heal.

The docs are dense but the \`kubectl explain\` command is your best friend.`,
  },
  {
    id: 4,
    slug: 'building-in-kenya',
    title: 'Building software products in Kenya — what nobody tells you',
    excerpt:
      "Payments, connectivity, hiring, and the unique constraints of shipping products for East African users. A developer's honest take.",
    category: 'career',
    readingTime: '7 min read',
    createdAt: '2025-12-05',
    tags: ['kenya', 'africa', 'mpesa', 'career', 'product'],
    content: `## The payment layer is different

M-Pesa is not a nice-to-have in Kenya — it's the default. Integrating Daraja (Safaricom's API) is your first real task on any consumer product. STK push, C2B, B2C — learn them all.

## Network assumptions will hurt you

Don't assume 4G. Test on 3G and even 2G edge cases. Lazy loading, small payloads, and offline-first design aren't optional — they're how you keep users.

## The talent is here

Contrary to what some think, Kenya has serious engineering talent. Nairobi's tech scene is real and growing. The challenge is retention, not availability.

## What I've learned

- Build for the constraints of your actual users, not the users you imagine.
- M-Pesa callbacks are asynchronous — design for that from day one.
- Local community (communities like Nairobi Dev) is underrated for growth.

## Final thought

Building in Kenya is hard in specific ways and exciting in specific ways. The problems are real, the market is young, and the opportunity is genuine.`,
  },

  // ---- Changa engineering log ----
  // A production Flutter + FastAPI app moving real money over M-Pesa/Airtel.
  // An engineering audit found 28 issues, 11 of them blocking. These are the
  // write-ups of each fix, in the order the work happened.
  {
    id: 5,
    slug: 'changa-engineering-log',
    title: 'The Changa engineering log',
    excerpt:
      'Eleven blocking issues found in a money-moving codebase — floats used for currency, unverified payment webhooks, plaintext tokens — and the eleven short, honest write-ups documenting how each one got fixed.',
    category: 'backend',
    readingTime: '2 min read',
    createdAt: '2026-05-05',
    tags: ['changa', 'fintech', 'postgresql', 'fastapi', 'engineering-log'],
    content: `Changa is a Flutter + FastAPI app that lets Kenyan chamas — informal
savings and investment groups — pool contributions toward a shared goal
and pay in over M-Pesa or Airtel Money. Because it moves real money, an
engineering audit (\`docs/Changa_Engineering_audit.md\`) went through the
codebase looking for anything that could lose a member's money, leak
their data, or leave the team unable to answer "what happened to this
contribution?" It found 28 issues. Eleven were blocking: money handled as
floating-point numbers, payment callbacks nobody verified, tokens stored
in plaintext, and more.

This folder is eleven short articles, one per fix, written as the team
actually experienced them: what was broken, why it mattered, what changed,
and how we convinced ourselves it actually worked. Each one ends with a
one-line lesson that generalizes past this one codebase.

They're ordered the way the work happened — foundational fixes first,
because everything else was built on top of them.

1. [Schema truth: why we deleted \`create_tables()\`](/blog/changa-schema-truth)
2. [The missing cent: money as \`Decimal\`, not \`float\`](/blog/changa-money-as-decimal)
3. [Add should never mean add twice: the append-only ledger](/blog/changa-append-only-ledger)
4. [Never trust a webhook: authenticating payment callbacks](/blog/changa-authenticating-payment-callbacks)
5. [Two requests, one truth: idempotency in the database](/blog/changa-database-enforced-idempotency)
6. [What if the process dies mid-payment? The transactional outbox](/blog/changa-transactional-outbox)
7. [A refresh token is a password with extra steps](/blog/changa-refresh-token-security)
8. [Stopping a brute force without adding Redis](/blog/changa-rate-limiting-without-redis)
9. [Nobody could answer "what happened to this shilling"](/blog/changa-observability-from-zero)
10. [When the app and the server quietly stop agreeing](/blog/changa-api-contract-drift)
11. [The history that matters is the history you didn't record](/blog/changa-audit-trail)`,
  },
  {
    id: 6,
    slug: 'changa-schema-truth',
    title: 'Schema truth: why we deleted create_tables()',
    excerpt:
      'Deleting one line of SQLAlchemy convenience code and making Alembic the only thing allowed to touch the schema — after two rolling-deploy replicas raced to create the same table.',
    category: 'backend',
    readingTime: '3 min read',
    createdAt: '2026-03-15',
    tags: ['changa', 'fastapi', 'postgresql', 'alembic', 'migrations'],
    content: `Every time the Changa API started up, it ran one line: \`Base.metadata.create_all(bind=engine)\`. Read the tables your Python code defines, and create any that don't exist yet in the database. It's the first thing almost every SQLAlchemy tutorial shows you, and it feels harmless — it only *adds* things, right?

That's exactly the problem. It only adds. It never tells you when a column changed type, when a constraint got stricter, or when two people's local branches quietly drifted apart about what the schema should look like. And it runs on every boot. Deploy two replicas of the API at the same time — completely normal during a rolling deploy — and both processes can race to create the same table at the same moment. One of them loses that race and crashes.

There's a deeper issue underneath: **nobody could point to a single source of truth for what the database actually looked like.** The Python model file said one thing. The live database, shaped by months of ad-hoc changes, might say another. There was no history to diff, no way to review a schema change before it shipped, and no way to answer "what did the \`contributions\` table look like three months ago?"

## What we changed

We made Alembic — the migration tool already sitting unused in the project — the only thing allowed to touch the database's structure. Concretely:

- **Deleted \`create_tables()\`.** The app no longer creates or alters tables on boot.
- **Added \`verify_schema_at_head()\`.** On startup, the app checks the database's current migration revision against what the code expects. If they don't match, it refuses to start, with an error telling you to run \`alembic upgrade head\` first. A mismatched schema is now a loud failure at boot, not a silent one hours later.
- **Rebuilt the migration history from scratch** as a single, verified baseline, since the old one no longer matched reality.
- **Moved \`reset_db.py\`** — a script that wipes the database — out of the production image entirely, into \`scripts/dev/\`, and added a confirmation prompt.

## How we knew it worked

We didn't just read the migration and hope. For every migration in this project, the check was the same: spin up a throwaway Postgres container, run \`alembic upgrade head\` against it, then run \`alembic check\` — a command that fails loudly if the migration doesn't produce *exactly* the schema the Python models describe. Zero drift, or it doesn't ship. Then the container gets thrown away.

That last step matters as much as the first. A migration that "looks right" reading the diff is not the same as a migration that was actually run against a real database and produced the table you meant.

**The lesson:** if a tool can silently reshape production on every boot, it isn't convenient — it's a race condition waiting for two replicas to start at once. Make the schema something you can diff, review, and verify before it ever touches real data.`,
  },
  {
    id: 7,
    slug: 'changa-money-as-decimal',
    title: 'The missing cent: money as Decimal, not float',
    excerpt:
      '0.1 + 0.2 isn\'t 0.3 — and when your ledger has to match a mobile money provider to the cent, that rounding error is the whole bug. Why Changa moved every monetary column to Decimal.',
    category: 'backend',
    readingTime: '3 min read',
    createdAt: '2026-03-19',
    tags: ['changa', 'postgresql', 'python', 'fintech', 'mpesa'],
    content: `Here's a small experiment you can run in almost any programming language:

\`\`\`python
>>> 0.1 + 0.2
0.30000000000000004
\`\`\`

That's not a bug in Python — it's how binary floating-point numbers work. Computers store \`0.1\` the same way you'd store \`1/3\` in decimal: as an endless, repeating approximation, quietly rounded off somewhere past the digits you can see. Most of the time that rounding error is too small to notice. In a system that sums up thousands of contributions and needs the total to match, to the cent, what Safaricom's settlement report says — it isn't too small to notice. It's the whole problem.

Changa stored every monetary value — a project's target, how much it had raised, each individual contribution — as \`Float\`, which becomes a PostgreSQL \`DOUBLE PRECISION\` column. Every contribution added to a project's running total compounded a tiny bit more representation error. The order contributions arrived in could even change the final total. And separately, the M-Pesa integration sent \`int(amount)\` to Safaricom's API — which doesn't round, it just chops off anything after the decimal point. A member contributing KES 100.75 got charged KES 100 by M-Pesa, while Changa's own database still said 100.75. Two systems, two numbers, no way to reconcile them, for every single non-whole-number contribution.

## What we changed

The fix has one rule: **represent money as an exact decimal, everywhere, and never let a fractional amount reach a payment provider.**

- Every monetary column became \`NUMERIC(14,2)\` in Postgres and \`Decimal\` in Python — an exact, base-10 number type built for exactly this, instead of a binary approximation.
- We added one conversion function, \`to_money()\`, used everywhere a number becomes money. It matters *how* you build a \`Decimal\`: \`Decimal(0.1)\` still imports the same floating-point error you were trying to escape, because it starts from the already-imprecise float. \`Decimal(str(0.1))\` doesn't — it starts from the decimal text \`"0.1"\` and reads it exactly. One easy-to-get-wrong line, centralized in one place instead of repeated (and eventually mis-copied) at every call site.
- We stopped truncating money to talk to a payment provider. If an amount would require sending sub-cent precision the provider can't accept, the request is rejected up front with a clear error, instead of being silently rounded away.

## How we knew it worked

Beyond the migration-verification loop described in the schema truth article, this one needed a functional check specifically for the arithmetic: seed contributions with awkward decimal amounts, sum them through the API, and confirm the total matches what you'd get adding the numbers by hand — not what floating point would produce. We also had to update every schema that serialized money over JSON, since a \`Decimal\` needs an explicit, deliberate serialization rule or it'll either come out as a float again (reintroducing the exact bug we fixed) or as a string the client isn't expecting.

**The lesson:** floating point is for physics simulations and graphics, not ledgers. If your total has to match someone else's — a bank, a provider, a member checking their own math — use a number type built to be exact, and control precisely how values enter and leave it.`,
  },
  {
    id: 8,
    slug: 'changa-append-only-ledger',
    title: 'Add should never mean add twice: the append-only ledger',
    excerpt:
      'raised_amount += contribution.amount looks harmless until a retried callback runs it twice. Building an append-only ledger where crediting a project can only ever happen once.',
    category: 'backend',
    readingTime: '3 min read',
    createdAt: '2026-03-24',
    tags: ['changa', 'postgresql', 'ledger', 'concurrency'],
    content: `Picture the simplest possible way to record a contribution: when a payment succeeds, run \`project.raised_amount += contribution.amount\` and save. It reads perfectly reasonably. It's also quietly dangerous, because it assumes that "a payment succeeded" is an event that only ever happens once per payment.

It doesn't. Mobile networks drop connections. Payment providers retry callbacks that they think might not have arrived. A background job can crash after updating the database but before marking a job "done," and the next run picks up the same job again. Any one of those can cause the same successful payment to be processed twice — and \`+=\` has no memory. It doesn't know it already added this contribution five minutes ago. It just adds it again, and now a member's KES 500 contribution shows up as KES 1,000 raised.

The deeper issue: \`raised_amount\` was the *only* record. There was no way to ask "which contributions actually make up this total?" — the number existed, but its receipts didn't.

## What we changed

We introduced an append-only \`ledger_entries\` table — one row per contribution actually credited, never updated, never deleted — and made crediting a project provably happen at most once per contribution:

\`\`\`python
inserted = db.execute(
    pg_insert(LedgerEntry).values(...)
    .on_conflict_do_nothing(constraint="uq_ledger_contribution_direction")
    .returning(LedgerEntry.id)
).scalar_one_or_none()

if inserted is None:
    return False  # already credited — nothing more to do
\`\`\`

That \`on_conflict_do_nothing\`, backed by a unique constraint on \`(contribution_id, direction)\`, is the whole trick. It moves the "have I already done this?" check from application logic — which can race, retry, or simply forget — into the database itself, where it's enforced atomically no matter how many requests arrive for the same contribution at the same time. If the insert succeeds, this is the first time; credit the project. If it doesn't, someone already got here first; do nothing and return.

We also replaced the \`+=\` itself. Even with double-crediting solved, incrementing a value in Python and writing it back is still a race between two concurrent requests reading the same starting number. The fix there is a single atomic SQL statement instead: \`UPDATE projects SET raised_amount = raised_amount + :amount WHERE id = :id\` — the addition happens inside the database, in one step, instead of being split across a read in Python and a write back.

A budget's spent-amount tracking had the same shape of bug — Python arithmetic with a manual \`max(0.0, ...)\` clamp bolted on to hide negative numbers rather than prevent them — and got the same fix: a real atomic recomputation from the underlying rows, not an incremental adjustment that drifts.

## How we knew it worked

We wrote a reconciliation query that recomputes each project's total directly from its ledger entries and compares it to the stored \`raised_amount\`. Any mismatch is a bug, immediately, rather than a support ticket three weeks later. That query became part of the verification loop for every subsequent branch — a mismatch would have meant something regressed.

**The lesson:** if an operation needs to happen "exactly once," don't trust application code to remember that it already ran. Give the database something to enforce — a unique constraint it will reject a duplicate against — and let *that* be the source of truth.`,
  },
  {
    id: 9,
    slug: 'changa-authenticating-payment-callbacks',
    title: 'Never trust a webhook: authenticating payment callbacks',
    excerpt:
      'A public webhook URL isn\'t a credential. Hardening Changa\'s M-Pesa callback endpoint against anyone who finds — or guesses — it.',
    category: 'backend',
    readingTime: '3 min read',
    createdAt: '2026-03-29',
    tags: ['changa', 'security', 'webhooks', 'mpesa'],
    content: `When a member pays into a project over M-Pesa, Safaricom's systems eventually call back to Changa's server with the result: success or failure, and (sometimes) an amount and a receipt number. Changa's original callback endpoint, \`/payments/mpesa/callback\`, looked at that request body, and if it said the payment succeeded, marked the contribution as paid.

Here's the uncomfortable question that finding asks: **what actually proves that request came from Safaricom?** The endpoint was a public URL. Nothing checked a signature, a shared secret, or even the source IP. Anyone who found or guessed that URL could POST a body claiming any contribution had succeeded, and Changa would believe them — because "believing them" was the entire implementation.

There's a second, subtler problem once you start looking at how M-Pesa's Daraja API actually behaves in practice: even *legitimate* callbacks aren't something you should blindly trust for the exact amount. The \`stkpushquery\` status-check endpoint doesn't reliably return the amount or receipt in a form you can safely treat as authoritative for crediting money. Following the illustrative pattern of "verify the callback, then credit whatever it says" would still leave a gap.

## What we changed

Two separate fixes, addressing two separate risks:

**Nobody unauthenticated gets to talk to the callback route.** Callback URLs now carry a per-provider secret token (\`/payments/{provider}/callback/{token}\`), checked with \`hmac.compare_digest\` — a constant-time comparison, so an attacker can't use response-timing differences to guess the token one character at a time. A request with the wrong token is rejected before any business logic runs.

**The callback body is never the source of truth for how much money moved.** Every incoming callback — verified or not — gets its raw body persisted immediately, unconditionally, before any other logic touches it. That's the durable evidence trail. But when it comes to actually crediting a contribution, the amount used is never anything read out of the callback: it's \`contribution.amount\`, the amount Changa itself initiated the payment for in the first place, confirmed successful via an authenticated, server-to-server status query back to the provider — not trusted from an inbound POST that anyone with the right URL could have sent.

## How we knew it worked

We tested both properties directly against a running server: a callback with a missing or wrong token gets rejected outright, and its raw body still lands in the audit table regardless of whether it was accepted — because a rejected callback is exactly the kind of thing you want a durable record of, not something to silently drop. We also had to be honest about what this fix *doesn't* do: it doesn't implement full HMAC signature verification of Safaricom's own signing scheme (Daraja's public sandbox doesn't consistently support it end-to-end), so the shared-secret-token approach is a deliberate, documented middle ground — meaningfully better than "trust whatever hits this URL," but not a replacement for provider-native request signing if and when that becomes available.

**The lesson:** a webhook URL is not a credential. If a request can move real money, something about that request — a signature, a token, a callback to a source you initiated — needs to prove where it came from, and the payload itself should never be the sole authority for how much money changed hands.`,
  },
  {
    id: 10,
    slug: 'changa-database-enforced-idempotency',
    title: 'Two requests, one truth: idempotency in the database',
    excerpt:
      'Two near-simultaneous requests, one contribution, no guarantee only one wins. Pushing idempotency out of application code and into database constraints.',
    category: 'backend',
    readingTime: '3 min read',
    createdAt: '2026-04-03',
    tags: ['changa', 'postgresql', 'idempotency', 'alembic'],
    content: `"Idempotent" is one of those words that sounds academic until the exact moment your phone loses signal mid-payment. You tap "contribute," the request goes out, the connection drops before you see a response, and — reasonably — you tap it again. Or the payment provider's own callback delivery retries because it didn't get an acknowledgment fast enough. Either way, the same successful payment can now arrive at your server described twice.

The append-only ledger (see the previous article) solved this for the specific case of *crediting a project's total*. But the underlying \`contributions\` table itself had no equivalent guarantee. Nothing stopped two near-simultaneous requests from both reading a contribution as "not yet completed," both deciding to mark it successful, and both writing — a classic read-then-write race, where the check and the action aren't atomic.

## What we changed

We pushed the "has this already happened?" question down into constraints the database enforces on every write, not assumptions the application code has to get right every single time it touches this table:

- A **unique constraint** on \`(provider, provider_reference)\` — the payment provider's own receipt number. Two rows claiming to be the same M-Pesa receipt can't both exist; the second insert simply fails, cleanly, instead of silently succeeding and creating a duplicate.
- A **CHECK constraint** requiring \`amount > 0\` — a bad amount stops being possible to store at all, not just something you'd catch with a Python \`if\`.
- A **composite index** on \`(project_id, status)\`, since idempotency checks and status lookups are now something the database does on every write, so they need to be fast.

Worth calling out: Alembic's autogeneration, which usually writes migrations for you by comparing your models to the database, doesn't reliably pick up CHECK constraints on its own. It's an easy thing to add to the model file and then discover — much later — was never actually applied to any real database. We caught this specifically by not trusting the generated migration file at face value: it has to be applied to an actual database and re-diffed against the models before it counts as verified.

## How we knew it worked

We simulated the exact race this was built to prevent: two requests for the same provider receipt, fired concurrently. One succeeds; the other gets a clean, expected failure from the unique constraint — not a silent duplicate, not a crash, a specific and recoverable error. Then the usual loop: throwaway Postgres, apply the migration, \`alembic check\` for zero drift, tear down.

There was one sharp edge worth remembering for next time: Alembic's revision-id column in production is a fixed-width \`VARCHAR(32)\`. A descriptive migration name that's perfectly readable in the file itself can be too long once it becomes the revision id, and the failure mode is an obscure database truncation error at migration time — not a helpful one at authoring time. Short, deliberate revision ids avoid that entirely.

**The lesson:** idempotency isn't a checklist item you can tick off with an \`if this hasn't happened yet\` in application code — that check and the write it guards need to be one atomic operation, or the two requests racing each other will find the gap between them.`,
  },
  {
    id: 11,
    slug: 'changa-transactional-outbox',
    title: 'What if the process dies mid-payment? The transactional outbox',
    excerpt:
      'What happens when your server saves a pending payment and then crashes before calling M-Pesa? Building a transactional outbox so a crash between the two loses nothing.',
    category: 'backend',
    readingTime: '4 min read',
    createdAt: '2026-04-09',
    tags: ['changa', 'distributed-systems', 'postgresql', 'outbox-pattern'],
    content: `Here's a question worth sitting with: when a member taps "contribute," your server needs to do two things — save a record that a contribution is pending, *and* actually call M-Pesa or Airtel to trigger the STK push on the member's phone. Those two things cannot both happen as a single database transaction, because one of them is a network call to a third party that can take fifteen seconds and can fail in ways entirely outside your control.

So what happens if your server saves the "pending contribution" row successfully, and then — the process crashes, the network blips, anything — never actually calls the provider? You get a contribution stuck forever in \`PENDING\`, with no STK push ever sent, and a member wondering why nothing happened on their phone.

## What we changed

We used a pattern called the **transactional outbox**: instead of trying to do the database write and the provider call in the same breath, split them.

1. When a contribution is initiated, the API writes *two* things in one database transaction: the \`Contribution\` row itself, and an \`OutboxMessage\` row describing "push this payment to the provider." Either both get committed, or neither does — no in-between state where one exists without the other.
2. A separate background worker continuously drains that outbox: it picks up pending messages, actually calls the provider's API, and records the outcome.
3. A **reconciliation sweep** runs on a timer, checking on any contribution that's been sitting in \`PENDING\` too long by asking the provider directly what actually happened to it — because sometimes the provider processed the payment but Changa never received (or successfully processed) the confirming callback.

This is the same idea as the append-only ledger from earlier — move the guarantee from "the code has to remember to do this" into a durable, database-backed queue that survives a crash — applied to an outgoing action instead of an incoming one.

## Two bugs the verification loop caught before they shipped

Neither of these was visible from reading the code casually. Both showed up because every branch in this project was run against a real, full regression suite before being trusted:

**The Airtel retry was silently a no-op.** The guard deciding whether to retry a failed push checked \`contribution.checkout_request_id or contribution.provider == AIRTEL\` — which is *always true* for an Airtel contribution, regardless of whether a previous attempt had actually been made. It looked like a retry guard. It behaved like "always retry, forever," because the condition never actually gated anything for that branch. The fix was splitting the check by provider: M-Pesa keys off whether a checkout ID exists yet; Airtel keys off whether \`push_attempts > 0\`.

**Contributions with no checkout ID were stuck forever, invisibly.** If a push to the provider failed before a checkout ID was even assigned, the reconciliation sweep's logic hit a silent early return — it never counted against the retry budget, so the contribution just sat in \`PENDING\` indefinitely with no path to resolution and no alert. The fix: that case now counts against the same attempt budget as everything else and escalates to a clear \`failure_reason\` after enough attempts, instead of vanishing into a state nothing else checks for.

## How we knew it worked

Beyond the standard migration-verification loop, this needed a functional test that actually simulated the failure mode the pattern exists for: kill the worker process mid-drain, restart it, and confirm the outbox message — and therefore the provider push — still eventually happens exactly once, not zero times and not twice.

**The lesson:** any time a database write and an external call need to happen together but can't be one atomic operation, write down the *intent* durably first, and let a separate, restartable process carry it out. That way a crash between the two loses nothing — it just means the outbox has one more message waiting for the worker to come back.`,
  },
  {
    id: 12,
    slug: 'changa-refresh-token-security',
    title: 'A refresh token is a password with extra steps',
    excerpt:
      'Changa stored refresh tokens as plaintext JWTs — the same as storing a password in the clear. Rotation families, opaque tokens, and revocation that actually revokes.',
    category: 'backend',
    readingTime: '4 min read',
    createdAt: '2026-04-14',
    tags: ['changa', 'security', 'jwt', 'fastapi'],
    content: `A refresh token is what lets someone stay logged in without re-entering their password every fifteen minutes. Functionally, it *is* a password — anyone who has it can use it to get a fresh access token and act as that user. Changa's original schema stored it like this:

\`\`\`python
token = Column(String(500), unique=True, nullable=False)  # the full JWT, in plaintext
\`\`\`

The full, working token, written verbatim into the database. Read access to that one table — a backup file, a replica, a logged slow query, a SQL injection anywhere else in the app — is immediate, silent account takeover for every user with an active session. Nobody would ever store a password that way. A refresh token deserves the exact same treatment, and wasn't getting it.

There was a second problem layered on top: access tokens had no \`jti\` (a unique ID per token) and nothing checked one against a revocation list. Logging out only ever flipped a flag on the *refresh* token. The access token you already had kept working, unaffected, for the rest of its lifetime — logout didn't actually end your session, it just stopped you from getting a new one.

## What we changed

- **Refresh tokens are now opaque, high-entropy random strings — not JWTs — and only their SHA-256 hash is ever stored.** The raw token exists for one moment, in the response to the client; the database never sees it again. Even a full read of the table gives an attacker nothing usable.
- **Access tokens gained a \`jti\` claim and a much shorter lifetime** (15 minutes, down from 30). Logging out now adds that \`jti\` to a small revocation table, and a per-user \`tokens_valid_after\` timestamp lets one action — a password change, an admin disabling an account — invalidate *every* outstanding access token at once, not just future ones.
- **Refresh tokens are grouped into rotation "families,"** one per login session. Each time a refresh token is used, it's marked consumed and a new one is issued in its place. If a *consumed or already-revoked* token gets presented again — the signature of a stolen token being replayed by someone who isn't the legitimate user — the entire family is revoked immediately, not just that one request rejected.

## A bug the regression suite caught, not a code review

While verifying this branch, the full test suite came back with new failures it hadn't had before — a signal worth stopping for, not explaining away. The cause: a couple of call sites passed \`str(user.id)\` into the function that builds a new refresh token row, and that string landed directly on a column typed as a real UUID. It happened to *look* fine against Postgres, but broke outright under the test suite's SQLite substitution, and more importantly, it was simply the wrong type being passed around — correct by accident, not by design. The fix was straightforward once found: keep the user's ID as an actual UUID object all the way through, and only convert it to a string at the one place that genuinely needs a string — encoding it into a JWT claim.

That's the value of running the *entire* regression suite on every branch, not just the tests that seem related: this bug had nothing to do with what the branch was "supposed" to be about, and would have shipped invisibly otherwise.

## How we knew it worked

We tested reuse detection directly: use a refresh token, then present that same now-consumed token again, and confirm the whole session family — not just that one request — stops working. And logout: get an access token, log out, then try to use that same still-technically-valid-by-expiry access token, and confirm it's rejected.

**The lesson:** anything that grants access is a credential, whether or not it's called one. Store it the way you'd store a password, give yourself a way to revoke it in bulk, and treat "an already-used token showing up again" as the security signal it actually is.`,
  },
  {
    id: 13,
    slug: 'changa-rate-limiting-without-redis',
    title: 'Stopping a brute force without adding Redis',
    excerpt:
      'Every endpoint accepted unlimited requests — including a real, billed STK push to Safaricom. A rate limiter and a lockout policy, built without reaching for Redis.',
    category: 'backend',
    readingTime: '4 min read',
    createdAt: '2026-04-19',
    tags: ['changa', 'security', 'rate-limiting', 'python'],
    content: `The only middleware registered anywhere in Changa's API was CORS. That meant every endpoint accepted unlimited requests from anyone: unlimited login attempts against a single account, unlimited free-form account registrations, and — the one with a real dollar cost attached — unlimited real STK pushes triggered through the payment-initiation endpoint. Each one of those is a genuine, billed request to Safaricom. A script hammering that endpoint isn't just an inconvenience; it's a phone bill, and enough of it will get the platform's shortcode suspended by the provider entirely.

There's a second, quieter risk in how a naive login check often gets written. If checking a password for a user that doesn't exist returns "invalid credentials" *faster* than checking one for a user that does — because the real check does an actual password comparison and the fake one short-circuits before it gets there — that timing difference alone tells an attacker which emails are registered, without ever needing a correct password.

## What we changed

**A rate limiter, but not a Redis-backed one.** Changa runs as a single replica today; there's no second instance for a shared, distributed rate-limit store to coordinate with. Adding Redis specifically to solve a problem a single process can already solve in memory would be new infrastructure with nothing forcing it to exist yet. So the limiter is a small, in-process, thread-safe sliding window — a dictionary of timestamps per identity, cleared out as it ages — deliberately designed as a seam: every call site goes through one function, so swapping in a Redis-backed version later, once there's more than one replica to coordinate across, touches this one module and nothing else.

Different endpoints get keyed differently, on purpose: login attempts are limited per source IP (a flood guard) *and* separately per account (so spreading attempts across many IPs doesn't help an attacker outrun the per-account lockout). Payment initiation and chama-join are limited per authenticated user, since that's what actually constrains the behavior you're trying to stop — an IP-based limit on an authenticated action just means the attacker uses more IPs.

**A progressive account lockout, independent of the IP-based limiter.** Five failed logins locks an account for fifteen minutes; ten locks it for an hour. And every login check — even for an email that was never registered — now runs a full password comparison against a dummy hash instead of returning early, so there's no timing difference for an attacker to read.

## A bug the test suite's own architecture exposed

Once the limiter was wired in, the full regression suite came back with new failures — registrations getting rejected that had nothing to do with rate limiting as a *feature*, and everything to do with rate limiting as *global state*. The test client uses a single fixed fake source IP for every test in the run, and the registration limit (three per hour) doesn't know or care that these are supposed to be independent tests — from its point of view, it's the same IP, hammering the endpoint, and by the fourth test in the file, every subsequent registration correctly got rejected.

The fix wasn't to weaken the limiter — it was to give the test suite the same reset hook a production deploy would never need but a test run absolutely does: a function that clears the limiter's state, wired into an autouse fixture that runs before every single test, the same pattern the project already used to get a fresh database per test.

**The lesson:** you don't need distributed infrastructure to solve a problem your current topology doesn't have yet. Build the simplest thing that's correct for how the system actually runs today, but design the one seam that'll matter later — and remember that global state, even well-intentioned rate-limiting state, needs an explicit reset story or it'll leak sideways into your tests.`,
  },
  {
    id: 14,
    slug: 'changa-observability-from-zero',
    title: 'Nobody could answer "what happened to this shilling"',
    excerpt:
      'There wasn\'t a single log line anywhere in Changa\'s backend. Structured logs, request correlation, and a ready endpoint that actually checks the database.',
    category: 'backend',
    readingTime: '4 min read',
    createdAt: '2026-04-24',
    tags: ['changa', 'observability', 'logging', 'fastapi'],
    content: `There wasn't a single \`logging.getLogger()\` call anywhere in Changa's backend. Sentry — an error-tracking service — was listed as a dependency, but \`sentry_sdk.init()\` was never actually called, so it did nothing at all. The only output the server produced was Uvicorn's default access log: a line per request, with no way to connect a specific user's failed contribution to the specific provider call and callback that were involved in it. And \`/health\` returned a static \`{"status": "ok"}\` no matter what — even with the database completely unreachable, which means an orchestrator checking that endpoint would happily keep sending traffic to a pod that couldn't actually do anything.

Put plainly: if a member's contribution went wrong, there was no way to reconstruct what happened to it. Not because the information was hard to find — because it was never recorded in the first place.

## What we changed

Three pieces, each addressing a different half of "what happened":

**Structured, correlated logs.** Every log line is now JSON, and every request gets a \`request_id\` — either generated fresh, or taken from an inbound \`x-request-id\` header if the client already set one, so a support ticket and a server-side trace can refer to the exact same identifier. That ID gets echoed back in the response header and attached to every log line produced while handling that request, including an automatic, full-stack-trace log the moment before any unhandled exception propagates — nothing disappears into stdout unlogged anymore. A redaction step runs on every log line before it's written, so passwords, tokens, and phone numbers (kept to their last three digits — enough for support to confirm they're looking at the right person, not enough to be the number) can't end up in a log by accident, no matter which code path produced it.

**A real readiness check.** \`/health\` still answers "is the process running" with no dependency checks — that's what it should be, since an orchestrator uses it to decide whether to *restart* a pod, and a database outage shouldn't trigger a restart loop. A new \`/ready\` endpoint actually queries the database and returns a 503 if it can't reach it — the signal an orchestrator should use to *stop routing traffic here*, which is a meaningfully different decision from "restart this."

**The payment funnel became visible.** Structured log lines now mark each state transition a contribution goes through — initiated, settled successfully, settled with a mismatch, failed — because a drop in successful payments is, as the original audit put it, "the single most important business signal," and before this change it was invisible until users started complaining.

## What we deliberately left out

The fuller version of this fix — the kind you'd find in a fully mature setup — also wires in Prometheus metrics and OpenTelemetry distributed tracing. We didn't build that here, on purpose. Changa runs as a single replica with no metrics-scraping infrastructure or trace collector deployed anywhere; adding that instrumentation now would be code pointed at nothing, dead weight until infrastructure exists to receive it. What shipped is the part that's pure library code with no new infrastructure dependency — logs, correlation, and Sentry (which only needed a DSN, since the dependency was already there). The structured event logs for the payment funnel are written so that promoting them into real metrics later is a mechanical, low-risk follow-up, not a redesign.

## How we knew it worked

We stopped the database on purpose and confirmed \`/health\` still said OK while \`/ready\` correctly returned 503 with a full stack trace logged. We sent a custom \`x-request-id\` and confirmed it came back unchanged instead of being overwritten. And we deliberately logged a line containing a password and a phone number and confirmed the redaction step caught both.

**The lesson:** the time to add observability is before you need to debug something, not during. If a request can fail in a way nobody can trace back to its cause, that's not a missing feature — it's the reason a dozen other bugs stay invisible until a user reports them.`,
  },
  {
    id: 15,
    slug: 'changa-api-contract-drift',
    title: 'When the app and the server quietly stop agreeing',
    excerpt:
      'The Flutter app called an endpoint the server didn\'t define — and got a 422 instead of a clean 404, disguising a dead route as a validation error for months.',
    category: 'backend',
    readingTime: '4 min read',
    createdAt: '2026-04-29',
    tags: ['changa', 'api-design', 'fastapi', 'flutter'],
    content: `The Flutter app's main project-browsing screen called \`GET /projects\`. The server didn't define that route. It never had — creating and listing projects had been moved, at some earlier point, to live under \`/chamas/{chama_id}/projects\` instead, and nobody had gone back to update the client.

Here's the part that let this go unnoticed for a while: \`GET /projects\` doesn't cleanly 404. FastAPI's router sees the request and matches it against \`GET /projects/{project_id}\` with an empty or invalid ID in that slot, so it comes back as a \`422\` validation error instead — which the app's error handling maps to a generic "something went wrong" message. A genuinely missing endpoint dressed itself up as a garden-variety validation failure. The mobile app was also client-side aggregating projects across every chama a user belonged to as a separate workaround, which happened to paper over just enough of the broken screen's absence to keep the bug from being glaringly obvious in daily use. And the test suite covering this exact endpoint was already failing for the same reason, which meant its signal — "hey, this is broken" — had already been silently written off before this work started.

The API also declared routes for team membership — \`/projects/{id}/members\`, \`/projects/{id}/teams\`, a team-join endpoint — that had never existed on the server at all. There's no \`Team\` concept anywhere in the backend's data model. These weren't drifted; they were speculative from the start.

## What we changed

The instinct here could easily have been "the client expects \`GET /projects\`, so let's build \`GET /projects\`." That would have been the wrong fix. Before writing anything, it's worth asking what's actually true on both sides — and it turned out \`GET /projects/mine\`, an endpoint that already existed and already ran exactly the cross-chama query the client needed, just hadn't been given the one feature (search filtering) the client was already sending as a query parameter. Building a second endpoint that does almost the same thing as one that already exists is exactly the kind of duplication that causes *this class of bug* in the first place.

So the fix was smaller than it first looked:

- Added \`search\` filtering to the endpoint that already existed, instead of inventing a new one.
- Pointed the client's project-list screen at that real endpoint.
- Deleted the client-side code calling the dead \`POST /projects\` — which, on inspection, had zero actual callers anywhere in the app. The real, working project-creation flow already correctly posted to the chama-scoped route; the dead code was an orphaned second implementation nobody used, not a missing feature.
- Deleted the team/member constants and their route builders outright, rather than stubbing out endpoints for a feature that doesn't exist in the domain model.

## How we knew it worked

The test suite's own SQLite substitution has an unrelated, pre-existing bug that made a chunk of this area unreliable to verify through pytest directly — so instead of trusting a suite already known to be noisy here, we stood up a real server against a real Postgres database and walked the actual flow end to end: register, create a chama, create two projects, confirm the dead routes now correctly 404, confirm the real endpoint returns both projects with no filter and correctly narrows to one with a matching search term and to zero with a non-matching one.

**The lesson:** contract drift between a client and a server doesn't always look like an error — it can look like a slightly-too-generic failure message that gets shrugged off as a fluke. Before building the endpoint a client says it wants, check whether something that already does the job is sitting one function away from correct.`,
  },
  {
    id: 16,
    slug: 'changa-audit-trail',
    title: 'The history that matters is the history you didn\'t record',
    excerpt:
      'Three functions quietly overwrote data with no record of who changed what or when. Hooking into a database event to make an audit trail nobody has to remember to write.',
    category: 'backend',
    readingTime: '5 min read',
    createdAt: '2026-05-04',
    tags: ['changa', 'audit', 'postgresql', 'sqlalchemy'],
    content: `\`update_project\` and \`update_chama\` both worked the same simple way: loop over whatever fields the request sent, and \`setattr\` each one onto the database row. \`remove_member\` hard-deletes the row the moment someone is removed from a chama. \`regenerate_invite_code\` overwrites the old code in place. All perfectly functional — and all of them leave zero trace of *who* did it, *when*, or *what the value was before*.

For a platform that pools members' money and moves it through mobile payment providers, that gap isn't just inconvenient — it's the kind of thing a regulator, a due-diligence review, or simply an angry member disputing a change will ask about directly, and "we don't keep that information" is not an answer anyone wants to give. There's a second, smaller but very real gap sitting right next to it: the mobile app's registration screen has a checkbox — "I agree to the Terms and Conditions" — that gates whether the submit button is even clickable, but the value of that checkbox was never sent to the server at all. The UI implies consent is being tracked. It wasn't being recorded anywhere.

## What we changed

**An audit trail that can't be forgotten, because no handler has to remember to write it.** Rather than adding a line to every route that changes a \`Project\`, a \`Chama\`, a membership, a \`Contribution\`, or a \`Budget\`, we hooked directly into SQLAlchemy's \`before_flush\` event — the point right before *any* change is about to be written to the database, for any reason. That hook inspects what's about to change, builds a before/after snapshot of exactly which fields moved and what they moved from and to, and writes it as its own row in an append-only \`audit_events\` table, in the same transaction as the change itself. A developer adding a new field to \`Project\` doesn't need to also remember to log changes to it — the hook already covers the whole model.

**Consent became evidence, not just a client-side gate.** Registration now requires a \`terms_accepted\` field the server actually validates, and a successful registration writes a \`consent_records\` row capturing the policy version, the request's IP, and its user agent — the checkbox the app already had now actually does something server-side, instead of gating a button and then being discarded.

**KYC got a table, deliberately not a lock.** The audit's full recommendation included tiered identity verification with hard contribution limits for unverified users. We built the \`kyc_profiles\` table — every new user gets a row, starting at the lowest tier — but we did not wire up an enforced spending cap, because there's no identity-verification flow yet to let anyone move *off* that lowest tier. Shipping a hard, permanent cap with no way for a real user to ever raise it isn't a technical decision to make unilaterally; it's a product decision, and it got surfaced and confirmed explicitly rather than shipped quietly as a side effect of "doing the compliance work."

## The bug that took the longest to understand

The first version of this set \`actor_id\` — whose change was this? — from inside the function that authenticates a request and resolves the current user. It seemed like the obvious place: by the time that function runs, you know exactly who's making the request. Every audit row it produced for an authenticated action came back with the actor recorded as nobody.

The actual cause sits in how FastAPI dispatches synchronous code. A \`def\` (not \`async def\`) route handler, and each of *its* synchronous dependencies, don't run in the same thread — each one gets dispatched to the thread pool independently, and each of those dispatches takes its own independent snapshot of the request's context at the moment it starts. Setting a value inside one of those snapshots doesn't write back to the shared request — it writes to a private copy that gets thrown away the moment that one dependency finishes. The function that authenticates the user, and the route handler that actually saves the change, were running in two different copies of the same context, and a value set in one was invisible to the other.

The fix was to stop trying to set it from inside the authentication dependency, and set it instead in the one place that runs *before* any of those thread-pool dispatches happen at all: the outermost request middleware, which runs directly in the request's own async context, before anything gets copied anywhere. Every dependency and handler that runs afterward inherits that value correctly, because their copies are taken *after* it was set, not from some other independent copy.

## How we knew it worked

We created a chama, then updated it, and checked the database directly rather than trusting the API's response: one \`chamas.created\` audit row and one \`chamas.updated\` row, the updated row's before/after JSON showing exactly the field that changed, and — the part that had been silently wrong — the actor on both rows correctly matching the user who made the request, not \`NULL\`.

**The lesson:** a session hook that fires automatically is a stronger guarantee than a habit every developer has to remember. And when something that should obviously work doesn't, it's worth understanding *why* all the way down — "it's probably a threading thing" isn't an explanation, it's a hunch, and the actual answer here was specific, checkable, and fixable.`,
  },

  // ---- Hardening the Reconciliation Worker ----
  // A seven-part series on retries, dead letter queues, and failure handling
  // in a multi-tenant SaaS reconciliation worker.
  {
    id: 17,
    slug: 'hardening-the-reconciliation-worker',
    title: 'Hardening the Reconciliation Worker',
    excerpt:
      'A seven-part series on retries, dead letter queues, and failure handling in a multi-tenant SaaS reconciliation worker — from delivery semantics to the category error that turns an unmatched transaction into a permanently lost one.',
    category: 'infrastructure',
    readingTime: '3 min read',
    createdAt: '2026-07-18',
    tags: ['distributed-systems', 'celery', 'dead-letter-queue', 'reconciliation', 'series-index'],
    content: `### A seven-part series on retries, dead letter queues, and failure handling in a multi-tenant SaaS

---

Most teams discover dead letter queues the same way: something in production is stuck in a loop, logs are full of the same traceback repeating every two seconds, and a queue that should be empty has forty thousand messages in it. Someone says "we should add a DLQ" and the ticket gets written.

Then the DLQ gets built as a table nobody reads, and eighteen months later there are 200,000 rows in it, some of which represent money that was never posted to a ledger.

This series is about doing it properly. It treats the dead letter queue not as a bug-catching afterthought but as a designed component of the system with its own operational contract: what enters it, what it stores, who is paged when it fills, how a message leaves it, and what happens to the business state in the meantime.

The running example is a **reconciliation worker in a multi-tenant SaaS** — a background consumer that ingests payment provider callbacks and statements, matches them against internal records, and updates a ledger. Multi-tenancy is not decoration here. It changes the isolation model, the alerting thresholds, the replay semantics, and the data protection requirements in ways that single-tenant advice ignores.

### Stack assumptions

Examples are Python: **Celery** on Redis or RabbitMQ, **Django/DRF** and **FastAPI**, **PostgreSQL**. Where broker behaviour differs materially, RabbitMQ, SQS and Kafka are each covered on their own terms, because the semantics are genuinely not interchangeable. The architectural arguments are language-agnostic; the code is there to make them concrete.

---

## The series

**[Part 1 — Delivery Semantics and the Anatomy of a Poison Pill](/blog/dlq-delivery-semantics-poison-pills)**
Why a worker retries forever in the first place. At-least-once delivery, acknowledgement models, head-of-line blocking, and a failure taxonomy that actually drives control flow.

**[Part 2 — Retry Policy: Backoff, Budgets, and Idempotency](/blog/dlq-retry-policy-idempotency)**
Exponential backoff with jitter, retry budgets, circuit breakers, visibility timeouts, and the idempotency work you must do *before* retries are safe.

**[Part 3 — Building the Dead Letter Queue](/blog/dlq-building-the-dead-letter-queue)**
Broker-native dead lettering versus an application-level dead letter store. Envelope design. Why reconciliation workloads usually want a table, not a queue.

**[Part 4 — Multi-Tenancy: Isolation, Fairness, and Blast Radius](/blog/dlq-multi-tenancy-isolation-fairness)**
Noisy neighbours, per-tenant quarantine, fair scheduling, tenant-scoped dead letter storage, and the cross-tenant leakage bugs that hide in replay code.

**[Part 5 — Observability: Metrics, Fingerprints, and Runbooks](/blog/dlq-observability-runbooks)**
What to measure, what to alert on, how to collapse 4,000 failures into one incident, and the triage decision tree an on-call engineer follows at 03:00.

**[Part 6 — Replay, Repair, and Schema Evolution](/blog/dlq-replay-repair-schema-evolution)**
Replay as a first-class feature: dry runs, rate limiting, ordering, payload repair with audit trails, and versioned envelopes that survive a year of schema drift.

**[Part 7 — Reconciliation Is Different: Technical Failures vs Business Exceptions](/blog/dlq-reconciliation-business-exceptions)**
The most expensive mistake in this whole design: dead-lettering a transaction that simply hasn't matched *yet*. Suspense accounts, matching windows, and money-safety invariants.

---

## How to read it

Parts 1–3 are foundational and sequential. Part 4 is the one that matters if you are shipping SaaS. Parts 5 and 6 are operational and can be read independently. Part 7 is domain-specific to reconciliation and financial workloads, and is the part most likely to save you from a genuinely bad incident.

If you only read one: **Part 7**. It describes a category error that a correctly-built DLQ will happily help you commit.`,
  },
  {
    id: 18,
    slug: 'dlq-delivery-semantics-poison-pills',
    title: 'Delivery Semantics and the Anatomy of a Poison Pill',
    excerpt:
      'Before you can design a dead letter queue, you have to be precise about why a message comes back at all. At-least-once delivery, broker-specific redelivery mechanics, and a failure taxonomy that actually drives control flow.',
    category: 'infrastructure',
    readingTime: '10 min read',
    createdAt: '2026-06-05',
    tags: ['distributed-systems', 'celery', 'rabbitmq', 'kafka', 'sqs'],
    content: `*Hardening the Reconciliation Worker, Part 1 of 7*

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

**RabbitMQ.** The consumer holds an unacknowledged delivery. \`basic.ack\` removes it; \`basic.nack\`/\`basic.reject\` with \`requeue=true\` puts it back on the queue — typically at the head, which is what produces the tight, log-flooding loop. With \`requeue=false\`, the message is discarded *or* routed to a dead-letter exchange if one is configured. A crashed or disconnected consumer causes automatic redelivery of everything it held unacknowledged.

**SQS.** There is no ack/nack. A received message becomes invisible for the duration of the *visibility timeout*. Delete it and it's gone; fail to delete it and it silently reappears when the timer expires. \`ApproximateReceiveCount\` tracks how many times this has happened. Crucially, a message that takes longer to process than the visibility timeout will be redelivered **while your worker is still processing it** — the single most common source of "impossible" duplicate processing in production.

**Kafka.** Nothing is redelivered in the RabbitMQ sense. The consumer group holds an offset; if you don't commit it, you re-read the same offset on the next poll or after a rebalance. A message that always throws means the offset never advances and **the entire partition stops**. Not just that message — every message behind it on that partition, potentially for many tenants. Kafka poison pills are the most damaging class because the blast radius is a whole partition, and there is no native dead lettering to bail you out.

**Celery on Redis.** Celery's Redis transport emulates visibility timeouts (\`broker_transport_options={'visibility_timeout': ...}\`, default one hour). With \`task_acks_late=True\`, a task that raises after retries are exhausted is simply marked FAILURE — Redis has no dead letter concept at all. Anything resembling a DLQ is something you build. This is the situation most Django/Celery shops are actually in, and it is why Part 3 argues for an application-level dead letter store.

## 3. What a poison pill actually costs you

A poison pill is a message that will fail on every attempt, forever, because the failure is a property of the message rather than of the environment. A truncated JSON body. A \`amount\` field that arrived as \`"N/A"\`. A callback referencing a \`checkout_request_id\` that was never persisted because the originating request rolled back.

The naive cost is "one record doesn't get processed." The real costs compound:

- **Retry amplification.** One message failing every 2 seconds for a weekend is ~200,000 executions. If each one opens a DB connection and does three queries, you have burned 600,000 queries on a message that was doomed at parse time.
- **Head-of-line blocking.** With Kafka partitions, or with prefetch and ordered delivery in RabbitMQ, the failing message delays the messages behind it. Your p99 for *every other tenant* degrades because one merchant's integration sent malformed data.
- **Alert fatigue and log burial.** The same traceback 200,000 times buries every other error in the window. The incident you actually needed to see is somewhere in there.
- **Worker starvation.** Concurrency slots occupied by a doomed message are slots not processing real work. At sufficient volume, a handful of poison pills consumes a whole worker pool.
- **Cost.** In cloud terms this is real money: SQS requests, egress, CPU, connection pool pressure that forces you to scale Postgres.

## 4. The two failure modes you must not conflate

There is a tempting shortcut:

\`\`\`python
@app.task
def reconcile(payload):
    try:
        _reconcile(payload)
    except Exception:
        logger.exception("reconciliation failed")
        # swallowed — no retry, no loop, no problem
\`\`\`

This stops the loop by converting every failure into silent data loss. A transient database blip now permanently drops a payment record, and the only evidence is a log line that rotated out of retention eleven days ago. In a reconciliation pipeline, this is strictly worse than the poison pill it was written to fix: the poison pill is loud, and loud problems get fixed.

The correct move is to classify, then act:

**Transient failures** are properties of the *environment*, not the message. Connection resets, deadlocks, upstream 502s and timeouts, lock contention, rate limits. The same message will very likely succeed later. Retry these — with backoff, which is Part 2.

**Permanent failures** are properties of the *message*. Schema violations, unparseable values, missing required fields, references to entities that will never exist, business rules that can never be satisfied by this payload. Retrying is pure waste. Dead letter these immediately, on the first attempt — do not spend five exponential retries proving that a missing field is still missing.

**Ambiguous failures** are the hard middle. \`IntegrityError\` might be a genuine duplicate (permanent, and possibly benign) or a race with a concurrent writer (transient). \`404 from the provider\` might mean "not yet visible" (transient, common with eventually-consistent payment APIs) or "never existed" (permanent). Default ambiguous cases to transient with a **low** max-attempt count — a bounded number of retries, then dead letter. You get the benefit of the doubt without the infinite loop.

## 5. Making the taxonomy structural

Classification must live in the type system, not in a chain of \`if isinstance\` checks scattered across handlers. Define the taxonomy once and make every failure path choose a branch:

\`\`\`python
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
\`\`\`

Then map third-party exceptions at the boundary, where you still have the context to judge:

\`\`\`python
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
\`\`\`

The default case is the one people get wrong. Unknown exception types are usually *bugs* — \`AttributeError\`, \`KeyError\`, \`TypeError\` — and bugs are deterministic. Treating unknowns as transient means every new code defect becomes a retry storm. Treating them as ambiguous, with a max of two or three attempts, contains the damage while leaving room for the occasional genuinely flaky unknown.

## 6. Validate before you do work

The cheapest poison pill is one you never let into the expensive part of the pipeline. Parse and validate the payload at the very top of the task, before any I/O:

\`\`\`python
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
\`\`\`

Two things are happening here. First, a whole class of failure is diverted before it can touch the database or the provider API. Second — and this matters more than it looks — the boundary between "malformed" and "correct but unprocessable" becomes a line of code rather than a judgement call, which means it is testable.

Note that \`dead_letter()\` receives \`raw\`, not \`payload\`. Always preserve the original. The moment you dead-letter a parsed or partially-transformed object, you have destroyed your ability to replay the message after you fix the parser. Part 3 goes into what else the envelope must carry.

---

## Takeaways

1. At-least-once delivery means retry is your system's default; a DLQ is the mechanism for revoking it.
2. Know your broker's specific redelivery mechanism — visibility timeouts, unacked deliveries and uncommitted offsets fail in materially different ways, and Kafka's blast radius is a whole partition.
3. Never swallow exceptions to stop a loop. Silent data loss in a reconciliation pipeline is worse than a loud failure.
4. Classify failures as transient, permanent or ambiguous, in the type system, and let the class drive retry behaviour.
5. Default unknown exceptions to ambiguous with a low attempt cap — most unknowns are bugs, and bugs are deterministic.
6. Validate at the boundary before doing I/O, and dead letter the *raw* payload.

**Next:** [Part 2 — Retry Policy: Backoff, Budgets, and Idempotency](/blog/dlq-retry-policy-idempotency), where we make retrying safe before we make it aggressive.`,
  },
  {
    id: 19,
    slug: 'dlq-retry-policy-idempotency',
    title: 'Retry Policy: Backoff, Budgets, and Idempotency',
    excerpt:
      'A retry you can\'t afford to run twice is a bug, not a retry. Idempotency, exponential backoff with jitter, circuit breakers, and the visibility-timeout bug that produces "impossible" duplicate processing.',
    category: 'infrastructure',
    readingTime: '11 min read',
    createdAt: '2026-06-12',
    tags: ['distributed-systems', 'celery', 'retries', 'idempotency'],
    content: `*Hardening the Reconciliation Worker, Part 2 of 7*

---

Part 1 established that retry is the default behaviour of an at-least-once system. This part is about controlling it. Two rules govern everything below:

1. **A retry you cannot afford to have execute twice is a bug, not a retry.** Idempotency comes first, chronologically and architecturally.
2. **Retries are a load multiplier aimed at a system that is already unhealthy.** Every retry policy is also a self-DDoS policy if you get the parameters wrong.

## 1. Idempotency first

Under at-least-once delivery, duplicate execution is not an edge case, it is a scheduled event. It happens on worker crash, on visibility timeout expiry mid-processing, on network partition during ack, on consumer group rebalance, and on every manual replay you will ever run.

For a reconciliation worker, the invariant is: *processing the same provider event N times must produce the same ledger state as processing it once.*

The weak way to do this is a read-then-write check:

\`\`\`python
if not LedgerEntry.objects.filter(provider_ref=ref).exists():
    LedgerEntry.objects.create(...)     # race window lives here
\`\`\`

Two workers running concurrently — which is exactly what happens on visibility-timeout redelivery — will both see \`False\` and both insert. The check must be enforced by the database, not by application control flow.

**Use a unique constraint, and let the insert be the check:**

\`\`\`sql
CREATE TABLE ledger_entry (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    provider_ref    TEXT NOT NULL,
    amount          NUMERIC(20,4) NOT NULL,
    currency        CHAR(3) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_ledger_tenant_ref UNIQUE (tenant_id, provider_ref)
);
\`\`\`

The scope of that key is a design decision with teeth. \`(tenant_id, provider_ref)\` is right for most SaaS: provider references are only unique within a merchant's account, and a global unique index on \`provider_ref\` alone will eventually cause one tenant's write to fail because a different tenant happened to receive the same reference. That failure is a cross-tenant data bug wearing an \`IntegrityError\` costume.

**Then make the whole unit of work atomic and idempotent:**

\`\`\`python
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
\`\`\`

Two details worth stealing. First, the duplicate path returns *success* — a redelivered message that has already been applied must acknowledge cleanly, not retry and not dead letter. Second, the constraint name is checked explicitly. Catching bare \`IntegrityError\` and assuming "duplicate" will one day swallow a foreign key violation and silently drop a payment.

**Where the side effect isn't a database write** — sending an SMS, calling a settlement API, emitting a webhook — the unique constraint trick doesn't apply. Use an idempotency key passed to the downstream service (Stripe and most modern payment APIs support this natively), or record intent in a table inside the same transaction and perform the side effect from an outbox after commit. Never perform a non-idempotent external side effect inside a retryable task without one of these.

**Non-atomic multi-step tasks are the remaining trap.** If a task writes the ledger, then calls the provider, then updates the invoice, a failure at step two leaves partial state that step one will not redo on retry. Either wrap the whole thing in a transaction (and keep external calls out of it), or split into separate tasks each with its own idempotency key, chained on success. A long task with several independent side effects is a task that cannot be safely retried.

## 2. Backoff and jitter

Only once idempotency holds should you tune aggression.

**Fixed-interval retry is the wrong default.** If the failure cause is an overloaded dependency, retrying every 2 seconds adds load to the thing you need to recover. Exponential backoff gives the dependency room:

\`\`\`
delay = min(base * 2 ** attempt, cap)
\`\`\`

With \`base=2, cap=600\`: 2s, 4s, 8s, 16s, 32s… capped at 10 minutes.

**Jitter is not optional.** A dependency outage fails a thousand messages at roughly the same instant. Without jitter, all thousand retry at exactly \`t+2\`, then \`t+6\`, then \`t+14\` — a synchronised thundering herd that re-breaks the dependency the moment it recovers. Full jitter is the standard fix:

\`\`\`python
import random

def backoff_delay(attempt: int, base: float = 2.0, cap: float = 600.0) -> float:
    return random.uniform(0, min(cap, base * (2 ** attempt)))
\`\`\`

In Celery this is configuration rather than code:

\`\`\`python
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
\`\`\`

\`acks_late=True\` is what makes a hard worker kill (OOM, SIGKILL, node eviction) redeliver rather than vanish. \`reject_on_worker_lost=True\` is its necessary companion. The cost is that you are now explicitly in duplicate-execution territory — which section 1 already handled.

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

\`\`\`python
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
\`\`\`

The important interaction with the DLQ: **a message that fails because the circuit is open should not count against its retry budget.** It never reached the dependency. Either re-queue it with a delay equal to the circuit's cooldown, or exclude \`CircuitOpen\` from attempt counting. Otherwise your breaker — a protection mechanism — becomes the thing that mass-dead-letters healthy traffic.

In a multi-tenant system, key the breaker per tenant where the dependency is per tenant (one merchant's misconfigured API credentials shouldn't trip the circuit for everyone), and globally where the dependency is shared. Part 4 develops this.

## 4. Retry budgets: bounding the multiplier

Per-message attempt caps bound one message. They do not bound the system. During a broad outage, a queue of 50,000 messages with a cap of 6 generates up to 300,000 executions — often against a dependency that is failing *because* of load.

A retry budget caps retries as a proportion of total work, system-wide:

> Retries may not exceed 20% of total request volume in any 60-second window.

Above that ratio, retries are dropped straight to the DLQ rather than scheduled. This is a deliberate trade: some messages that would have succeeded on attempt four get dead-lettered, in exchange for the system not amplifying its own outage. Implement it as a Redis sliding-window counter checked before scheduling a retry; export it as a metric, because a saturated retry budget is one of the highest-signal alerts you can have.

## 5. The visibility timeout bug

This deserves its own section because it is subtle, common, and produces "impossible" symptoms.

If a task takes longer than the broker's visibility timeout (SQS \`VisibilityTimeout\`, Celery-on-Redis \`visibility_timeout\`, RabbitMQ \`consumer_timeout\`), the broker concludes the consumer is dead and redelivers **while the original worker is still running**. Two workers now process the same message concurrently. Symptoms: duplicate ledger rows, deadlocks between the two copies, \`ApproximateReceiveCount\` climbing on messages that eventually succeed, and totals that are wrong by exactly one transaction.

Rules:

- Set the visibility timeout to **at least 3× your p99 task duration**, not your median.
- For genuinely long tasks, extend the timeout during processing (SQS \`ChangeMessageVisibility\` heartbeat) rather than setting a huge static value — a huge value means a genuinely crashed worker's messages are stuck invisible for that whole period.
- Better: keep tasks short. Split long reconciliation runs into per-batch tasks. A 4-hour statement reconciliation should be a coordinator that fans out into hundreds of small idempotent units.
- Never let a task's *retry* delay exceed the visibility timeout in brokers where the retry is implemented by re-enqueueing the same delivery.

## 6. Putting the retry path together

\`\`\`python
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
\`\`\`

Every exit from this function is deliberate: applied, duplicate-ignored, dead-lettered with a machine-readable reason, or scheduled for a retry whose delay and budget are both bounded. There is no path that loops forever and no path that silently drops data.

---

## Takeaways

1. Idempotency is a prerequisite for retries, not a companion feature. Enforce it with database constraints scoped to \`(tenant_id, ref)\`, never with read-then-write checks.
2. A duplicate that has already been applied is a *success*. Acknowledge it.
3. Exponential backoff with full jitter, always. Synchronised retries re-break recovering dependencies.
4. Cap attempts by failure class: 0 for permanent, 2–3 for ambiguous, 5–8 for transient.
5. Circuit breakers fix the failure class; make sure open-circuit failures don't consume a message's retry budget, or your breaker will mass-dead-letter healthy traffic.
6. Retry budgets bound system-wide amplification. Alert on budget saturation.
7. Visibility timeout must exceed p99 task duration by a wide margin, or you get concurrent duplicate processing that looks impossible from the logs.

**Next:** [Part 3 — Building the Dead Letter Queue](/blog/dlq-building-the-dead-letter-queue).`,
  },
  {
    id: 20,
    slug: 'dlq-building-the-dead-letter-queue',
    title: 'Building the Dead Letter Queue',
    excerpt:
      'A dead letter queue is a work queue for humans, not an error log. Broker-native dead lettering versus an application-level table, and the envelope design that makes replay possible six months later.',
    category: 'infrastructure',
    readingTime: '10 min read',
    createdAt: '2026-06-19',
    tags: ['distributed-systems', 'postgresql', 'celery', 'dead-letter-queue'],
    content: `*Hardening the Reconciliation Worker, Part 3 of 7*

---

A dead letter queue is a destination for messages that the system has decided not to attempt again. That is the whole concept. Everything interesting is in the details: where it lives, what it stores, and what contract it offers to the humans who have to act on it.

The framing that keeps designs honest: **a DLQ is not an error log. It is a work queue for humans.** Every entry represents a unit of unfinished business that someone must resolve, and it should be designed with the same care as any other queue — with a producer contract, a consumer (a person, or a repair job), a retention policy, and a definition of done.

## 1. Broker-native dead lettering

### RabbitMQ: dead letter exchanges

RabbitMQ has the most complete native support. A queue is declared with a dead-letter exchange, and messages are routed there when they are rejected with \`requeue=false\`, when they expire via TTL, or when a length limit is exceeded.

\`\`\`python
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
\`\`\`

\`x-delivery-limit\` on quorum queues is the single most valuable line here: the broker itself caps redeliveries, so even a bug in your application's retry logic cannot produce an infinite loop. RabbitMQ also adds an \`x-death\` header recording the reason, count, original exchange and timestamps — the beginnings of an envelope, though a thin one.

### SQS: redrive policy

\`\`\`json
{
  "RedrivePolicy": {
    "deadLetterTargetArn": "arn:aws:sqs:eu-west-1:123456789012:reconcile-dlq",
    "maxReceiveCount": 5
  }
}
\`\`\`

After five receives without deletion, SQS moves the message to the DLQ automatically. It is genuinely zero-effort, and AWS provides a built-in *redrive* operation to move messages back. Two caveats: the DLQ inherits the source queue's retention (set it to the maximum, 14 days, or you will silently lose dead letters), and \`maxReceiveCount\` counts *receives*, so a message that times out due to slow processing burns budget without ever having failed.

### Kafka: no native DLQ

Kafka has no dead letter concept. The consumer must implement it: on a non-retryable failure, produce the record to a \`.DLT\` topic and commit the offset so the partition advances.

\`\`\`python
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
\`\`\`

The ordering matters: flush the DLT produce before committing, or a crash between the two loses the message entirely. Note also that dead-lettering breaks Kafka's per-key ordering guarantee — event 3 is parked while events 4 and 5 proceed. For a ledger this can be significant, and Part 6 discusses ordering on replay.

### Celery on Redis: nothing

Celery has no dead letter mechanism, and Redis has no equivalent primitive. A task that exhausts retries is recorded as FAILURE in the result backend, which by default expires in 24 hours and contains a traceback string rather than your payload. For most Django/Celery teams this means the DLQ is something you build — which, for reconciliation, turns out to be the better outcome anyway.

## 2. Why reconciliation wants a table, not a queue

Broker-native dead lettering is excellent at stopping the loop. It is poor at everything that comes after, because a queue is a bad interface for the questions you actually ask about dead letters:

- How many failures does tenant 47 have, and are they all the same bug?
- Which of these represent money that has not been posted?
- Show me everything that failed with \`SCHEMA_INVALID\` between Friday and Monday.
- Which of these were already fixed and replayed, by whom, and when?

Those are queries. A queue can't answer them; it can only give you messages one at a time, and reading a message to inspect it either consumes it or requires awkward peeking. A Postgres table answers all of them with SQL, joins to your tenant and ledger tables, participates in the same transaction as your business writes, and gives you an audit trail for free.

**The pragmatic architecture is both:** broker-native dead lettering as the last-resort safety net that catches what your application never got to handle (worker OOM, deserialization failures before your code runs, bugs in the retry logic itself), and an application-level dead letter table as the primary, semantically rich store that your team and your admin UI actually work with.

## 3. Envelope design

This is where most implementations are too thin, and thinness is only discovered three months later when you try to replay and can't. Store the following:

**Identity and routing**
\`id\` (UUID, stable across replays), \`tenant_id\`, \`queue\`/\`task_name\`, \`correlation_id\`, \`causation_id\`.

**The payload**
\`raw_payload\` — the original bytes or JSON, exactly as received, before any parsing or coercion. Plus \`content_type\` and \`schema_version\`. If you store a transformed payload, you cannot replay after fixing the transformer, which is the single most common reason to replay.

**Failure detail**
\`error_code\` (stable, machine-readable — \`SCHEMA_INVALID\`, \`TENANT_SUSPENDED\`, \`RETRIES_EXHAUSTED\`), \`error_class\`, \`error_message\`, \`traceback\`, and \`fingerprint\` (a hash of the normalised traceback — see Part 5, this is what turns 4,000 rows into one incident).

**Lifecycle**
\`attempts\`, \`first_failed_at\`, \`last_failed_at\`, \`dead_lettered_at\`, \`status\` (\`pending\`, \`investigating\`, \`replaying\`, \`resolved\`, \`discarded\`), \`resolution\`, \`resolved_by\`, \`resolved_at\`, \`replay_count\`, \`origin_dead_letter_id\` (set when a replay itself dies, so you can detect ping-ponging).

**Provenance**
\`worker_hostname\`, \`release_sha\`, \`broker_message_id\`, \`received_at\`. Knowing which deploy introduced a failure class collapses investigation time dramatically.

\`\`\`python
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
\`\`\`

That partial unique constraint is doing real work: it collapses repeated failures of the *same* logical message into one open row with an incrementing \`attempts\` counter, instead of 200 rows. A DLQ that duplicates rows per attempt is a DLQ nobody can triage.

## 4. The write path

\`\`\`python
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
\`\`\`

**Two failure modes of the write path itself, which you must handle:**

*The dead letter write fails.* If Postgres is down, \`dead_letter()\` raises, the task fails, and the broker redelivers — which is correct, because the message is not yet safely parked. But if the DB is down and you were dead-lettering *because* of a DB error, you now have a retry loop. Guard it: if the dead letter write fails, fall back to emitting the raw envelope to a broker-native DLQ or to structured logs at ERROR with a dedicated marker that your log pipeline routes to storage. Never let the safety net's failure become silent data loss.

*The payload is too large.* Provider statements and batch callbacks can be megabytes. Storing them inline bloats the table and slows every query. Above a threshold (say 256 KB), write the payload to object storage and keep a URI in the row. Keep the metadata in Postgres — the row must remain queryable.

## 5. Wiring it in without touching every task

Celery's \`on_failure\` hook gives you a single choke point for the retries-exhausted path:

\`\`\`python
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
\`\`\`

Every task inheriting \`ReconcileTask\` gets dead lettering for free, which matters because the failure you didn't anticipate is by definition in the task you didn't instrument.

## 6. What a DLQ is not

- **Not an error log.** Logs are for diagnosis; the DLQ is for *resolution*. If entries can sit there permanently without anyone acting, you have built a log with worse ergonomics.
- **Not a substitute for validation at the source.** A steadily-filling DLQ means the producer is broken. The DLQ stops the bleeding; the fix is upstream.
- **Not a place for business exceptions.** An unmatched transaction that might match tomorrow does not belong here. This distinction is important enough to be its own article — Part 7.
- **Not exempt from data protection.** Those raw payloads contain customer PII and financial detail, now sitting in a table with looser access controls than your production tables and a retention policy nobody wrote. Part 4 addresses this directly.

---

## Takeaways

1. Use broker-native dead lettering as a safety net — especially RabbitMQ quorum queues' \`x-delivery-limit\`, which caps redeliveries below your application logic.
2. Use an application-level dead letter *table* as the primary store: queryable, joinable, auditable, and transactional with your business writes.
3. Store the raw payload, never a parsed one. Replay after fixing the parser is the main use case.
4. Design the envelope for triage: stable error codes, traceback fingerprints, lifecycle status, resolution audit, and release SHA.
5. Collapse repeated failures of the same logical message into one row with a partial unique constraint.
6. Handle the failure of the dead-letter write itself; the safety net needs a safety net.
7. A DLQ is a work queue for humans. If nothing consumes it, it is a graveyard.

**Next:** [Part 4 — Multi-Tenancy: Isolation, Fairness, and Blast Radius](/blog/dlq-multi-tenancy-isolation-fairness).`,
  },
  {
    id: 21,
    slug: 'dlq-multi-tenancy-isolation-fairness',
    title: 'Multi-Tenancy: Isolation, Fairness, and Blast Radius',
    excerpt:
      'In a shared worker pool, one tenant\'s failure is every other tenant\'s latency. Sharded queues, tenant quarantine, and the replay bug that turns ambient context into a cross-tenant data breach.',
    category: 'infrastructure',
    readingTime: '11 min read',
    createdAt: '2026-06-26',
    tags: ['multi-tenancy', 'distributed-systems', 'postgresql', 'celery'],
    content: `*Hardening the Reconciliation Worker, Part 4 of 7*

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

\`\`\`python
QUEUE_SHARDS = 16

def queue_for(tenant_id: str) -> str:
    override = shard_overrides.get(tenant_id)      # cached from DB/Redis
    if override:
        return override                            # e.g. "reconcile.quarantine"
    h = int(hashlib.blake2b(tenant_id.encode(), digest_size=8).hexdigest(), 16)
    return f"reconcile.shard.{h % QUEUE_SHARDS}"

reconcile.apply_async(kwargs={"raw": payload}, queue=queue_for(tenant_id))
\`\`\`

**Priority lanes crossed with shards.** Separate \`interactive\` (a user is waiting — checkout callbacks) from \`bulk\` (statement imports, backfills, replays) and give each its own worker pool. This solves the volume noisy-neighbour case cleanly: a tenant's 400,000-row backfill physically cannot consume the workers serving live callbacks. If you implement only one thing from this article, make it this one — it is cheap and the payoff is immediate.

**Weighted fair queueing** — round-robin across tenants with weights, so no single tenant consumes more than its share of a pool — is the rigorous answer, and it is a real amount of machinery to build on Celery. Shards plus lanes plus concurrency caps gets you 90% of the benefit. A simple per-tenant concurrency cap via a Redis semaphore covers most of the rest:

\`\`\`python
def acquire_tenant_slot(tenant_id: str, limit: int) -> bool:
    key = f"conc:{tenant_id}"
    n = r.incr(key)
    r.expire(key, 300)
    if n > limit:
        r.decr(key)
        return False
    return True
\`\`\`

If the slot can't be acquired, re-queue with a short delay — and, as in Part 2, **do not count it as a retry attempt**. The message did no work.

## 3. Tenant quarantine: the circuit breaker for a customer

Circuit breakers protect dependencies. Tenant quarantine protects *the platform from a tenant*, and it is the highest-leverage control in a multi-tenant worker.

The rule: when a tenant's failure rate crosses a threshold, stop consuming that tenant's work entirely. Park incoming messages, keep processing everyone else, alert the on-call engineer and (this part matters commercially) notify the tenant.

\`\`\`python
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
\`\`\`

Quarantine is not the same as dead lettering. A quarantined tenant's messages are **parked, not failed** — held in a paused queue or a staging table with \`status='quarantined'\`, ready to resume once the underlying issue is fixed. Dead-lettering 50,000 messages because a tenant rotated an API key is technically correct and operationally miserable; parking them and resuming in one action is the difference between a five-minute recovery and a day of replay work.

Design decisions worth making explicitly:

- **Quarantine is per tenant *and* per failure class.** A tenant failing on \`SCHEMA_INVALID\` should not have their statement imports paused too.
- **Exit criteria must exist.** Auto-exit after a cooldown with a probe batch, or manual release from an admin action. A quarantine with no exit path is an outage you forgot about.
- **Tenants must be told.** "We paused reconciliation for your account at 14:20 because 87% of callbacks failed validation" is a far better customer experience than silent degradation, and it converts a platform incident into a customer-side fix.

## 4. Tenant-scoped alerting

Absolute thresholds are wrong in multi-tenant systems. \`dlq_depth > 100\` means "catastrophe" for a tenant that processes 200 transactions a day and "Tuesday" for one processing two million.

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

\`\`\`sql
ALTER TABLE dead_letter ENABLE ROW LEVEL SECURITY;

CREATE POLICY dead_letter_tenant_isolation ON dead_letter
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
\`\`\`

Combined with a connection-level \`SET LOCAL app.tenant_id\`, this makes cross-tenant leakage a database-enforced impossibility rather than an ORM filter someone forgot.

**Redaction at write time.** Strip or hash the fields you know are sensitive and don't need for replay. Be careful: over-redaction destroys replayability. The usable middle is to redact fields that are never inputs to reconciliation logic (customer name, phone) and encrypt at rest those that are (account references, amounts) using a column-level key.

**Retention.** Resolved dead letters should not live forever. A policy of "resolved rows purged after 90 days, discarded rows retained for 7 years as an audit record with payload stripped" satisfies both operational and compliance needs. Write it down and enforce it with a scheduled job, or the table will grow until someone deletes it in a panic.

**Access audit.** Log who read dead letter payloads. In a financial context you will eventually be asked.

## 6. The replay bug nobody tests for

Here is the failure I want you to remember from this article.

Multi-tenant applications typically carry tenant context implicitly — a thread-local, a context var, middleware set from the request, a \`set_current_tenant()\` call at the top of the worker loop. Replay code is usually written as an admin action or a management command, which runs *outside* the normal request path where that context is established.

\`\`\`python
# Looks fine. Is a cross-tenant data breach.
def replay(dead_letter_ids):
    for dl in DeadLetter.objects.filter(id__in=dead_letter_ids):
        reconcile.delay(raw=dl.raw_payload)   # tenant context = whoever is logged in
\`\`\`

If the task or any layer beneath it resolves the tenant from ambient context rather than from the payload, you have just written tenant A's transactions into tenant B's ledger — silently, with correct-looking data, discovered weeks later during a month-end close.

The fix is a discipline, not a patch: **tenant context is always derived from the message envelope, explicitly, at the entry point of every task, and it is asserted rather than assumed.**

\`\`\`python
def replay(dead_letter_ids, *, actor):
    for dl in DeadLetter.objects.filter(id__in=dead_letter_ids):
        assert dl.raw_payload.get("tenant_id") == str(dl.tenant_id), \\
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
\`\`\`

The \`tenant_context\` manager should set the Postgres session variable that RLS reads, so that even a logic bug in the task body cannot write across tenants. Defence in depth: the assertion catches it in application code, RLS catches it in the database.

Test this. Write an explicit test that replays tenant A's dead letter while tenant B's context is active and asserts that nothing is written to B. It is a five-line test that guards against one of the few genuinely unrecoverable bugs in this design.

---

## Takeaways

1. In shared workers, one tenant's failure is everyone's latency. Design isolation deliberately.
2. Sharded queues (16–32) plus separate interactive/bulk lanes gives most of the isolation benefit for a fraction of the complexity of per-tenant queues.
3. Tenant quarantine — parking a tenant's work, not failing it — is the highest-leverage control you can add. Give it explicit exit criteria and notify the tenant.
4. Alert on relative, tenant-scoped signals. "Distinct tenants with new dead letters in 15 minutes" separates a platform bug from a merchant bug in one glance.
5. The dead letter table is your least-governed copy of sensitive data. RLS, redaction, retention and access audit are part of the design, not follow-up work.
6. Always derive tenant context from the envelope, assert it in the task, and enforce it with RLS. Replay paths run outside your normal context plumbing and are where cross-tenant writes happen.

**Next:** [Part 5 — Observability: Metrics, Fingerprints, and Runbooks](/blog/dlq-observability-runbooks).`,
  },
  {
    id: 22,
    slug: 'dlq-observability-runbooks',
    title: 'Observability: Metrics, Fingerprints, and Runbooks',
    excerpt:
      'A dead letter queue nobody looks at is just a slower way of dropping the message. What to measure, how to fingerprint thousands of failures into one incident, and the triage runbook an on-call engineer follows at 3am.',
    category: 'infrastructure',
    readingTime: '10 min read',
    createdAt: '2026-07-03',
    tags: ['observability', 'distributed-systems', 'monitoring'],
    content: `*Hardening the Reconciliation Worker, Part 5 of 7*

---

A dead letter queue nobody looks at is a slower, more expensive version of dropping the message. This part is about the operational contract: what you measure, what wakes someone up, and what that person does next.

The mental model: **the DLQ is a work queue whose consumer is a human.** Every queue metric you would apply to a machine-consumed queue applies here too — depth, arrival rate, age of oldest item, drain rate — and the drain rate is now a property of your team's process, not your worker pool.

## 1. The metrics that matter

**Arrival rate** — \`dlq_arrivals_total{tenant, error_code, task}\`, a counter. The primary alerting signal. Depth tells you accumulated debt; *rate* tells you something is happening right now.

**Depth by status** — \`dlq_open_items{tenant, status}\`, a gauge. Only \`pending\` and \`investigating\` count as open. If this only goes up over months, your team has no resolution process and the rest of this design is theatre.

**Age of oldest open item** — \`dlq_oldest_age_seconds{tenant}\`. The best single indicator of a graveyard forming. In a financial context this is also a business metric: it is the age of the oldest transaction that has not been posted.

**Distinct tenants affected** — \`dlq_tenants_affected_15m\`. Discussed in Part 4; the fastest way to classify an incident's blast radius.

**Distinct fingerprints** — \`dlq_fingerprints_open\`. Ten thousand items across three fingerprints is three bugs. Ten thousand items across four thousand fingerprints is systemic and much worse.

**Retry exhaustion rate** — \`retries_exhausted_total / tasks_total\`. Rising exhaustion with a flat DLQ arrival rate means your retry budget is masking a degradation.

**Redelivery ratio** — \`deliveries_total / messages_total\`. Should hover near 1. A sustained ratio above ~1.2 means either flaky dependencies or the visibility-timeout bug from Part 2.

**Replay outcomes** — \`dlq_replays_total{outcome}\` where outcome is \`succeeded\`, \`failed_again\`, \`discarded\`. A replay that fails again is important signal: your fix didn't work, and you are now at risk of a replay ping-pong loop.

**Money in limbo** — \`dlq_unreconciled_amount{tenant, currency}\`, a gauge summing the amounts in open dead letters. This is the metric you show a non-technical stakeholder, and the one that gets the work prioritised. It converts "we have 812 dead letters" into "KES 4.1M is unposted," which is the same fact in a language the business acts on.

## 2. Alerting: rate and age, not depth

Depth alone is a bad page. It is high after any incident and stays high while you legitimately work through the backlog, so it either fires constantly or gets set so high it never fires.

A workable policy:

| Alert | Condition | Severity |
|---|---|---|
| Sudden failure spike | \`rate(dlq_arrivals[5m])\` > 10× tenant's 7-day baseline | Page |
| Platform-wide failure | \`dlq_tenants_affected_15m\` > 10 | Page |
| New failure class | A fingerprint never seen before, > 20 occurrences in 10m | Page |
| Money in limbo | \`dlq_unreconciled_amount\` > threshold per tenant tier | Page |
| Stale backlog | \`dlq_oldest_age_seconds\` > 72h | Ticket |
| Graveyard forming | \`dlq_open_items\` rising for 7 consecutive days | Ticket |
| Replay ping-pong | Item with \`replay_count\` ≥ 3 | Ticket |

**"New failure class" is the highest-value alert in this table** and the one teams most often lack. A fingerprint that has never been seen before, appearing shortly after a deploy, is a regression with a timestamp and a release SHA attached. That alert routinely turns a two-hour investigation into a two-minute rollback decision.

Route by ownership: platform-wide signals page the on-call engineer; single-tenant integration failures should go to whoever owns customer integrations, because the fix is usually a conversation with the merchant, not a code change.

## 3. Fingerprinting: 4,000 rows, one incident

Raw dead letters are unusable at volume. Grouping is what makes them tractable, and grouping requires a stable fingerprint.

The naive approach — hash the error message — fails because messages contain variable data: \`"invoice 4471 not found"\` and \`"invoice 4472 not found"\` are the same bug with different hashes. Hash the *structure* instead:

\`\`\`python
def fingerprint_for(exc: Exception) -> str:
    frames = traceback.extract_tb(exc.__traceback__)
    app_frames = [f for f in frames if "/site-packages/" not in f.filename]
    skeleton = "|".join(f"{f.filename}:{f.name}:{f.lineno}" for f in (app_frames or frames)[-8:])
    return hashlib.sha256(f"{type(exc).__name__}|{skeleton}".encode()).hexdigest()[:32]
\`\`\`

Filtering to application frames matters: three different library call paths that all bottom out in the same bug in your code should group together. Two caveats — line numbers change on every refactor, so a fingerprint is stable within a release series but not across them (store \`release_sha\` alongside so you can see the transition), and for \`PermanentError\` you should prefer the explicit \`error_code\` over the traceback, since the code is a deliberate, stable identity you control.

Build the triage view around fingerprints, not rows:

\`\`\`sql
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
\`\`\`

One screen, one row per bug, sorted by impact, with a sample to open and money at risk quantified. That query is the whole triage UI, and it is worth putting behind an admin page.

## 4. Correlation and tracing

Every message needs a \`correlation_id\` that survives the whole journey: the inbound webhook request, the enqueue, every retry, the dead letter row, and every replay. In practice, use the provider's reference where one exists (it is naturally unique and it is what a support engineer will search for when a merchant calls), and generate one where it doesn't.

Log it structurally on every hop:

\`\`\`python
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
\`\`\`

With OpenTelemetry, propagate the trace context in the message headers and store \`trace_id\` on the dead letter row. The payoff is direct: from an entry in the DLQ you can open the exact trace of the failing execution, including the downstream calls it made, months after the fact.

## 5. The triage runbook

Alerts without a runbook produce an engineer at 03:00 reading source code. Write the decision tree down.

**Step 1 — Classify the blast radius.**
Run the fingerprint query. One tenant, one fingerprint → tenant integration issue, likely not a page-worthy platform event; consider quarantining the tenant and handing off to the integrations owner. Many tenants, one fingerprint → platform bug, check recent deploys against \`release_sha\`. Many fingerprints, many tenants → infrastructure event (database, broker, network); check dependency health before reading any application code.

**Step 2 — Stop the bleeding.**
Is the DLQ still filling? If yes, the priority is the arrival rate, not the backlog. Options in order of preference: quarantine the affected tenant(s); disable the affected task via feature flag; roll back the deploy. Do not start replaying while arrivals continue — you will be replaying into the same failure and inflating \`replay_count\`.

**Step 3 — Determine the fix class.** This is the decision that determines everything downstream:

- **Bad code, good data** → fix, deploy, replay unmodified. The common and happy case.
- **Good code, bad data, repairable** → repair the payload (with an audit record — Part 6), then replay.
- **Good code, bad data, unrepairable** → the payload is genuinely unusable. Discard with a documented reason, and if money is involved, raise a manual journal entry. It must not simply be deleted.
- **Good code, good data, missing prerequisite** → the referenced entity doesn't exist yet, or arrived out of order. Usually this means the item should never have been dead-lettered at all; see Part 7.
- **Duplicate of already-applied work** → resolve as \`duplicate_ignored\`. Verify against the ledger before closing.

**Step 4 — Replay, in a controlled way.** Dry run, small batch, verify, then the rest. Part 6 covers the mechanics.

**Step 5 — Close the loop.** Every dead letter must reach a terminal status with a resolution note and an actor. Then ask the question that prevents recurrence: *should this have been dead-lettered at all?* If the answer is no — it was transient, or it was a business exception — the fix belongs in the classification logic of Part 1, not in the triage process.

## 6. Reviewing the DLQ as a practice

Two rituals keep this from decaying:

**A weekly triage rotation.** One engineer owns DLQ triage for the week: clear open items, group new fingerprints, file tickets for anything systemic. Half an hour if the system is healthy, and if it is much more than that, that is itself the finding.

**A monthly failure-class review.** Look at the aggregate: which error codes dominate, which tenants recur, what proportion of items were replayed successfully (a high number means you are dead-lettering things that should have been retried, or that your fixes are good), and whether \`dlq_open_items\` trends up or down over the month.

The health target is simple and worth stating in an SLO: **open items trend to zero, and the oldest is younger than a week.** A DLQ that is empty most of the time is one whose alerts you will still believe in a year.

---

## Takeaways

1. Measure arrival rate and age, not just depth. Depth is accumulated debt; rate is a live incident.
2. \`dlq_tenants_affected\` and "new fingerprint after a deploy" are the two highest-signal alerts you can build.
3. Fingerprint on traceback structure (application frames only), not on error message text, and store the release SHA alongside.
4. Triage by fingerprint group, not by row. One SQL query is a usable triage UI.
5. Propagate a correlation ID from webhook to dead letter to replay, and store the trace ID so you can open the original execution months later.
6. Expose "unreconciled amount" as a business metric — it is how this work gets prioritised.
7. Write the runbook, rotate the triage duty, and treat a growing DLQ as an SLO breach rather than background noise.

**Next:** [Part 6 — Replay, Repair, and Schema Evolution](/blog/dlq-replay-repair-schema-evolution).`,
  },
  {
    id: 23,
    slug: 'dlq-replay-repair-schema-evolution',
    title: 'Replay, Repair, and Schema Evolution',
    excerpt:
      'Replay is where a DLQ either earns its existence or reveals itself as an expensive log table. Dry runs, rate-limited execution, and the upcasters that let you safely replay a message from six months ago.',
    category: 'infrastructure',
    readingTime: '10 min read',
    createdAt: '2026-07-10',
    tags: ['distributed-systems', 'postgresql', 'schema-evolution'],
    content: `*Hardening the Reconciliation Worker, Part 6 of 7*

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

\`\`\`python
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
\`\`\`

Two deliberate choices. \`replay_count >= 3\` is excluded automatically, because a message that has failed three replays needs a human decision, not a fourth attempt. And ordering is by \`first_failed_at\` — original arrival order, not dead-letter order — which matters for the sequencing discussion below.

## 3. Dry run is mandatory

The replay command should default to *not* replaying. Make the destructive path require an explicit flag.

\`\`\`python
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
\`\`\`

The dry run output shows tenant, error class, count and monetary value — which is what tells you whether you are about to replay 12 messages or 12,000, and whether you are about to move KES 200 or KES 20 million. That number has stopped bad replays more than once.

## 4. Rate-limited execution

\`\`\`python
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
\`\`\`

Four things earning their place:

**\`select_for_update(skip_locked=True)\` with a status re-check.** Two engineers running the same replay during an incident is normal, not exotic. This makes concurrent replays safe.

**A dedicated replay queue.** Replay traffic must not compete with live callbacks — the same interactive/bulk separation from Part 4. A replay of a week's backlog should never delay a customer's checkout confirmation.

**\`transaction.on_commit\`.** Dispatching inside the transaction risks the worker picking up the task before the status update commits, and processing a message whose row still says \`pending\`.

**\`status = REPLAYING\`, not \`resolved\`.** The item is not resolved until the replay *succeeds*. The task's success path closes it out:

\`\`\`python
def on_success(self, retval, task_id, args, kwargs):
    replay_of = self.request.headers.get("replay_of") if self.request.headers else None
    if replay_of:
        DeadLetter.objects.filter(pk=replay_of).update(
            status=DeadLetter.Status.RESOLVED,
            resolved_at=timezone.now(),
            resolution=f"replayed successfully ({retval})",
        )
\`\`\`

And the failure path must set it back to \`pending\` rather than creating a second row — the \`origin\` foreign key from Part 3 exists precisely so a replay that dies again links back to its source instead of duplicating it.

## 5. Ordering on replay

This is the subtle one.

Dead lettering breaks ordering. If events 3, 4 and 5 concern the same invoice, and 3 is dead-lettered while 4 and 5 process, replaying 3 an hour later applies a stale event on top of newer state. In reconciliation this can look like a settled invoice reverting to pending, or a balance moving backwards.

Three defences, in increasing order of rigour:

**Make handlers commutative.** The strongest option where it's achievable. Design the reconciliation so that applying events in any order converges to the same state: prefer \`status = highest_rank(current, incoming)\` over \`status = incoming\`, and prefer accumulating immutable ledger entries over mutating a balance field. Order-independent handlers make the whole problem disappear.

**Version guard.** Each event carries a monotonic sequence or timestamp from the source; the handler refuses to apply an event older than the entity's current version.

\`\`\`python
updated = Invoice.objects.filter(
    tenant_id=tid, provider_ref=ref, source_version__lt=payload.source_version
).update(status=payload.status, source_version=payload.source_version)

if not updated:
    return "stale_event_ignored"     # success — a newer event already won
\`\`\`

**Per-entity sequencing.** Hold subsequent events for an entity while an earlier one is dead-lettered. Correct, and expensive — it reintroduces head-of-line blocking at entity granularity. Reserve it for genuinely order-dependent state machines.

For most reconciliation work, commutative handlers plus a version guard is the right answer, and it is also what makes replay boring — which is the goal.

## 6. Repair, with an audit trail

Sometimes the payload itself must change: a missing field defaulted, a malformed timestamp corrected, a mis-keyed tenant reference fixed after confirming with the merchant.

**Never mutate \`raw_payload\`.** It is your evidence. Store the repair as a separate, additive record:

\`\`\`python
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
\`\`\`

Replay then uses \`effective_payload(dl)\`. The original is intact, the change is attributed, the justification is recorded, and the transformation is reproducible. In a financial system this is not bureaucracy — it is the difference between "we corrected a malformed callback" and "an engineer changed a payment amount in the database."

Constrain what may be repaired. A whitelist of repairable fields, with amounts and tenant identifiers excluded or requiring a second approver, prevents the repair mechanism from becoming a backdoor for editing money.

## 7. Schema evolution: replaying a message from six months ago

Dead letters outlive deploys. A message dead-lettered in March, replayed in September, is being handed to a consumer whose schema has moved on twice. Two failure modes: the old payload no longer validates, or worse, it validates and means something different.

**Version every envelope at write time.** \`schema_version\` is stored in the dead letter row, from the payload if present and from the consumer's current version if not.

**Write upcasters, not compatibility branches.** Keep the consumer single-version and migrate old payloads forward on the way in:

\`\`\`python
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
\`\`\`

Upcasters are small, individually testable, and compose into a chain of any length. They also serve normal in-flight messages during a rolling deploy, so they are not replay-only machinery.

The unit change in \`v2_to_v3\` is the case to fear: a payload with a bare \`amount: 1500\` and no version marker is ambiguous between 1,500 and 15.00 forever. **Version from day one**, even when there is only one version. It costs one field and it is the difference between a mechanical migration and an archaeological one.

## 8. Terminal states

Not everything can be replayed. Every item needs a way to end:

- **\`resolved\`** — replayed successfully, or verified as already applied.
- **\`discarded\`** — genuinely unprocessable, with a mandatory reason and actor. Retained (payload optionally stripped) as an audit record. Never \`DELETE\`.
- **\`resolved_manually\`** — the business state was corrected outside the pipeline, typically a manual journal entry. Record the journal reference on the row so a future auditor can follow the trail.

Discarding money-bearing messages without a compensating record is the one outcome this whole design exists to prevent. If an item carried an amount and is being discarded, the resolution note must reference where that amount ended up.

---

## Takeaways

1. Build replay before the incident. Command, admin action, permissions, audit — treat it as a feature.
2. Select by fingerprint group; dry run by default; require an explicit \`--execute\`.
3. Show tenant, count and monetary value in the dry run. That summary prevents bad replays.
4. Rate-limit, use a dedicated replay queue, lock rows with \`skip_locked\`, and dispatch \`on_commit\`.
5. Dead lettering breaks ordering. Prefer commutative handlers plus a version guard over per-entity sequencing.
6. Never mutate the raw payload. Store repairs as attributed, reasoned, additive patches, and restrict which fields may be repaired.
7. Version envelopes from day one and migrate forward with composable upcasters.
8. Every item reaches a terminal state. Discarding a money-bearing message requires a compensating record.

**Next:** [Part 7 — Reconciliation Is Different: Technical Failures vs Business Exceptions](/blog/dlq-reconciliation-business-exceptions).`,
  },
  {
    id: 24,
    slug: 'dlq-reconciliation-business-exceptions',
    title: 'Reconciliation Is Different: Technical Failures vs Business Exceptions',
    excerpt:
      'The most expensive mistake in dead letter queue design: filing an unmatched transaction as an engineering failure when it\'s actually a normal business result that needs a suspense account, not a bug fix.',
    category: 'infrastructure',
    readingTime: '11 min read',
    createdAt: '2026-07-17',
    tags: ['fintech', 'reconciliation', 'accounting', 'distributed-systems'],
    content: `*Hardening the Reconciliation Worker, Part 7 of 7*

---

Six parts of correct dead letter queue design will still let you build the wrong system, because reconciliation contains a category of failure that a DLQ is structurally unsuited to hold — and it looks exactly like the failures a DLQ is for.

## 1. The category error

Consider two messages arriving at your worker.

**Message A** has a truncated JSON body. It cannot be parsed. It will never be parseable. This is a **technical failure** — the message is unprocessable, the system cannot act, and it belongs in the dead letter queue.

**Message B** is perfectly well-formed. It says the provider settled KES 12,400 against reference \`NLJ7RT61SV\`. Your database has no invoice with that reference. Your matcher raises \`InvoiceNotFound\` and — because Part 1 told you to treat missing referenced entities as permanent failures — the message is dead-lettered.

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

\`\`\`
Dr  Bank / Provider Settlement    12,400
Cr  Suspense — Unmatched Receipts 12,400
\`\`\`

When it is later matched to invoice 8891:

\`\`\`
Dr  Suspense — Unmatched Receipts 12,400
Cr  Accounts Receivable            12,400
\`\`\`

Now the money is *on the balance sheet* from the moment it arrives. It is visible to finance, it is included in the trial balance, it is auditable, and the reconciliation backlog becomes a number a CFO can look at — the suspense account balance — rather than a row count in an engineering tool.

The engineering translation: the worker that cannot match a transaction should still **complete successfully**, having written an \`unmatched\` record and posted a suspense entry. It has done its job. It processed the message and produced the correct outcome for the information available. Nothing failed.

\`\`\`python
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
\`\`\`

## 4. Matching windows and the retry that isn't a retry

Unmatched transactions should be *re-matched*, not retried. The distinction is real: a retry re-executes the same message; a re-match runs the matcher again over accumulated state that has since changed.

Run a periodic sweep — every 15 minutes, then hourly, then daily as items age — that attempts to match everything in \`AWAITING_MATCH\`. Most timing-difference exceptions resolve on their own within one or two sweeps, because the counterparty record simply arrived late.

\`\`\`python
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
\`\`\`

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

1. **Conservation.** For each tenant and currency: \`sum(settled) == sum(applied to invoices) + sum(suspense) + sum(written off)\`. If this ever fails, something has been lost or created. It is the master check.
2. **No orphaned money.** Every dead letter whose payload carries an amount has a corresponding suspense entry or a documented discard with a compensating journal.
3. **No dead letter older than the matching window.** If one exists, it was misclassified — a business exception filed as a technical failure. This check is how you catch the category error of section 1 automatically.
4. **Idempotency holds.** \`count(distinct provider_ref) == count(ledger entries)\` per tenant.
5. **Suspense ages down.** The oldest item in suspense is younger than the matching window plus the escalation SLA. A suspense account that only grows is a reconciliation process that has quietly stopped working.

Invariant 3 is the one I would add first. It is a single query, and it converts the most expensive design mistake in this series into an automated alert.

## 7. Immutability and audit

Two rules, non-negotiable in financial reconciliation:

**Never mutate a posted ledger entry.** Corrections are new, offsetting entries — a reversal plus a corrected posting — carrying a reference to what they correct. A ledger you can \`UPDATE\` is a ledger you cannot audit, and replay makes this acute: a replayed message that mutates history changes the past, whereas one that appends a compensating entry leaves an accurate record of what the system knew and when.

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

*End of series. [Back to the index](/blog/hardening-the-reconciliation-worker).*`,
  },
]

export const categories = ['all', 'mobile', 'backend', 'infrastructure', 'career']

// Newest first. Sorted here (rather than relied on as insertion order) so
// Home's "recent posts" slice and the Blog grid stay correct regardless of
// where a new post gets added above.
export default [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
