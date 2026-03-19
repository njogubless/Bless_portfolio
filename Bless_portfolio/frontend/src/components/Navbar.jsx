import { NavLink } from 'react-router-dom'

const links = [
  { label: 'home',    path: '/'        },
  { label: 'work',    path: '/work'    },
  { label: 'about',   path: '/about'   },
  { label: 'contact', path: '/contact' },
]

function Navbar() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1.1rem 2rem',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'relative', zIndex: 10,
    }}>
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#a78bfa' }}>
          ~/<span style={{ color: '#34d399' }}>paul-njogu</span>
        </div>
      </NavLink>

      <div style={{
        display: 'flex', gap: '4px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '999px', padding: '4px 6px',
      }}>
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
    </nav>
  )
}

export default Navbar