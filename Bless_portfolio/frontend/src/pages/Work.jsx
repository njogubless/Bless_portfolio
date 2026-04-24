import { useState, useEffect } from 'react'

const experience = [
  {
    id: 'reduzer',
    company: 'Reduzer Technologies',
    role: 'Mid-Level Flutter Developer',
    type: 'Contract',
    period: '2023 — 2024',
    location: 'Remote',
    color: 'purple',
    summary: 'Joined as a Flutter contractor to overhaul the codebase, build a robust backend, and ship a production-ready mobile product.',
    achievements: [
      'Analyzed and refactored existing codebase to meet quality software standards',
      'Built database schemas in BigQuery to reference data sent to the backend',
      'Developed RESTful API using Python and Django for the company backend system',
      'Implemented authentication and authorization using Django JWT',
      'Integrated PostgreSQL with optimized SQL queries for database management',
      'Containerized Django services with Docker and Docker Compose',
      'Deployed on Digital Ocean with CI/CD via Travis CI — achieving faster release cycles',
      'Built user-centred UI focused on great user experience',
    ],
    stack: ['Flutter', 'Dart', 'Python', 'Django', 'PostgreSQL', 'Docker', 'BigQuery', 'JWT', 'Travis CI', 'Digital Ocean'],
  },
  {
    id: 'ndovu',
    company: 'Ndovu Cloud',
    role: 'Backend Engineer',
    type: 'Full-time',
    period: 'May 2023 — September 2023',
    location: 'Nairobi',
    color: 'green',
    summary: 'Backend engineering role focused on building scalable cloud infrastructure and APIs for the Ndovu Cloud platform.',
    achievements: [
      'Designed and built scalable REST APIs consumed by mobile and web clients',
      'Managed cloud infrastructure and deployment pipelines',
      'Collaborated with frontend team to define API contracts',
      'Maintained and improved existing backend services',
    ],
    stack: ['Python', 'Django', 'REST APIs', 'Cloud Infrastructure', 'PostgreSQL'],
  },
]

