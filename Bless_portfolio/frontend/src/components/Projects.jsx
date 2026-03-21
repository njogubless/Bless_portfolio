import React, { useState, useEffect } from 'react';


const iconBg = {
    purple: 'rgba(167,139,250,0.15)',
    green: 'rgba(52,211,153,0.12)',
    amber: 'rgba(251,191,36,0.10)',
    red: 'rgba(248,113,113,0.12)',    
    indigo: 'rgba(99,102,241,0.12)',
}


function ProjectCard({ project }) {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: hovered ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${hovered ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    transition: 'all 0.3s ease',
                    transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: iconBg[project.color] || iconBg.purple,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px',
                    }}>
                        {project.icon}
                    </div>
                    <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Github"
                        style={{
                            fontFamily: 'JetBrains Mono', fontSize: '16px',
                            color: hovered ? '#a78bfa' : 'rgba(226,223,245,0.2)',
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                    >
                        ↗
                    </a>
                </div>

                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '14px', fontWeight: 700, color: '#e2dff5', marginBottom: '5px' }}>
                    {project.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.35)', marginBottom: '8px' }}>
                    {project.tech}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(226,223,245,0.5)', lineHeight: 1.6 }}>
                    {project.description}
                </div>
            </div>
        </>
    )
}

function SkeletonCard() {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '1.25rem',
        }}>
            {['36px', '14px', '10px', '40px'].map((h, i) => (
                <div key={i} style={{
                    height: h,
                    width: i === 0 ? '36px' : i === 2 ? '60%' : '80%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                }} />
            ))}
            <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4 }
          50%       { opacity: 0.8 }
        }
      `}</style>
        </div>
    )
}

function ErrorState({ onRetry }) {
    return (
        <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '12px',
            color: 'rgba(226,223,245,0.4)', padding: '2rem 0',
            display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
            <span style={{ color: '#f87171' }}>error: failed to connect to API</span>
            <span>make sure Django is running on localhost:8000</span>
            <button
                onClick={onRetry}
                style={{
                    width: 'fit-content',
                    fontFamily: 'JetBrains Mono', fontSize: '11px',
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    color: '#c4b5fd', letterSpacing: '0.08em',
                }}
            >
                retry_connection()
            </button>
        </div>
    )
}


const API_URL = 'https://bless-portfolio-1.onrender.com/api/projects/'

function Projects({ activeFilter }) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)


    const fetchProjects = () => {
        setLoading(true)
        setError(false)

        fetch(API_URL)
            .then(res => {
             
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                setProjects(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Projects API error:', err)
                setError(true)
                setLoading(false)
            })
    }

 
    useEffect(() => {
        fetchProjects()
    }, [])

  
    const filteredProjects = activeFilter
        ? projects.filter(p => p.tech.toLowerCase().includes(activeFilter.toLowerCase()))
        : projects

    return (
        <section id="projects" style={{ position: 'relative', zIndex: 5, padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

            {/* Section header */}
            <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '10px',
                color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '8px',
            }}>
                <span style={{ color: '#a78bfa' }}>//</span> featured_projects
                {activeFilter && (
                    <span style={{ color: 'rgba(226,223,245,0.4)' }}>
                        filtered_by: {activeFilter}
                    </span>
                )}
                {/* Live dot — shows the data is coming from a real API */}
                {!loading && !error && (
                    <span style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px',
                        color: '#34d399', fontSize: '9px',
                    }}>
                        <span style={{
                            width: '5px', height: '5px', borderRadius: '50%', background: '#34d399',
                            animation: 'blink 2s ease-in-out infinite', display: 'inline-block',
                        }} />
                        live
                        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
                    </span>
                )}
            </div>

            {/* ── states: loading / error / data ── */}
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            )}

            {error && <ErrorState onRetry={fetchProjects} />}

            {!loading && !error && (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '12px',
                    }}>
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div style={{ color: 'rgba(226,223,245,0.3)', padding: '2rem 0', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                            no projects found for: {activeFilter}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default Projects