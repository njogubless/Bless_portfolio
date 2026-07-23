import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../lib/useTheme'
import { cx } from '../../lib/utils'
import Container from '../ui/Container'
import styles from './Navbar.module.css'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Close the mobile menu on route change / escape, and lock scroll
  // while it's open so the page behind it doesn't scroll.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoMark}>PN</span>
          <span className={styles.logoText}>Paul Njogu</span>
        </NavLink>

        <nav className={styles.nav} aria-label="Primary">
          {links.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '◑' : '◐'}
          </button>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={cx(styles.bar1, menuOpen && styles.open)} />
            <span className={cx(styles.bar2, menuOpen && styles.open)} />
          </button>
        </div>
      </Container>

      <nav
        id="mobile-nav"
        className={cx(styles.mobileNav, menuOpen && styles.mobileNavOpen)}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        {links.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => cx(styles.mobileLink, isActive && styles.mobileLinkActive)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