const projectGroups = [
  {
    id: 'mobile',
    label: 'Mobile',
    icon: '[mob]',
    color: 'purple',
    description: 'Cross-platform mobile applications built with Flutter and Dart',
    projects: [
      {
        name: 'CHANGA',
        period: 'March 2026 — May 2026',
        desc: `Changa modernises group fundraising for East Africa. Built on Flutter and FastAPI, it lets communities create shared funding projects, monitor real-time contribution progress, and pay instantly via M-Pesa Daraja or Airtel Money APIs — the two dominant mobile money networks in the region.
               The backend is a production-ready async REST API with JWT authentication, role-based project membership, and a payment reconciliation system that handles asynchronous mobile money callbacks. The entire stack runs in Docker, with PostgreSQL for data persistence and pgAdmin for database management.
        Stack: Flutter 3 · Dart · Riverpod · FastAPI · PostgreSQL · Docker · M-Pesa Daraja · Airtel Money API`,
        stack: ['Flutter', 'Dart', 'CI/CD', 'FastAPI-python', 'Docker'],
        github: 'https://github.com/njogubless/changa',
        playstore: null,
        status: 'in production',
      },
      {
        name: 'Market_Place App Web',
        period: 'April 2026 — May 2026',
        desc: `TechVault is a full-stack multi-vendor marketplace for tech products — laptops, software, audio gear, gaming hardware, and more.
         Built from scratch with a React frontend and a Django REST Framework backend, it features JWT-based authentication, a multi-category product catalog with filtering and search, vendor profiles with ratings and statistics, a persistent shopping cart, and a fully documented REST API.
         The frontend uses TanStack Query for intelligent data caching and stale/fresh lifecycle management, while the backend uses PostgreSQL with optimized querysets to avoid N+1 performance issues.`,
        stack: ['Django', 'React', 'PostgreSQL', 'Tanstack-query'],
        github: 'https://github.com/njogubless/MarketPlace',
        playstore: null,
        status: 'in-production',
      },
      {
        name: 'Reflections on Faith',
        period: 'Jan 2025 — Mar 2025',
        desc: 'Mobile forum app featuring audio recording and in-chat Q&A interactions. Built with Flutter and Firebase for auth and storage. CI/CD pipeline for continuous deployment after production.',
        stack: ['Flutter', 'Dart', 'Firebase', 'CI/CD'],
        github: 'https://github.com/njogubless/PROJECT',
        playstore: null,
        status: 'in-production',
      },
      {
        name: 'Hikers Afrique',
        period: 'Jan 2024 — Mar 2024',
        desc: 'Cross-platform mobile app for joining, interacting, and managing hiking adventures and social events. Real-time data sync, authentication and cloud storage via Firebase. State managed with Providers.',
        stack: ['Flutter', 'Dart', 'Firebase', 'Providers'],
        github: 'https://github.com/njogubless/HikersAfrique',
        playstore: null,
        status: 'in-production',
      },

      {
        name: 'Hikers Afrique Web Admin',
        period: 'Jan 2024 — Apr 2025',
        desc: 'Web admin panel for the Hikers Afrique mobile app. Enables administrators to oversee events, users and transactions. Built with Flutter Web and Firebase.',
        stack: ['Flutter Web', 'Dart', 'Firebase', 'Providers'],
        github: 'https://github.com/njogubless/webdashboard',
        playstore: null,
        status: 'in-production',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '[api]',
    color: 'green',
    description: 'APIs, databases and server-side systems',
    projects: [
      {
        name: 'Task Management System',
        period: '2023',
        desc: 'Task management system built in pure Dart to outline and manage workloads efficiently. Demonstrates strong understanding of OOP, data structures and algorithms.',
        stack: ['Dart', 'OOP', 'DSA'],
        github: 'https://github.com/njogubless/taskmanagementsystem',
        playstore: null,
        status: 'shipped',
      },
      {
        name: 'Logistics Platform Backend',
        period: '2023 — 2024',
        desc: 'GiantBox is a logistics backend API that manages the complete delivery pipeline: partners register and manage shipments, customers track packages in real time, payments are processed securely, and deliveries are rated on completion.',
        stack: ['Python', 'Django', 'PostgreSQL', 'JWT'],
        github: 'https://github.com/njogubless/giantbox_api',
        playstore: null,
        status: 'private',
      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: '[infra]',
    color: 'amber',
    description: 'DevOps, cloud deployments and CI/CD pipelines',
    projects: [
      {
        name: 'Backend Report System',
        period: '2023 — 2024',
        desc: 'A full-stack deployment and infrastructure automation project built with Terraform, Docker, Kubernetes (Minikube), Ansible, and CI/CD via Travis CI. Covers container orchestration, configuration management, cloud provisioning, reverse proxy setup with Nginx, and system monitoring with Prometheus.',
        stack: ['Docker', 'Docker Compose', 'Nginx', 'Digital Ocean', 'PostgreSQL'],
        github: 'https://github.com/njogubless/Ndovu-Cloud-Tasks-',
        playstore: null,
        status: 'shipped',
      },
      {
        name: 'Open Source Music Platform',
        period: '2025 — present',
        desc: 'Open-source Django backend powering a music sharing platform. Built with DRF, it exposes a clean REST API for track uploads, artist profiles, user authentication via JWT, and content discovery.',
        stack: ['Django', 'DRF', 'Docker', 'Digital Ocean'],
        github: 'https://github.com/njogubless/OSS_music_platform',
        playstore: null,
        status: 'shipped',
      },
    ],
  },
]

const colors = {
  purple: {
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    text: '#c4b5fd',
    dot: '#a78bfa',
  },
  green: {
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
    text: '#6ee7b7',
    dot: '#34d399',
  },
  amber: {
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.18)',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
}

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '1.5rem',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Chip({ label, color = 'purple' }) {
  const c = colors[color] || colors.purple
  return (
    <span style={{
      fontFamily: 'JetBrains Mono', fontSize: '10px',
      padding: '3px 10px', borderRadius: '6px',
      background: c.bg, border: '1px solid ' + c.border,
      color: c.text,
    }}>
      {label}
    </span>
  )
}

function StatusBadge({ status }) {
  const isPrivate = status === 'private'
  return (
    <span style={{
      fontFamily: 'JetBrains Mono', fontSize: '9px',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: '999px',
      background: isPrivate ? 'rgba(251,191,36,0.08)' : 'rgba(52,211,153,0.08)',
      border: '1px solid ' + (isPrivate ? 'rgba(251,191,36,0.2)' : 'rgba(52,211,153,0.2)'),
      color: isPrivate ? '#fbbf24' : '#34d399',
    }}>
      {isPrivate ? 'private repo' : '✓ shipped'}
    </span>
  )
}

function ExperienceCard({ job }) {
  const [expanded, setExpanded] = useState(false)
  const c = colors[job.color]

  return (
    <GlassCard style={{ borderLeft: '2px solid ' + c.dot, borderRadius: '0 14px 14px 0' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px',
        }}>
          <div>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '18px', fontWeight: 700, color: '#e2dff5', marginBottom: '4px' }}>
              {job.company}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: c.text }}>
              {job.role} · {job.type}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: '10px',
              color: c.text, background: c.bg,
              border: '1px solid ' + c.border,
              padding: '3px 10px', borderRadius: '999px',
            }}>
              {job.period}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)' }}>
              {job.location}
            </span>
          </div>
        </div>

        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.5)', lineHeight: 1.8, marginBottom: '10px' }}>
          {job.summary}
        </p>

        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: c.text, letterSpacing: '0.08em' }}>
          {expanded ? '▲ collapse' : '▼ show achievements'}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: 'rgba(226,223,245,0.25)', letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>
            // key achievements
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {job.achievements.map((a, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: c.dot, fontFamily: 'JetBrains Mono', fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>
                  {'->'}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.6)', lineHeight: 1.7 }}>
                  {a}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {job.stack.map(s => <Chip key={s} label={s} color={job.color} />)}
          </div>
        </div>
      )}
    </GlassCard>
  )
}

