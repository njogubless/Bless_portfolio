import TerminalCard from './TerminalCard'

function Hero() {
    return (
        <section style={{
            position: 'relative', zIndex: 5,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: '2rem',
            padding: '3.5rem 2rem 2.5rem',
            flexWrap: 'wrap',   
        }}>

            {/* Left — text content */}
            <div style={{ maxWidth: '500px' }}>

                {/* "Open to work" badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'JetBrains Mono', fontSize: '10px',
                    color: '#34d399', letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    padding: '5px 14px', borderRadius: '999px', marginBottom: '1.5rem',
                }}>
                    <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#34d399', animation: 'blink 1.8s ease-in-out infinite',
                    }} />
                    Open to work — Nairobi / Remote
                </div>

                {/* Name */}
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                    <span style={{ display: 'block', color: '#e2dff5' }}>Paul</span>
                    {/* Outline text effect — no fill, just a stroke */}
                    <span style={{
                        display: 'block',
                        color: 'transparent',
                        WebkitTextStroke: '1.5px rgba(167,139,250,0.7)',
                    }}>
                        Njogu.
                    </span>
                </h1>

                {/* Description */}
                <p style={{
                    fontFamily: 'JetBrains Mono', fontSize: '12px',
                    color: 'rgba(226,223,245,0.45)', lineHeight: 1.9, marginBottom: '2rem',
                }}>
                    <span style={{ color: '#a78bfa' }}>// Flutter &amp; Python dev</span><br />
                    Building mobile apps, REST APIs &amp; cloud infra<br />
                    that actually ship. From Nairobi , Kenya.
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

                    {/* 1. View Projects Button - Wrapped in an anchor tag for scrolling */}
                    <a href="#projects" style={{ textDecoration: 'none' }}>
                        <button style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '11px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            color: '#fff', fontWeight: 500,
                            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                            transition: 'transform 0.2s ease',
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            ./view_projects
                        </button>
                    </a>

                    {/* 2. Resume Button - Updated to point to your PDF file */}
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '11px 24px', borderRadius: '8px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(226,223,245,0.7)',
                            backdropFilter: 'blur(10px)',
                            transition: 'background 0.2s ease',
                        }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        >
                            cat resume.pdf
                        </button>
                    </a>

                </div>
            </div>

            {/* Right — terminal card */}
            <TerminalCard />

            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
        </section>
    )
}

export default Hero