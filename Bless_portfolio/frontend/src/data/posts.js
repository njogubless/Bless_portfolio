// src/data/posts.js
// Static blog posts — replaces the Django API at /api/blog/
// Shape matches Blog.jsx and BlogPost.jsx expectations.

const posts = [
  {
    id: 1,
    slug: 'flutter-state-management-riverpod',
    title: 'Why I switched to Riverpod for Flutter state management',
    excerpt: 'After wrestling with Provider and Bloc, Riverpod clicked. Here\'s what changed and why I haven\'t looked back.',
    category: 'mobile',
    reading_time: '5 min read',
    created_at: '2026-03-10T08:00:00Z',
    tags_list: ['flutter', 'riverpod', 'dart', 'state-management'],
    content: `
## The problem with Provider

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

If you're starting a new Flutter project, start with Riverpod. The learning curve is real but short, and the payoff in maintainability is worth it.
    `,
  },
  {
    id: 2,
    slug: 'dockerising-django-production',
    title: 'Dockerising a Django app for production — the right way',
    excerpt: 'Most Docker tutorials stop at "it runs locally." Here\'s how I actually ship Django to production with Docker Compose, Nginx, and CI/CD.',
    category: 'backend',
    reading_time: '8 min read',
    created_at: '2026-02-18T08:00:00Z',
    tags_list: ['django', 'docker', 'devops', 'nginx', 'ci-cd'],
    content: `
## Why most Docker setups break in production

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

On every push to \`main\`, GitHub Actions runs tests, builds the image, pushes to Docker Hub, and SSH-deploys to the server. Zero-downtime via \`docker compose up -d --no-deps app\`.

## Key lessons

1. Never use \`runserver\` in production
2. Always set \`DEBUG=False\` via environment variables, not hardcoded
3. Collect static files at build time, not runtime
    `,
  },
  {
    id: 3,
    slug: 'kubernetes-for-solo-devs',
    title: 'Kubernetes is worth learning even if you\'re a solo developer',
    excerpt: 'You don\'t need a team of 50 to benefit from K8s. Here\'s how I use Minikube locally and why it made me a better engineer.',
    category: 'infrastructure',
    reading_time: '6 min read',
    created_at: '2026-01-22T08:00:00Z',
    tags_list: ['kubernetes', 'devops', 'docker', 'infrastructure'],
    content: `
## The "you don't need K8s" argument

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

1. Install Minikube locally
2. Deploy a simple app with \`kubectl apply -f deployment.yaml\`
3. Break things intentionally and watch K8s self-heal

The docs are dense but the \`kubectl explain\` command is your best friend.
    `,
  },
  {
    id: 4,
    slug: 'building-in-kenya',
    title: 'Building software products in Kenya — what nobody tells you',
    excerpt: 'Payments, connectivity, hiring, and the unique constraints of shipping products for East African users. A developer\'s honest take.',
    category: 'career',
    reading_time: '7 min read',
    created_at: '2025-12-05T08:00:00Z',
    tags_list: ['kenya', 'africa', 'mpesa', 'career', 'product'],
    content: `
## The payment layer is different

M-Pesa is not a nice-to-have in Kenya — it's the default. Integrating Daraja (Safaricom's API) is your first real task on any consumer product. STK push, C2B, B2C — learn them all.

## Network assumptions will hurt you

Don't assume 4G. Test on 3G and even 2G edge cases. Lazy loading, small payloads, and offline-first design aren't optional — they're how you keep users.

## The talent is here

Contrary to what some think, Kenya has serious engineering talent. Nairobi's tech scene is real and growing. The challenge is retention, not availability.

## What I've learned

- Build for the constraints of your actual users, not the users you imagine
- M-Pesa callbacks are asynchronous — design for that from day one
- Local community (communities like Nairobi Dev) is underrated for growth

## Final thought

Building in Kenya is hard in specific ways and exciting in specific ways. The problems are real, the market is young, and the opportunity is genuine.
    `,
  },
]

export default posts