function ProjectCard({ project, color }) {
  const [hovered, setHovered] = useState(false)
  const c = colors[color] || colors.purple

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.bg : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid ' + (hovered ? c.border : 'rgba(255,255,255,0.07)'),
        borderRadius: '12px', padding: '1.25rem',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '15px', fontWeight: 700, color: '#e2dff5', marginBottom: '4px' }}>
            {project.name}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)' }}>
            {project.period}
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.5)', lineHeight: 1.8, marginBottom: '12px' }}>
        {project.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {project.stack.map(s => <Chip key={s} label={s} color={color} />)}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: '10px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '6px 14px', borderRadius: '6px',
              background: c.bg, border: '1px solid ' + c.border,
              color: c.text, textDecoration: 'none',
            }}
          >
            ./github
          </a>
        )}
        {!project.github && !project.playstore && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.2)' }}>
            private codebase
          </span>
        )}
      </div>
    </div>
  )
}

const sidebar = [
  { id: 'experience', label: 'Experience', icon: '[work]' },
  { id: 'mobile', label: 'Mobile', icon: '[mob]' },
  { id: 'backend', label: 'Backend', icon: '[api]' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '[infra]' },
]

function Work() {
  const [activeSection, setActiveSection] = useState('experience')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const activeGroup = projectGroups.find(g => g.id === activeSection)

  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: isMobile ? '2rem 1.25rem' : '3rem 2rem',
      maxWidth: '1100px', margin: '0 auto',
    }}>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: '#34d399', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#34d399' }} />
          ls -la work/
        </div>

        <h1 style={{
          fontFamily: 'Bricolage Grotesque',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#e2dff5',
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
        }}>
          Experience &amp;<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(167,139,250,0.7)' }}>
            Projects.
          </span>
        </h1>

        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.45)', lineHeight: 1.9, maxWidth: '520px',
        }}>
          <span style={{ color: '#a78bfa' }}>// </span>
          Real work at real companies. Projects that ship.
          Code that lives in production.
        </p>
      </div>

      {/* Two-panel layout — stacks on mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
        gap: isMobile ? '1rem' : '2rem',
        alignItems: 'start',
      }}>

        {/* Sidebar — horizontal scrollable on mobile, sticky on desktop */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '0.75rem',
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 'auto' : '2rem',
        }}>
          {/* Terminal dots — hide on mobile to save space */}
          {!isMobile && (
            <div style={{
              display: 'flex', gap: '5px', marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              ))}
            </div>
          )}

          {!isMobile && (
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: '9px',
              color: 'rgba(226,223,245,0.2)', letterSpacing: '0.15em',
              marginBottom: '8px', paddingLeft: '4px',
            }}>
              // navigate
            </div>
          )}

          {/* Nav buttons — row on mobile, column on desktop */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? '6px' : '2px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}>
            {sidebar.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: isMobile ? '10px' : '11px',
                  padding: isMobile ? '6px 10px' : '9px 12px',
                  borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                  background: activeSection === item.id ? 'rgba(167,139,250,0.15)' : 'transparent',
                  color: activeSection === item.id ? '#c4b5fd' : 'rgba(226,223,245,0.4)',
                  borderLeft: isMobile ? 'none' : ('2px solid ' + (activeSection === item.id ? '#a78bfa' : 'transparent')),
                  borderBottom: isMobile ? ('2px solid ' + (activeSection === item.id ? '#a78bfa' : 'transparent')) : 'none',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '11px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div>
          {activeSection === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '10px',
                color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                <span style={{ color: '#a78bfa' }}>//</span> work_experience
              </div>
              {experience.map(job => (
                <ExperienceCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {activeGroup && (
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '10px',
                color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                <span style={{ color: '#a78bfa' }}>//</span> {activeGroup.id}_projects
              </div>

              <p style={{
                fontFamily: 'JetBrains Mono', fontSize: '11px',
                color: 'rgba(226,223,245,0.4)', marginBottom: '1.5rem', lineHeight: 1.8,
              }}>
                {activeGroup.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeGroup.projects.map((project, i) => (
                  <ProjectCard key={i} project={project} color={activeGroup.color} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Work