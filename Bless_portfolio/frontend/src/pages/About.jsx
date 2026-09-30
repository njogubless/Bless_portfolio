import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import {
  bio,
  bioSecondary,
  capabilities,
  principles,
  writingIntro,
  education,
  organizations,
} from '../lib/data/about'
import profile from '../lib/data/profile'
import { getAllSeries, getWritingStats } from '../lib/content/posts'
import styles from './About.module.css'

export default function About() {
  // Read from the content collection rather than hardcoded counts, so
  // publishing an article updates this page without anyone remembering to.
  const stats = getWritingStats()
  const series = getAllSeries()

  const facts = [
    { label: 'Based in', value: profile.location },
    { label: 'Focus', value: 'Payments, backend systems, mobile' },
    { label: 'Published', value: `${stats.articles} articles · ${Math.floor(stats.words / 1000)}k+ words` },
    { label: 'Status', value: profile.available ? 'Open to work' : 'Not currently available' },
  ]

  return (
    <>
      <SEO
        path="/about"
        title="About"
        description={`${profile.name} — backend and mobile engineer in Nairobi building payment systems, and writing ${stats.articles} long-form articles on retries, idempotency and reconciliation.`}
      />

      <Container as="section" className={styles.intro}>
        <Reveal>
          <span className={styles.eyebrow}>The person behind the code</span>
          <h1 className={styles.title}>
            {profile.name.split(' ')[0]} <em className={styles.emphasis}>{profile.name.split(' ')[1]}</em>.
          </h1>
          <p className={styles.lead}>{bio}</p>
          <p className={styles.leadSecondary}>{bioSecondary}</p>

          <dl className={styles.factRow}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.introActions}>
            <Button as={Link} to="/work">See selected work</Button>
            <Button variant="secondary" href={profile.resumeUrl}>Download résumé</Button>
          </div>
        </Reveal>
      </Container>

      {/* ---- 01 What I do ---- */}
      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading
            index={1}
            eyebrow="Capabilities"
            title="What I do"
            description="End to end, from the tap in the app to the row in the ledger."
          />
        </Reveal>
        <div className={styles.capGrid}>
          {capabilities.map((cap, i) => (
            <Reveal as={Card} key={cap.area} delay={i * 60} accent={cap.tone} className={styles.capCard}>
              <div className={styles.capArea}>{cap.area}</div>
              <p className={styles.capSummary}>{cap.summary}</p>
              <p className={styles.capDetail}>{cap.detail}</p>
              <ul className={styles.tagList}>
                {cap.stack.map((item) => (
                  <li key={item}><Badge tone={cap.tone}>{item}</Badge></li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ---- 02 Writing ----
          Placed this high deliberately: a body of long-form systems writing
          is the least common thing on this page, and the easiest for a
          reader to verify. Counts and series come from the content
          collection, so this section cannot go stale. */}
      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={2} eyebrow="Technical writing" title="Writing" description={writingIntro} />
        </Reveal>

        <Reveal className={styles.writingStats}>
          <div className={styles.writingStat}>
            <span className={styles.writingStatValue}>{stats.articles}</span>
            <span className={styles.writingStatLabel}>articles published</span>
          </div>
          <div className={styles.writingStat}>
            <span className={styles.writingStatValue}>{Math.floor(stats.words / 1000)}k+</span>
            <span className={styles.writingStatLabel}>words written</span>
          </div>
          <div className={styles.writingStat}>
            <span className={styles.writingStatValue}>{stats.series}</span>
            <span className={styles.writingStatLabel}>in-depth series</span>
          </div>
        </Reveal>

        <div className={styles.stack}>
          {series.map((s, i) => (
            <Reveal as={Card} key={s.id} delay={i * 60} accent="accent" className={styles.seriesCard}>
              <div className={styles.row}>
                <div>
                  <div className={styles.rowTitle}>{s.title}</div>
                  <div className={styles.rowSub}>{s.parts.length}-part series</div>
                </div>
                <Badge tone="accent">{s.index.category}</Badge>
              </div>
              <p className={styles.seriesExcerpt}>{s.index.excerpt}</p>
              <Link to={s.index.route} className={styles.seriesLink}>
                Read the series →
              </Link>
            </Reveal>
          ))}
        </div>

        <div className={styles.moreLink}>
          <Button as={Link} to="/blog" variant="ghost">
            Read all {stats.articles} articles →
          </Button>
        </div>
      </Container>

      {/* ---- 03 How I work ---- */}
      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={3} eyebrow="Principles" title="How I work" />
        </Reveal>
        <div className={styles.principleGrid}>
          {principles.map((p, i) => (
            <Reveal as={Card} key={p.label} delay={i * 50} accent="accent" className={styles.principleCard}>
              <div className={styles.principleLabel}>{p.label}</div>
              <p className={styles.principleBody}>{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ---- 04 Education ---- */}
      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={4} eyebrow="Background" title="Education" />
        </Reveal>
        <div className={styles.stack}>
          {education.map((edu) => (
            <Reveal as={Card} key={edu.school} accent="blue" className={styles.row}>
              <div>
                <div className={styles.rowTitle}>{edu.school}</div>
                <div className={styles.rowSub}>{edu.course}</div>
                <div className={styles.rowMeta}>{edu.location}</div>
              </div>
              <Badge tone="blue">{edu.period}</Badge>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ---- 05 Community ---- */}
      <Container as="section" className={styles.blockLast}>
        <Reveal>
          <SectionHeading index={5} eyebrow="Community" title="Organizations & mentorship" />
        </Reveal>
        <div className={styles.stack}>
          {organizations.map((org) => (
            <Reveal as={Card} key={org.name} accent="green" className={styles.orgCard}>
              <div className={styles.row}>
                <div>
                  <div className={styles.rowTitle}>{org.name}</div>
                  <div className={styles.rowSub}>{org.role} · {org.location}</div>
                </div>
                <Badge tone="green">{org.period}</Badge>
              </div>
              <ul className={styles.tagList}>
                {org.tags.map((tag) => (
                  <li key={tag}><Badge>{tag}</Badge></li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  )
}
