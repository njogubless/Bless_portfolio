import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

const API_BASE = 'https://bless-portfolio-1.onrender.com/api/blog/'

const categoryColors = {
  mobile:         { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)', text: '#c4b5fd' },
  backend:        { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',   text: '#6ee7b7' },
  infrastructure: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)', text: '#fbbf24' },
  frontend:       { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',   text: '#93c5fd' },
  career:         { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', text: '#f9a8d4' },
}

function BlogPost() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const [post, setPost]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    fetch(API_BASE + slug + '/')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(data => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

  const c = post ? (categoryColors[post.category] || categoryColors.backend) : categoryColors.backend

  const date = post
    ? new Date(post.created_at).toLocaleDateString('en-KE', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  if (loading) return (
    <div style={{ padding: '3rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
      {[60, 80, 40, 100, 90, 70, 95, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '40px' : '14px',
          width: w + '%',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '6px', marginBottom: '16px',
          animation: 'shimmer 1.5s ease-in-out infinite',
          animationDelay: i * 0.08 + 's',
        }} />
      ))}
      <style>{`@keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{
      padding: '3rem 2rem', maxWidth: '720px', margin: '0 auto',
      fontFamily: 'JetBrains Mono', fontSize: '12px',
      color: '#f87171', display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <span>error: post not found</span>
      <button
        onClick={() => navigate('/blog')}
        style={{
          width: 'fit-content', fontFamily: 'JetBrains Mono', fontSize: '11px',
          padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
          background: 'rgba(167,139,250,0.1)',
          border: '1px solid rgba(167,139,250,0.3)',
          color: '#c4b5fd',
        }}
      >
        {'<-'} back to blog
      </button>
    </div>
  )

  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: '3rem 2rem', maxWidth: '720px', margin: '0 auto',
    }}>

      {/* Back button */}
      <button
        onClick={() => navigate('/blog')}
        style={{
          fontFamily: 'JetBrains Mono', fontSize: '11px',
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(226,223,245,0.4)', marginBottom: '2rem',
          padding: 0, letterSpacing: '0.05em',
          transition: 'color 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.color = '#a78bfa'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(226,223,245,0.4)'}
      >
        {'<-'} back to blog
      </button>

      {/* Category + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: '10px',
          padding: '3px 10px', borderRadius: '6px',
          background: c.bg, border: '1px solid ' + c.border,
          color: c.text,
        }}>
          {post.category}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.3)' }}>
          {post.reading_time}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.25)' }}>
          {date}
        </span>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'Bricolage Grotesque',
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        fontWeight: 800, color: '#e2dff5',
        lineHeight: 1.2, letterSpacing: '-0.02em',
        marginBottom: '1rem',
      }}>
        {post.title}
      </h1>

      {/* Excerpt */}
      <p style={{
        fontFamily: 'JetBrains Mono', fontSize: '13px',
        color: 'rgba(226,223,245,0.5)', lineHeight: 1.9,
        marginBottom: '2rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {post.excerpt}
      </p>

      {/* Tags */}
      {post.tags_list && post.tags_list.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2.5rem' }}>
          {post.tags_list.map(tag => (
            <span key={tag} style={{
              fontFamily: 'JetBrains Mono', fontSize: '10px',
              padding: '3px 10px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(226,223,245,0.4)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Markdown content */}
      <div style={{ fontFamily: 'JetBrains Mono' }}>
        <style>{`
          .blog-content h1, .blog-content h2, .blog-content h3 {
            font-family: 'Bricolage Grotesque', sans-serif;
            color: #e2dff5;
            font-weight: 700;
            margin: 2rem 0 1rem;
            line-height: 1.3;
          }
          .blog-content h1 { font-size: 1.8rem; }
          .blog-content h2 { font-size: 1.4rem; color: rgba(226,223,245,0.9); }
          .blog-content h3 { font-size: 1.1rem; color: rgba(226,223,245,0.8); }
          .blog-content p {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: rgba(226,223,245,0.65);
            line-height: 2;
            margin-bottom: 1.25rem;
          }
          .blog-content code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            background: rgba(167,139,250,0.1);
            border: 1px solid rgba(167,139,250,0.2);
            color: #c4b5fd;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .blog-content pre {
            background: rgba(10,8,25,0.8);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 1.25rem;
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          .blog-content pre code {
            background: none;
            border: none;
            padding: 0;
            font-size: 12px;
            color: #34d399;
          }
          .blog-content ul, .blog-content ol {
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .blog-content li {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: rgba(226,223,245,0.65);
            line-height: 2;
          }
          .blog-content blockquote {
            border-left: 3px solid #a78bfa;
            padding: 0.5rem 0 0.5rem 1.25rem;
            margin: 1.5rem 0;
            background: rgba(167,139,250,0.05);
            border-radius: 0 8px 8px 0;
          }
          .blog-content blockquote p {
            color: rgba(226,223,245,0.5);
            font-style: italic;
            margin: 0;
          }
          .blog-content a {
            color: #a78bfa;
            text-decoration: none;
            border-bottom: 1px solid rgba(167,139,250,0.3);
          }
          .blog-content hr {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.07);
            margin: 2rem 0;
          }
          .blog-content strong {
            color: #e2dff5;
            font-weight: 500;
          }
        `}</style>
        <div className="blog-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        marginTop: '4rem', paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <button
          onClick={() => navigate('/blog')}
          style={{
            fontFamily: 'JetBrains Mono', fontSize: '11px',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)',
            color: '#c4b5fd',
          }}
        >
          {'<-'} all posts
        </button>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'rgba(226,223,245,0.2)' }}>
          paul njogu · {date}
        </div>
      </div>
    </div>
  )
}

export default BlogPost