// Content for the About page. Kept as data rather than JSX so the page
// stays a layout concern and the words stay editable without touching
// markup. `skills` is also read by Home's tech-stack row.

export const bio =
  'Backend and mobile engineer in Nairobi. I build systems that move money — Flutter apps at the front, Python services over PostgreSQL behind them, and the infrastructure they run on. Most of that work has been mobile money in East Africa, where a connection dropping mid-payment is routine and being approximately correct is not an option.'

export const bioSecondary =
  'I also write about it at length: retries, idempotency, reconciliation, and the failure modes that only surface under real traffic.'

/** What I actually do, grouped by layer. Ordered front-to-back. */
export const capabilities = [
  {
    area: 'Mobile',
    summary: 'Flutter apps people pay through.',
    detail:
      'Production Flutter with Riverpod — payment flows, offline and error states, and the unglamorous work of making a retry safe from the client side.',
    stack: ['Flutter', 'Dart', 'Riverpod', 'Firebase'],
    tone: 'accent',
  },
  {
    area: 'Backend',
    summary: 'APIs that stay correct under retries.',
    detail:
      'Django and FastAPI over PostgreSQL. Append-only ledgers, database-enforced idempotency, transactional outboxes, authenticated payment callbacks, JWT auth.',
    stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'REST APIs'],
    tone: 'green',
  },
  {
    area: 'Infrastructure',
    summary: 'The part that has to be awake at 03:00.',
    detail:
      'Containers, pipelines, and enough observability to answer "what happened to this payment?" — Docker and Kubernetes, Terraform, AWS, CI/CD, structured logging and metrics.',
    stack: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
    tone: 'blue',
  },
]

/**
 * How I work. Replaces four two-word slogans ("Ship fast / iterate
 * faster") that said nothing a reader couldn't have guessed.
 */
export const principles = [
  {
    label: 'Correctness before cleverness',
    body: 'Money is a Decimal, never a float. Ledgers append, never update. The boring choice is usually the one that survives an audit.',
  },
  {
    label: 'Make failure legible',
    body: 'Everything fails eventually. What matters is whether the failure tells you what happened — so I would rather ship a loud error than a silent fallback.',
  },
  {
    label: 'Write the reasoning down',
    body: 'A decision nobody wrote down gets re-litigated every six months. I document why something was built a particular way, not just what it does.',
  },
  {
    label: 'Own the whole path',
    body: 'I would rather understand everything from the tap in the app to the row in the ledger than be excellent at one layer and helpless at the next.',
  },
]

export const writingIntro =
  'Long-form engineering writing, mostly about the parts nobody demos: delivery semantics, retry budgets, dead letter queues, and what happens when a payment callback arrives twice.'

export const education = [
  {
    school: 'Kenya Methodist University',
    course: 'Computer Information Systems',
    location: 'Meru Main Campus',
    period: '2020 — 2024',
  },
]

export const organizations = [
  {
    name: 'Kamilimu Mentorship Organization',
    role: 'Mentee',
    location: 'Nairobi',
    period: '2022 — 2023',
    tags: ['Innovation', 'Personal Development', 'Professional Development'],
  },
  {
    name: 'Young Tech Kenya',
    role: 'President',
    location: 'Kenya Methodist University',
    period: '2022 — 2023',
    tags: ['Leadership', 'Tech Community', 'Mentorship'],
  },
]

export const skills = [
  { label: 'Flutter', group: 'mobile' },
  { label: 'Dart', group: 'mobile' },
  { label: 'Riverpod', group: 'mobile' },
  { label: 'Firebase', group: 'mobile' },
  { label: 'Python', group: 'backend' },
  { label: 'Django', group: 'backend' },
  { label: 'FastAPI', group: 'backend' },
  { label: 'PostgreSQL', group: 'backend' },
  { label: 'REST APIs', group: 'backend' },
  { label: 'Docker', group: 'infra' },
  { label: 'Kubernetes', group: 'infra' },
  { label: 'AWS', group: 'infra' },
  { label: 'Terraform', group: 'infra' },
  { label: 'CI/CD', group: 'infra' },
  { label: 'Linux', group: 'infra' },
]
