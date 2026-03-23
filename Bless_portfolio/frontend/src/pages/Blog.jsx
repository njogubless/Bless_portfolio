import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://bless-portfolio-1.onrender.com/api/blog/'

const categories = [
  { id: 'all',            label: 'all posts'      },
  { id: 'mobile',         label: 'mobile'         },
  { id: 'backend',        label: 'backend'        },
  { id: 'infrastructure', label: 'infrastructure' },
  { id: 'frontend',       label: 'frontend'       },
  { id: 'career',         label: 'career'         },
]

const categoryColors = {
  mobile:         { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)', text: '#c4b5fd' },
  backend:        { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',   text: '#6ee7b7' },
  infrastructure: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)', text: '#fbbf24' },
  frontend:       { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',   text: '#93c5fd' },
  career:         { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', text: '#f9a8d4' },
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px', padding: '1.5rem',
    }}>
      {[70, 90, 50, 100, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '20px' : i === 3 ? '12px' : '14px',
          width: w + '%',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '6px', marginBottom: '12px',
          animation: 'shimmer 1.5s ease-in-out infinite',
          animationDelay: i * 0.1 + 's',
        }} />
      ))}
      <style>{`@keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
    </div>
  )
}

function PostCard({ post }) {
  const navigate  = useNavigate()
  const [hovered, setHovered] = useState(false)
  const c = categoryColors[post.category] || categoryColors.backend

  const date = new Date(post.created_at).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div
      onClick={() => navigate('/blog/' + post.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(167,139,250,0.05)' : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid ' + (hovered ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)'),
        borderRadius: '14px', padding: '1.5rem',
        cursor: 'pointer', transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Category + reading time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          padding: '3px 10px', borderRadius: '6px',
          background: c.bg, border: '1px solid ' + c.border,
          color: c.text, letterSpacing: '0.05em',
        }}>
          {post.category}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)' }}>
          {post.reading_time}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Bricolage Grotesque', fontSize: '18px',
        fontWeight: 700, color: hovered ? '#e2dff5' : 'rgba(226,223,245,0.9)',
        marginBottom: '10px', lineHeight: 1.3,
        transition: 'color 0.2s',
      }}>
        {post.title}
      </div>

      {/* Excerpt */}
      <p style={{
        fontFamily: 'JetBrains Mono', fontSize: '11px',
        color: 'rgba(226,223,245,0.45)', lineHeight: 1.8,
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {post.excerpt}
      </p>

      {/* Tags */}
      {post.tags_list && post.tags_list.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {post.tags_list.map(tag => (
            <span key={tag} style={{
              fontFamily: 'JetBrains Mono', fontSize: '9px',
              padding: '2px 8px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(226,223,245,0.4)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.25)' }}>
          {date}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: hovered ? '#a78bfa' : 'rgba(226,223,245,0.2)',
          transition: 'color 0.2s',
        }}>
          read more {'->'}
        </span>
      </div>
    </div>
  )
}

function Blog() {
  const [posts, setPosts]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')

  const fetchPosts = (category) => {
    setLoading(true)
    setError(false)
    const url = category === 'all'
      ? API_URL
      : API_URL + '?category=' + category

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPosts('all')
  }, [])

  const handleCategory = (id) => {
    setActiveCategory(id)
    fetchPosts(id)
  }

  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto',
    }}>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: '#34d399', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#34d399' }} />
          cat blog/
        </div>

        <h1 style={{
          fontFamily: 'Bricolage Grotesque',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#e2dff5',
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
        }}>
          Articles &amp;<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(167,139,250,0.7)' }}>
            Thoughts.
          </span>
        </h1>

        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.45)', lineHeight: 1.9, maxWidth: '500px',
        }}>
          <span style={{ color: '#a78bfa' }}>// </span>
          Writing about mobile development, backend systems,
          infrastructure and life as a developer in Kenya.
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '2rem',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            style={{
              fontFamily: 'JetBrains Mono', fontSize: '11px',
              letterSpacing: '0.06em',
              padding: '6px 14px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              background: activeCategory === cat.id
                ? 'rgba(167,139,250,0.2)'
                : 'transparent',
              color: activeCategory === cat.id
                ? '#c4b5fd'
                : 'rgba(226,223,245,0.4)',
              borderBottom: '2px solid ' + (activeCategory === cat.id ? '#a78bfa' : 'transparent'),
              transition: 'all 0.15s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post count */}
      {!loading && !error && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          color: 'rgba(226,223,245,0.25)', marginBottom: '1.25rem',
          letterSpacing: '0.1em',
        }}>
          <span style={{ color: '#a78bfa' }}>{posts.length}</span> post{posts.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: '#f87171', padding: '2rem 0',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <span>error: failed to load posts</span>
          <button
            onClick={() => fetchPosts(activeCategory)}
            style={{
              width: 'fit-content', fontFamily: 'JetBrains Mono', fontSize: '11px',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.3)',
              color: '#c4b5fd',
            }}
          >
            retry_connection()
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'rgba(226,223,245,0.3)', padding: '3rem 0',
          textAlign: 'center', lineHeight: 2,
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{'[ ]'}</div>
          <div>no posts in this category yet</div>
          <div style={{ color: 'rgba(226,223,245,0.2)', marginTop: '6px' }}>
            check back soon — content incoming
          </div>
        </div>
      )}

      {/* Posts grid */}
      {!loading && !error && posts.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Blog