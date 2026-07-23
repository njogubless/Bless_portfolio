import { NavLink } from 'react-router-dom'
import profile from '../../lib/data/profile'
import Container from '../ui/Container'
import Badge from '../ui/Badge'
import styles from './Footer.module.css'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>{profile.name}</div>
            <p className={styles.tagline}>
              {profile.role}
              <br />
              building things that ship.
              <br />
              {profile.location}
            </p>
            {profile.available && (
              <span className={styles.available}>
                <span className={styles.dot} aria-hidden="true" />
                Available for hire
              </span>
            )}
          </div>

          <nav aria-label="Footer">
            <div className={styles.heading}>Navigate</div>
            <ul className={styles.linkList}>
              {navLinks.map(({ label, path }) => (
                <li key={path}>
                  <NavLink to={path} className={styles.link}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className={styles.heading}>Connect</div>
            <ul className={styles.linkList}>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    className={styles.link}
                    target={s.url.startsWith('mailto') ? undefined : '_blank'}
                    rel={s.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  >
                    {s.label} <span className={styles.handle}>{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            Built with React · Design system documented in <code>/docs</code> · © {new Date().getFullYear()}
          </p>
          <div className={styles.stack}>
            {profile.techStack.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
