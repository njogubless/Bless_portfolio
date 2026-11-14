// Work history — content preserved verbatim from the original site,
// restructured into one predictable shape per entry.

const experience = [
  {
    id: 'ikoo',
    company: 'IK-OO Properties',
    role: 'Consultant',
    type: 'Contract',
    period: 'Oct 2026 — present',
    location: 'Remote',
    accent: 'green',
    summary:
      'Brought a property client\'s Flutter app from a risky codebase to a signed, production-ready release, and handed it over with documentation their team can build on.',
    achievements: [
      'Removed embedded credentials from the app and introduced encrypted session storage, closing the main security risks before public release.',
      'Re-architected the codebase into a modular, feature-based structure, shortening feature delivery for future developers.',
      'Took static analysis from 99 warnings to zero, and added 92 automated tests with a CI pipeline that blocks faulty changes before release.',
      'Cut image memory use by roughly 95% per image by loading photos at display size, smoothing scrolling and reducing crashes on low-end devices.',
      'Diagnosed a backend response bottleneck (19 MB per app launch) and delivered a fix plan cutting it to about 30 KB, with load times dropping from up to 60 seconds to under 1 second.',
      'Removed about 10,000 lines of unused code and dependencies, lowering maintenance cost and build size.',
      'Delivered a signed, device-tested release build with a production-readiness report and handover documentation.',
    ],
    stack: ['Flutter', 'Dart', 'Secure Storage', 'CI/CD', 'Automated Testing', 'Static Analysis'],
  },
  {
    id: 'salamander',
    company: 'Salamander Tech-Hub',
    role: 'Lead Backend Developer',
    type: 'Open-source contribution',
    period: '2026 — present',
    location: 'Remote',
    accent: 'amber',
    summary:
      'Leading backend architecture and technical decisions for a multi-client platform serving web and mobile apps.',
    achievements: [
      'Owned PostgreSQL schema design, migrations, API contracts, and data integrity.',
      'Built scalable backend services using Python, Django, FastAPI, and REST APIs.',
      'Managed Supabase authentication, RPCs, RLS policies, and Edge Functions.',
      'Established engineering workflows for schema changes, PR approvals, and backend governance.',
      'Deployed and maintained infrastructure using Docker, AWS, Terraform, Kubernetes and Ansible.',
      'Coordinated with frontend/mobile teams to ensure reliable integrations.',
    ],
    stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'Supabase', 'AWS', 'Terraform', 'Kubernetes', 'Ansible'],
  },
  {
    id: 'reduzer',
    company: 'Reduzer Technologies',
    role: 'Mid-Level Flutter Developer',
    type: 'Contract',
    period: '2025',
    location: 'Remote',
    accent: 'purple',
    summary:
      'Joined as a Flutter contractor to overhaul the codebase, build a robust backend, and ship a production-ready mobile product.',
    achievements: [
      'Analyzed and refactored the existing codebase to meet quality software standards.',
      'Built database schemas in BigQuery to reference data sent to the backend.',
      'Developed a RESTful API using Python and Django for the company backend system.',
      'Implemented authentication and authorization using Django + JWT.',
      'Integrated PostgreSQL with optimized SQL queries for database management.',
      'Containerized Django services with Docker and Docker Compose.',
      'Deployed on DigitalOcean with CI/CD via Travis CI — achieving faster release cycles.',
      'Built user-centred UI focused on a great user experience.',
    ],
    stack: ['Flutter', 'Dart', 'Python', 'Django', 'PostgreSQL', 'Docker', 'BigQuery', 'JWT', 'Travis CI', 'DigitalOcean'],
  },
  {
    id: 'ndovu',
    company: 'Ndovu Cloud',
    role: 'Backend Engineer',
    type: 'Full-time',
    period: 'May 2023 — Sep 2023',
    location: 'Nairobi',
    accent: 'green',
    summary:
      'Backend engineering role focused on building scalable cloud infrastructure and APIs for the Ndovu Cloud platform.',
    achievements: [
      'Designed and built scalable REST APIs consumed by mobile and web clients.',
      'Managed cloud infrastructure and deployment pipelines.',
      'Collaborated with the frontend team to define API contracts.',
      'Maintained and improved existing backend services.',
    ],
    stack: ['Python', 'Django', 'REST APIs', 'Cloud Infrastructure', 'PostgreSQL'],
  },
]

export default experience
