import { useState } from 'react'

const education = [
  {
    school: 'Kenya Methodist University',
    course: 'Computer Information Systems',
    location: 'Meru Main Campus',
    period: '2020 — 2024',
    icon: '🎓',
  },
]

const organizations = [
  {
    name: 'Kamilimu Mentorship Organization',
    role: 'Mentee',
    location: 'Nairobi',
    period: '2022 — 2023',
    tags: ['Innovation', 'Personal Development', 'Professional Development'],
    icon: '🤝',
  },
  {
    name: 'Young Tech Kenya',
    role: 'President',
    location: 'Kenya Methodist University',
    period: '2022 — 2023',
    tags: ['Leadership', 'Tech Community', 'Mentorship'],
    icon: '🏆',
  },
]

const interests = [
  { label: 'Open Source',       icon: '⚡' },
  { label: 'Mobile Apps',       icon: '📱' },
  { label: 'Cloud & DevOps',    icon: '☁️'  },
  { label: 'Hiking',            icon: '🏔'  },
  { label: 'Teaching & Mentoring', icon: '🎯' },
  { label: 'System Design',     icon: '🏗'  },
  { label: 'Driving',             icon: '🎵'  },
  { label: 'Community Building',icon: '🌍'  },
]

const values = [
  { label: 'Ship fast,',   sub: 'iterate faster'     },
  { label: 'Write code',   sub: 'others can read'    },
  { label: 'Build things', sub: 'that actually work' },
  { label: 'Iterate',   sub: 'learning'           },
]


function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '1.5rem',
      ...style,
    }}>
      {children}
    </div>
  )
}

// Section label — matches the rest of the site
function SectionLabel({ text }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono', fontSize: '10px',
      color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
      textTransform: 'uppercase', marginBottom: '1.25rem',
    }}>
      <span style={{ color: '#a78bfa' }}>//</span> {text}
    </div>
  )
}

function About() {
  const [activeTab, setActiveTab] = useState('education')

  const tabs = ['education', 'organizations', 'interests', 'values']

  return (
    <div style={{ position: 'relative', zIndex: 5, padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: '#34d399', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#34d399' }} />
          cat about.md
        </div>

        <h1 style={{
          fontFamily: 'Bricolage Grotesque', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#e2dff5', lineHeight: 1.1,
          letterSpacing: '-0.02em', marginBottom: '1rem',
        }}>
          The person behind<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(167,139,250,0.7)' }}>
            the code.
          </span>
        </h1>

        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.45)', lineHeight: 1.9, maxWidth: '520px',
        }}>
          <span style={{ color: '#a78bfa' }}>// </span>
          Full-stack engineer based in Nairobi. I build mobile apps,
          design backend systems, and own the infrastructure they run on — end-to-end,
          from code to cloud. I care about reliability, performance, and software that scales.
          #GoodCode#Build#Learn#Iterate
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: '4px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px', padding: '4px',
        marginBottom: '2rem', width: 'fit-content',
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: 'JetBrains Mono', fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '8px 18px', borderRadius: '7px',
              border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'rgba(167,139,250,0.2)' : 'transparent',
              color: activeTab === tab ? '#c4b5fd' : 'rgba(226,223,245,0.35)',
              borderBottom: activeTab === tab ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── EDUCATION TAB ── */}
      {activeTab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SectionLabel text="education_history" />
          {education.map((edu, i) => (
            <GlassCard key={i}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(167,139,250,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {edu.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '16px', fontWeight: 700, color: '#e2dff5' }}>
                      {edu.school}
                    </div>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: '10px',
                      color: '#34d399', background: 'rgba(52,211,153,0.08)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      padding: '3px 10px', borderRadius: '999px',
                    }}>
                      {edu.period}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#a78bfa', marginBottom: '4px' }}>
                    {edu.course}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.35)' }}>
                    📍 {edu.location}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── ORGANIZATIONS TAB ── */}
      {activeTab === 'organizations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SectionLabel text="organizations_and_volunteering" />
          {organizations.map((org, i) => (
            <GlassCard key={i}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(52,211,153,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {org.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '16px', fontWeight: 700, color: '#e2dff5' }}>
                      {org.name}
                    </div>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: '10px',
                      color: '#34d399', background: 'rgba(52,211,153,0.08)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      padding: '3px 10px', borderRadius: '999px',
                    }}>
                      {org.period}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#a78bfa', marginBottom: '8px' }}>
                    {org.role} · 📍 {org.location}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {org.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'JetBrains Mono', fontSize: '10px',
                        padding: '3px 10px', borderRadius: '6px',
                        background: 'rgba(167,139,250,0.08)',
                        border: '1px solid rgba(167,139,250,0.2)',
                        color: '#c4b5fd',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── INTERESTS TAB ── */}
      {activeTab === 'interests' && (
        <div>
          <SectionLabel text="interests_and_hobbies" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            {interests.map((item, i) => (
              <GlassCard key={i} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: '11px',
                  color: 'rgba(226,223,245,0.7)', letterSpacing: '0.05em',
                }}>
                  {item.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ── VALUES TAB ── */}
      {activeTab === 'values' && (
        <div>
          <SectionLabel text="how_i_work" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px', marginBottom: '2rem',
          }}>
            {values.map((v, i) => (
              <GlassCard key={i} style={{ borderLeft: '2px solid rgba(167,139,250,0.4)', borderRadius: '0 14px 14px 0' }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '18px', fontWeight: 700, color: '#e2dff5' }}>
                  {v.label}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#a78bfa' }}>
                  {v.sub}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Fun terminal bio */}
          <GlassCard>
            <div style={{
              display: 'flex', gap: '6px', marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ marginLeft: '8px', fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.25)' }}>
                paul.config
              </span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', lineHeight: 2.2, color: 'rgba(226,223,245,0.6)' }}>
              <div><span style={{ color: '#a78bfa' }}>const</span> <span style={{ color: '#34d399' }}>paul</span> = {'{'}</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>role</span>: <span style={{ color: '#fbbf24' }}>"Flutter & Python Developer"</span>,</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>location</span>: <span style={{ color: '#fbbf24' }}>"Nairobi, Kenya 🇰🇪"</span>,</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>available</span>: <span style={{ color: '#34d399' }}>true</span>,</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>languages</span>: [<span style={{ color: '#fbbf24' }}>"Dart"</span>, <span style={{ color: '#fbbf24' }}>"Flutter"</span>, <span style={{ color: '#fbbf24' }}>"Python"</span>, <span style={{ color: '#fbbf24' }}>"JavaScript"</span>],</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>currentlyLearning</span>: <span style={{ color: '#fbbf24' }}>"React"</span>,</div>
              <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#c4b5fd' }}>funFact</span>: <span style={{ color: '#fbbf24' }}>"I built everything from Scratch, it being my first time with REACT.JS(pretty okay work I guess) ☕"</span>,</div>
              <div>{'}'}</div>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  )
}

export default About