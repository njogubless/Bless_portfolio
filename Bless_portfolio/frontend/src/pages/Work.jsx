import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { cx } from '../lib/utils'
import experience from '../lib/data/experience'
import projects, { groups } from '../lib/data/projects'
import styles from './Work.module.css'

// job.accent comes from the data file as 'amber' | 'purple' | 'green'.
// The design system only ships accent/blue/green tokens, so amber maps
// to the warm accent color and purple maps to blue (our one "cool"
// accent) rather than inventing two more color tokens for a single use.
const ACCENT_TONE = { amber: 'accent', purple: 'blue', green: 'green' }

function ExperienceEntry({ job }) {
  const [expanded, setExpanded] = useState(false)
  const tone = ACCENT_TONE[job.accent] || 'accent'

  return (
    <Card as="article" accent={tone} className={styles.expCard}>
      <button
        type="button"
        className={styles.expToggle}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={styles.expHead}>
          <div>
            <h3 className={styles.expCompany}>{job.company}</h3>
            <div className={styles.expRole}>{job.role} · {job.type}</div>
          </div>
          <div className={styles.expMeta}>
            <Badge tone={tone}>
              {job.period}
            </Badge>
            <span className={styles.expLocation}>{job.location}</span>
          </div>
        </div>
        <p className={styles.expSummary}>{job.summary}</p>
        <span className={styles.expDisclosure}>{expanded ? '− hide achievements' : '+ show achievements'}</span>
      </button>

      {expanded && (
        <div className={styles.expBody}>
          <ul className={styles.achievementList}>
            {job.achievements.map((a) => (
              <li key={a} className={styles.achievementItem}>
                <span className={styles.achievementMark} aria-hidden="true">→</span>
                {a}
              </li>
            ))}
          </ul>
          <ul className={styles.expStack}>
            {job.stack.map((s) => (
              <li key={s}><Badge>{s}</Badge></li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

function ProjectEntry({ project }) {
  return (
    <Card as="article" interactive className={styles.projectCard}>
      <div className={styles.projectHead}>
        <div>
          <h3 className={styles.projectName}>{project.name}</h3>
          <div className={styles.projectPeriod}>{project.period}</div>
        </div>
        <span className={cx(styles.status, project.status === 'private' && styles.statusPrivate)}>
          {project.status === 'private' ? 'private repo' : '✓ shipped'}
        </span>
      </div>
      <p className={styles.projectDesc}>{project.description}</p>
      <ul className={styles.projectStack}>
        {project.stack.map((s) => (
          <li key={s}><Badge>{s}</Badge></li>
        ))}
      </ul>
      <div className={styles.projectLinks}>
        {project.github ? (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
            View on GitHub ↗
          </a>
        ) : (
          <span className={styles.projectPrivateNote}>Codebase is private</span>
        )}
        {project.writeup && (
          <Link to={`/blog/${project.writeup.slug}`} className={styles.projectLink}>
            {project.writeup.label} →
          </Link>
        )}
      </div>
    </Card>
  )
}

export default function Work() {
  const [activeGroup, setActiveGroup] = useState('all')

  const filtered = useMemo(
    () => (activeGroup === 'all' ? projects : projects.filter((p) => p.group === activeGroup)),
    [activeGroup]
  )

  return (
    <>
      <SEO
        path="/work"
        title="Work"
        description="Experience and projects — real roles at real companies, and code that lives in production."
      />

      <Container as="section" className={styles.intro}>
        <Reveal>
          <span className={styles.eyebrow}>ls -la work/</span>
          <h1 className={styles.title}>Experience &amp; <em className={styles.emphasis}>projects.</em></h1>
          <p className={styles.lead}>Real work at real companies. Projects that ship. Code that lives in production.</p>
        </Reveal>
      </Container>

      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={1} eyebrow="Career" title="Experience" />
        </Reveal>
        <div className={styles.expList}>
          {experience.map((job) => (
            <ExperienceEntry key={job.id} job={job} />
          ))}
        </div>
      </Container>

      <Container as="section" className={styles.blockLast}>
        <Reveal>
          <SectionHeading index={2} eyebrow="Portfolio" title="Projects" />
        </Reveal>

        <div className={styles.filters} role="group" aria-label="Filter projects by category">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={cx(styles.filterChip, activeGroup === g.id && styles.filterChipActive)}
              onClick={() => setActiveGroup(g.id)}
              aria-pressed={activeGroup === g.id}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className={styles.projectGrid}>
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i, 6) * 40}>
              <ProjectEntry project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  )
}
