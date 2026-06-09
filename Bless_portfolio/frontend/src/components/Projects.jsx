import React, { useState } from 'react';
import projects from '../data/projects';

const iconBg = {
  purple: 'rgba(167,139,250,0.15)',
  green:  'rgba(52,211,153,0.12)',
  amber:  'rgba(251,191,36,0.10)',
  red:    'rgba(248,113,113,0.12)',
  indigo: 'rgba(99,102,241,0.12)',
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
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
  )
}

function Projects({ activeFilter }) {
  const filteredProjects = activeFilter
    ? projects.filter(p => p.tech.toLowerCase().includes(activeFilter.toLowerCase()))
    : projects

  return (
    <section id="projects" style={{ position: 'relative', zIndex: 5, padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

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
      </div>

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
    </section>
  )
}

export default Projects