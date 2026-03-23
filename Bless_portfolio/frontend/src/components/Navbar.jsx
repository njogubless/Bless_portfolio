import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'home',    path: '/'        },
  { label: 'work',    path: '/work'    },
  { label: 'about',   path: '/about'   },
  { label: 'contact', path: '/contact' },
  { label: 'blog',    path: '/blog'    },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.1rem 1.5rem',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 100,
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#a78bfa' }}>
            ~/<span style={{ color: '#34d399' }}>paul-njogu</span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <div style={{
          display: 'flex', gap: '4px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '999px', padding: '4px 6px',
        }}
          className="hide-mobile"
        >
          {links.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              style={({ isActive }) => ({
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                color: isActive ? '#e2dff5' : 'rgba(226,223,245,0.5)',
                textDecoration: 'none',
                padding: '5px 14px',
                borderRadius: '999px',
                background: isActive ? 'rgba(167,139,250,0.2)' : 'transparent',
                transition: 'all 0.2s',
                letterSpacing: '0.06em',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', // overridden by show-mobile class
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px',
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '2px',
              background: menuOpen && i === 1 ? 'transparent' : '#e2dff5',
              borderRadius: '2px',
              transition: 'all 0.2s',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                : 'none'
                : 'none',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0,
          background: 'rgba(6,9,18,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          zIndex: 99, padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {links.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'JetBrains Mono', fontSize: '13px',
                color: isActive ? '#a78bfa' : 'rgba(226,223,245,0.7)',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                background: isActive ? 'rgba(167,139,250,0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid #a78bfa' : '2px solid transparent',
                transition: 'all 0.2s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}

export default Navbar