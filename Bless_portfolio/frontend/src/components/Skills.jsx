// Our skill data lives here as an array of objects
// This is a pattern you'll use everywhere in React — data separate from UI
const skills = [
    { label: 'Flutter', variant: 'purple' },
    { label: 'Dart', variant: 'purple' },
    { label: 'Riverpod', variant: 'purple' },
    { label: 'Firebase', variant: 'purple' },
    { label: 'Python', variant: 'green' },
    { label: 'Django', variant: 'green' },
    { label: 'PostgreSQL', variant: 'green' },
    { label: 'REST APIs', variant: 'green' },
    { label: 'Docker', variant: 'amber' },
    { label: 'Kubernetes', variant: 'amber' },
    { label: 'AWS', variant: 'amber' },
    { label: 'CI/CD', variant: 'amber' },
    { label: 'Git', variant: 'amber' },
    { label: 'Linux', variant: 'amber' },
    { label: 'Automation', variant: 'amber' },

]

// Each variant maps to a colour scheme
const variants = {
    purple: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#c4b5fd' },
    green: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', color: '#6ee7b7' },
    amber: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.18)', color: '#fbbf24' },
}

function Skills({ activeFilter, setActiveFilter }) {
    return (
        <section style={{
            position: 'relative', zIndex: 5,
            padding: '1.5rem 2rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
        }}>

            <span style={{
                fontFamily: 'JetBrains Mono', fontSize: '10px',
                color: 'rgba(226,223,245,0.25)', letterSpacing: '0.15em',
                marginRight: '6px',
            }}>
        // stack
            </span>

            {/* .map() turns our data array into a list of chip elements */}
            {skills.map((skill) => {
                const isSelected = activeFilter === skill.label;
                const style = variants[skill.variant];

                return (
                    <button
                        key={skill.label}
                        onClick={() => setActiveFilter(isSelected ? null : skill.label)}
                        style={{
                            fontFamily: 'JetBrains Mono', fontSize: '10px',
                            padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                            background: isSelected ? style.color : style.bg,
                            border: `1px solid ${style.border}`,
                            color: isSelected ? '#000' : style.color, // Text turns black when background is bright
                            transition: 'all 0.2s ease',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {skill.label}
                    </button>
                );
            })}
        </section>
    )
}

export default Skills