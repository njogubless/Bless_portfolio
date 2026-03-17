
function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.1rem 2rem',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',          
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#a78bfa' }}>
        ~/<span style={{ color: '#34d399' }}>paul-njogu</span>
      </div>

      <div style={{
        display: 'flex', gap: '4px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '999px', padding: '4px 6px',
      }}>
        {['home', 'work', 'about', 'contact'].map((item) => (
          <a key={item} href={`#${item}`} style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(226,223,245,0.5)',
            textDecoration: 'none',
            padding: '5px 14px',
            borderRadius: '999px',
          }}>
            {item}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navbar   