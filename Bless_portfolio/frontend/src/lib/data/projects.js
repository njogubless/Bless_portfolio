// Single project catalog for the whole site.
//
// The original codebase had two separate, drifting sources of truth for
// projects: `data/projects.js` (4 items, used on Home) and a second,
// larger hardcoded array inside `Work.jsx` (13 items across 3 groups).
// Updating a project meant editing it in two places, or it silently went
// stale in one of them. This file replaces both — `featured: true` marks
// the subset shown on the homepage, `group` drives the Work page filter.

const projects = [
  // ---- Mobile & Web ----
  {
    id: 'changa',
    name: 'Changa',
    group: 'mobile-web',
    period: 'Mar 2026 — May 2026',
    featured: true,
    tagline: 'Group fundraising for East Africa with real-time mobile money payments.',
    description:
      'Changa modernises group fundraising for East Africa. Built on Flutter and FastAPI, it lets communities create shared funding projects, monitor real-time contribution progress, and pay instantly via M-Pesa Daraja or Airtel Money APIs — the two dominant mobile money networks in the region. The backend is a production-ready async REST API with JWT authentication, role-based project membership, and a payment reconciliation system that handles asynchronous mobile money callbacks. The entire stack runs in Docker, with PostgreSQL for data persistence and pgAdmin for database management.',
    stack: ['Flutter', 'Dart', 'Riverpod', 'FastAPI', 'PostgreSQL', 'Docker', 'M-Pesa Daraja', 'Airtel Money API'],
    github: 'https://github.com/njogubless/changa',
    status: 'in-production',
  },
  {
    id: 'marketplace',
    name: 'TechVault Marketplace',
    group: 'mobile-web',
    period: 'Apr 2026 — May 2026',
    featured: true,
    tagline: 'Multi-vendor marketplace for tech products with JWT auth and a documented REST API.',
    description:
      'TechVault is a full-stack multi-vendor marketplace for tech products — laptops, software, audio gear, gaming hardware, and more. Built from scratch with a React frontend and a Django REST Framework backend, it features JWT-based authentication, a multi-category product catalog with filtering and search, vendor profiles with ratings and statistics, a persistent shopping cart, and a fully documented REST API. The frontend uses TanStack Query for intelligent data caching, while the backend uses PostgreSQL with optimized querysets to avoid N+1 performance issues.',
    stack: ['React', 'Django', 'PostgreSQL', 'TanStack Query', 'JWT'],
    github: 'https://github.com/njogubless/MarketPlace',
    status: 'in-production',
  },
  {
    id: 'reflections',
    name: 'Reflections on Faith',
    group: 'mobile-web',
    period: 'Jan 2025 — Mar 2025',
    featured: false,
    tagline: 'Mobile forum app with audio recording and in-chat Q&A.',
    description:
      'Mobile forum app featuring audio recording and in-chat Q&A interactions. Built with Flutter and Firebase for auth and storage, with a CI/CD pipeline for continuous deployment after production.',
    stack: ['Flutter', 'Dart', 'Firebase', 'CI/CD'],
    github: 'https://github.com/njogubless/Reflection_On_Faith',
    status: 'in-production',
  },
  {
    id: 'hikers-mobile',
    name: 'Hikers Afrique',
    group: 'mobile-web',
    period: 'Jan 2024 — Mar 2024',
    featured: true,
    tagline: 'Social hiking app for discovering and joining adventures across Africa.',
    description:
      'Cross-platform mobile app for joining, interacting with, and managing hiking adventures and social events. Real-time data sync, authentication and cloud storage via Firebase. State managed with Provider.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Provider'],
    github: 'https://github.com/njogubless/HikersAfrique',
    status: 'in-production',
  },
  {
    id: 'hikers-admin',
    name: 'Hikers Afrique Web Admin',
    group: 'mobile-web',
    period: 'Jan 2024 — Apr 2025',
    featured: false,
    tagline: 'Admin dashboard for overseeing events, users and transactions.',
    description:
      'Web admin panel for the Hikers Afrique mobile app. Enables administrators to oversee events, users and transactions. Built with Flutter Web and Firebase.',
    stack: ['Flutter Web', 'Dart', 'Firebase', 'Provider'],
    github: 'https://github.com/njogubless/webdashboard',
    status: 'in-production',
  },

  // ---- Backend ----
  {
    id: 'task-manager',
    name: 'Task Management System',
    group: 'backend',
    period: '2023',
    featured: false,
    tagline: 'Pure-Dart task manager demonstrating OOP and data-structure fundamentals.',
    description:
      'Task management system built in pure Dart to outline and manage workloads efficiently. Demonstrates a strong understanding of OOP, data structures and algorithms.',
    stack: ['Dart', 'OOP', 'DSA'],
    github: 'https://github.com/njogubless/taskmanagementsystem',
    status: 'shipped',
  },
  {
    id: 'giantbox',
    name: 'GiantBox Logistics API',
    group: 'backend',
    period: '2023 — 2024',
    featured: true,
    tagline: 'Logistics backend managing the full delivery pipeline end-to-end.',
    description:
      'GiantBox is a logistics backend API that manages the complete delivery pipeline: partners register and manage shipments, customers track packages in real time, payments are processed securely, and deliveries are rated on completion.',
    stack: ['Python', 'Django', 'PostgreSQL', 'JWT'],
    github: 'https://github.com/njogubless/giantbox_api',
    status: 'private',
  },
  {
    id: 'report-devops',
    name: 'Report Management — DevOps',
    group: 'backend',
    period: '2023 — 2024',
    featured: false,
    tagline: 'End-to-end DevOps infrastructure for a Django report management system.',
    description:
      'End-to-end DevOps infrastructure for a Django-based report management system. Terraform provisions cloud resources, Ansible configures servers idempotently, Docker containerises the app, and Kubernetes orchestrates it at scale. Every push to main triggers a Travis CI pipeline that builds, tests, and deploys automatically — with Prometheus monitoring and an Nginx reverse proxy completing the stack.',
    stack: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Nginx', 'Terraform', 'Prometheus', 'Grafana'],
    github: 'https://github.com/njogubless/Report_Management-_System',
    status: 'in-production',
  },

  // ---- Infrastructure ----
  {
    id: 'ndovu-infra',
    name: 'Backend Report System — Infra',
    group: 'infrastructure',
    period: '2023 — 2024',
    featured: false,
    tagline: 'Full-stack deployment automation with Terraform, Docker, K8s and Ansible.',
    description:
      'A full-stack deployment and infrastructure automation project built with Terraform, Docker, Kubernetes (Minikube), Ansible, and CI/CD via Travis CI. Covers container orchestration, configuration management, cloud provisioning, reverse-proxy setup with Nginx, and system monitoring with Prometheus.',
    stack: ['Docker', 'Docker Compose', 'Nginx', 'DigitalOcean', 'PostgreSQL'],
    github: 'https://github.com/njogubless/Ndovu-Cloud-Tasks-',
    status: 'shipped',
  },
  {
    id: 'oss-music',
    name: 'Open Source Music Platform',
    group: 'infrastructure',
    period: '2025 — present',
    featured: true,
    tagline: 'Open-source Django backend powering a music-sharing platform.',
    description:
      'Open-source Django backend powering a music sharing platform. Built with DRF, it exposes a clean REST API for track uploads, artist profiles, user authentication via JWT, and content discovery.',
    stack: ['Django', 'DRF', 'Docker', 'DigitalOcean'],
    github: 'https://github.com/njogubless/OSS_music_platform',
    status: 'shipped',
  },
]

export const groups = [
  { id: 'all', label: 'All work' },
  { id: 'mobile-web', label: 'Mobile & Web' },
  { id: 'backend', label: 'Backend' },
  { id: 'infrastructure', label: 'Infrastructure' },
]

export const featuredProjects = projects.filter((p) => p.featured)

export default projects
