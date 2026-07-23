import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { bio, education, organizations, interests, values } from '../lib/data/about'
import profile from '../lib/data/profile'
import styles from './About.module.css'

export default function About() {
  return (
    <>
      <SEO
        path="/about"
        title="About"
        description="Full-stack engineer based in Nairobi, Kenya — background, values, education, and how I like to work."
      />

      <Container as="section" className={styles.intro}>
        <Reveal>
          <span className={styles.eyebrow}>The person behind the code</span>
          <h1 className={styles.title}>
            {profile.name.split(' ')[0]} <em className={styles.emphasis}>{profile.name.split(' ')[1]}</em>.
          </h1>
          <p className={styles.lead}>{bio}</p>
        </Reveal>
      </Container>

      {/* How I work — was previously locked behind a "values" tab click;
          it's one of the strongest hiring signals on the page, so it's
          now always visible, right under the intro. */}
      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={1} eyebrow="Principles" title="How I work" />
        </Reveal>
        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <Reveal as={Card} key={v.label} delay={i * 50} accent="accent" className={styles.valueCard}>
              <div className={styles.valueLabel}>{v.label}</div>
              <div className={styles.valueSub}>{v.sub}</div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={2} eyebrow="Background" title="Education" />
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

      <Container as="section" className={styles.block}>
        <Reveal>
          <SectionHeading index={3} eyebrow="Community" title="Organizations & mentorship" />
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

      <Container as="section" className={styles.blockLast}>
        <Reveal>
          <SectionHeading index={4} eyebrow="Outside of work" title="Interests" />
        </Reveal>
        <ul className={styles.interestGrid}>
          {interests.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 30} className={styles.interestItem}>
              {item}
            </Reveal>
          ))}
        </ul>
      </Container>
    </>
  )
}
