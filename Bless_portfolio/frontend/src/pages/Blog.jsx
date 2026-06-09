import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import posts from '../data/posts'

const categoryColors = {
  mobile:         { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)', text: '#c4b5fd' },
  backend:        { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',   text: '#6ee7b7' },
  infrastructure: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)', text: '#fbbf24' },
  frontend:       { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',   text: '#93c5fd' },
  career:         { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', text: '#f9a8d4' },
}

const categories = ['all posts', 'mobile', 'backend', 'infrastructure', 'frontend', 'career']

function PostCard({ post }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const c = categoryColors[post.category] || categoryColors.backend
  const date = new Date(post.created_at).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      onClick={() => navigate(`/blog/${post.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '12px', padding: '1.5rem',
        cursor: 'pointer', transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          padding: '3px 10px', borderRadius: '6px',
          background: c.bg, border: '1px solid ' + c.border, color: c.text,
        }}>
          {post.category}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)' }}>
          {post.reading_time}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.2)', marginLeft: 'auto' }}>
          {date}
        </span>
      </div>

      <div style={{
        fontFamily: 'Bricolage Grotesque', fontSize: '18px', fontWeight: 700,
        color: hovered ? '#e2dff5' : 'rgba(226,223,245,0.85)',
        marginBottom: '8px', lineHeight: 1.3, transition: 'color 0.2s',
      }}>
        {post.title}
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: '11px',
        color: 'rgba(226,223,245,0.45)', lineHeight: 1.8,
      }}>
        {post.excerpt}
      </div>

      {post.tags_list && post.tags_list.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {post.tags_list.map(tag => (
            <span key={tag} style={{
              fontFamily: 'JetBrains Mono', fontSize: '10px',
              padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(226,223,245,0.3)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all posts')

  const filtered = activeCategory === 'all posts'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <div style={{ position: 'relative', zIndex: 5, padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#34d399' }} />
          cat blog/
        </div>

        <h1 style={{
          fontFamily: 'Bricolage Grotesque',
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          fontWeight: 800, color: '#e2dff5',
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
        }}>
          Articles &amp; <br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(167,139,250,0.7)' }}>
            Thoughts.
          </span>
        </h1>

        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.4)', lineHeight: 1.9,
        }}>
          <span style={{ color: '#a78bfa' }}>// </span>
          Writing about mobile development, backend systems, infrastructure and life as a developer in Kenya.
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '2rem', padding: '0.75rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: 'JetBrains Mono', fontSize: '11px',
              padding: '6px 14px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              background: activeCategory === cat ? 'rgba(167,139,250,0.2)' : 'transparent',
              color: activeCategory === cat ? '#c4b5fd' : 'rgba(226,223,245,0.4)',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.3)', padding: '3rem 0', textAlign: 'center',
        }}>
          no posts in this category yet.
        </div>
      )}
    </div>
  )
}

export default Blog