// src/data/projects.js
// Featured projects shown on the HOME page — just a curated highlight reel.
// Full project list lives in Work.jsx (already static).
// Shape matches what ProjectCard expects:
// { id, name, tech, description, github_url, color, icon }

const projects = [
  {
    id: 1,
    name: 'CHANGA',
    tech: 'Flutter · FastAPI · M-Pesa',
    description: 'Group fundraising app for East Africa with real-time mobile money payments.',
    github_url: 'https://github.com/njogubless/changa',
    color: 'purple',
    icon: '💸',
  },
  {
    id: 2,
    name: 'MarketPlace',
    tech: 'React · Django · PostgreSQL',
    description: 'Multi-vendor marketplace for tech products with JWT auth and a documented REST API.',
    github_url: 'https://github.com/njogubless/MarketPlace',
    color: 'green',
    icon: '🛒',
  },
  {
    id: 3,
    name: 'Hikers Afrique',
    tech: 'Flutter · Firebase',
    description: 'Social hiking app for discovering and joining adventures across Africa.',
    github_url: 'https://github.com/njogubless/HikersAfrique',
    color: 'amber',
    icon: '🏔️',
  },
  {
    id: 4,
    name: 'DevOps Infra',
    tech: 'Docker · K8s · Terraform',
    description: 'End-to-end deployment pipeline with Terraform, Ansible, Kubernetes and Prometheus.',
    github_url: 'https://github.com/njogubless/Report_Management-_System',
    color: 'indigo',
    icon: '⚙️',
  },
]

export default projects