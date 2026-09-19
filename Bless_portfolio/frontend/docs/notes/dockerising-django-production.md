---
slug: dockerising-django-production
title: "Dockerising a Django app for production — the right way"
excerpt: >-
  Most Docker tutorials stop at "it runs locally." Here's how I actually ship
  Django to production with Docker Compose, Nginx, and CI/CD.
category: backend
date: 2026-02-18
tags: [django, docker, devops, nginx, ci-cd]
---
# Dockerising a Django app for production — the right way

## Why most Docker setups break in production

A `Dockerfile` that works on your laptop often fails in prod because of missing environment variables, wrong user permissions, or a dev server (runserver) masquerading as production.

## The stack

- **Gunicorn** as the WSGI server
- **Nginx** as reverse proxy + static file server
- **Docker Compose** to wire it together
- **GitHub Actions** for CI/CD

## The Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Nginx config

Nginx handles SSL termination and serves `/static/` directly — keeping Gunicorn free for actual requests.

## CI/CD

On every push to `main`, GitHub Actions runs tests, builds the image, pushes to a registry, and deploys. Zero-downtime via `docker compose up -d --no-deps app`.

## Key lessons

1. Never use `runserver` in production.
2. Always set `DEBUG=False` via environment variables, not hardcoded.
3. Collect static files at build time, not runtime.
