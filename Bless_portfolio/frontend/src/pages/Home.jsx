import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import profile from '../lib/data/profile'
import { skills } from '../lib/data/about'
import { featuredProjects } from '../lib/data/projects'
import experience from '../lib/data/experience'
import posts from '../lib/data/posts'
import { formatDate } from '../lib/utils'
import styles from './Home.module.css'

const stats = [
  { value: `${experience.length}+`, label: 'Roles shipped in production' },
  { value: '13', label: 'Public + private projects' },
  { value: '2', label: 'Continents worked with (KE + remote)' },
]

export default function Home() {
  return (
    <>
      <SEO
        path="/"
        title="Flutter & Python Developer"
        description="Paul Njogu is a full-stack developer in Nairobi, Kenya building mobile apps, REST APIs, and cloud infrastructure that ships to production."
      />

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <div className={styles.heroText}>
            {profile.available && (
              <span className={styles.badge}>
                <span className={styles.badgeDot} aria-hidden="true" />
                Open to work — {profile.locationShort}
              </span>
            )}

            <h1 className={styles.heroTitle}>
              I build software
              <br />
              that <em className={styles.heroEmphasis}>ships</em>.
            </h1>

            <p className={styles.heroLead}>{profile.tagline}</p>
            <p className={styles.heroSub}>
              Full-stack engineer based in {profile.location}, working across Flutter mobile apps, Django/FastAPI
              backends, and the cloud infrastructure that runs them.
            </p>

            <div className={styles.heroActions}>
              <Button as={Link} to="/work">View my work</Button>
              <Button variant="secondary" href={profile.resumeUrl}>Download résumé</Button>
            </div>
          </div>

          <dl className={styles.statList} aria-label="Quick facts">
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statValue}>{s.value}</dt>
                <dd className={styles.statLabel}>{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---- Tech stack ---- */}
      <section aria-label="Technical skills">
        <Container>
          <Reveal className={styles.skillsRow}>
            <span className={styles.skillsLabel}>Working with</span>
            <ul className={styles.skillsList}>
              {skills.map((s) => (
                <li key={s.label}>
                  <Badge tone={s.group === 'mobile' ? 'accent' : s.group === 'backend' ? 'green' : 'blue'}>
                    {s.label}
                  </Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ---- Featured work ---- */}
      <section className={styles.section}>
        <Container>
          <Reveal>
            <SectionHeading
              index={1}
              eyebrow="Selected work"
              title="Projects that made it to production"
              description="A mix of consumer mobile apps, backend platforms, and infrastructure — each one shipped, not just prototyped."
            />
          </Reveal>

          <div className={styles.projectGrid}>
            {featuredProjects.map((project, i) => (
              <Reveal as="article" key={project.id} delay={i * 60} className={styles.projectCard}>
                <div className={styles.projectHead}>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                      aria-label={`View ${project.name} on GitHub`}
                    >
                      ↗
                    </a>
                  )}
                </div>
                <p className={styles.projectTagline}>{project.tagline}</p>
                <ul className={styles.projectStack}>
                  {project.stack.slice(0, 4).map((s) => (
                    <li key={s}><Badge>{s}</Badge></li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className={styles.moreLink}>
            <Button as={Link} to="/work" variant="ghost">See all projects &amp; experience →</Button>
          </div>
        </Container>
      </section>

      {/* ---- Latest writing ---- */}
      <section className={styles.section}>
        <Container>
          <Reveal>
            <SectionHeading index={2} eyebrow="From the blog" title="Recent notes" />
          </Reveal>
          <div className={styles.postList}>
            {posts.slice(0, 3).map((post, i) => (
              <Reveal as="div" key={post.slug} delay={i * 60}>
                <Link to={`/blog/${post.slug}`} className={styles.postRow}>
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postArrow} aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- CTA ---- */}
      <section className={styles.cta}>
        <Container className={styles.ctaInner}>
          <Reveal>
            <h2 className={styles.ctaTitle}>Have a project in mind?</h2>
            <p className={styles.ctaLead}>
              Available for freelance work, full-time roles, and collaborations. I usually reply within 24 hours.
            </p>
            <Button as={Link} to="/contact">Get in touch</Button>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
