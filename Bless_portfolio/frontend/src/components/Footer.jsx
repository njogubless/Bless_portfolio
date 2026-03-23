import { NavLink } from 'react-router-dom'

const socials = [
  {
    label: 'GitHub',
    handle: '@njogubless',
    url: 'https://github.com/njogubless',
    color: 'rgba(255,255,255,0.06)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2dff5" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'paul-njogu',
    url: 'https://www.linkedin.com/in/paul-njogu-02b413214/',
    color: 'rgba(10,102,194,0.15)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#378ADD">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    handle: '@njogubless1',
    url: 'https://x.com/njogubless1',
    color: 'rgba(255,255,255,0.06)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2dff5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    handle: '+254 746 179 799',
    url: 'https://wa.me/254746179799',
    color: 'rgba(37,211,102,0.12)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#34d399">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.117 1.533 5.847L.057 23.03a.75.75 0 0 0 .921.921l5.184-1.476A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.184-1.433l-.371-.224-3.851 1.097 1.097-3.851-.224-.371A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'njogupaul994@gmail.com',
    url: 'mailto:njogupaul994@gmail.com',
    color: 'rgba(167,139,250,0.12)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

const navLinks = [
  { label: '~/home',    path: '/'        },
  { label: '~/about',   path: '/about'   },
  { label: '~/work',    path: '/work'    },
  { label: '~/blog',    path: '/blog'    },
  { label: '~/contact', path: '/contact' },
]

const techStack = ['Flutter', 'Python', 'Django', 'Docker', 'AWS', 'React']

function Footer() {
  const [hoveredSocial, setHoveredSocial] = React.useState(null)

  return (
    <footer style={{
      position: 'relative', zIndex: 5,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '3rem 2rem 2rem',
    }}>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem',
      }}>

        {/* Brand column */}
        <div>
          <div style={{
            fontFamily: 'Bricolage Grotesque', fontSize: '2rem',
            fontWeight: 800, lineHeight: 1, marginBottom: '8px',
          }}>
            <span style={{ color: '#e2dff5' }}>Paul </span>
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(167,139,250,0.7)' }}>
              Njogu.
            </span>
          </div>

          <p style={{
            fontFamily: 'JetBrains Mono', fontSize: '11px',
            color: 'rgba(226,223,245,0.4)', lineHeight: 1.9, marginBottom: '14px',
          }}>
            Flutter & Python Developer<br />
            building things that ship.<br />
            Eldoret, Kenya
          </p>

          {/* Available badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: '#34d399', background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            padding: '4px 12px', borderRadius: '999px',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#34d399', display: 'inline-block',
              animation: 'blink 2s ease-in-out infinite',
            }} />
            available for hire
          </div>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
        </div>

        {/* Navigation column */}
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            // navigate
          </div>
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'block',
                fontFamily: 'JetBrains Mono', fontSize: '12px',
                color: isActive ? '#a78bfa' : 'rgba(226,223,245,0.5)',
                textDecoration: 'none',
                marginBottom: '10px',
                transition: 'color 0.2s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Social links column */}
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px',
            color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            // connect
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target={s.url.startsWith('mailto') ? '_self' : '_blank'}
                rel="noreferrer"
                onMouseEnter={() => setHoveredSocial(s.label)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  textDecoration: 'none', padding: '8px 12px',
                  borderRadius: '8px',
                  background: hoveredSocial === s.label
                    ? 'rgba(167,139,250,0.08)'
                    : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (hoveredSocial === s.label
                    ? 'rgba(167,139,250,0.25)'
                    : 'rgba(255,255,255,0.07)'),
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: s.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.6)' }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)', marginLeft: 'auto' }}>
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '1.5rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.2)' }}>
          built with <span style={{ color: '#a78bfa' }}>React + Django</span> · deployed on Vercel + Render · <span style={{ color: '#a78bfa' }}>2026</span>
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {techStack.map(t => (
            <span key={t} style={{
              fontFamily: 'JetBrains Mono', fontSize: '9px',
              padding: '3px 8px', borderRadius: '4px',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.15)',
              color: 'rgba(167,139,250,0.6)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer