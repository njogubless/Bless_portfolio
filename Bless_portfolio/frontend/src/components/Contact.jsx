import { useState } from 'react'

const API_URL = 'https://bless-portfolio-1.onrender.com/api/contact/'

const initialForm = {
  name:    '',
  email:   '',
  subject: '',
  body:    '',
}

function Contact() {
  const [form, setForm]     = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())            e.name    = 'name is required'
    if (!form.email.includes('@'))    e.email   = 'valid email required'
    if (!form.subject.trim())         e.subject = 'subject is required'
    if (form.body.trim().length < 10) e.body    = 'message too short'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setStatus('sending')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      console.error('Contact error:', err)
      setStatus('error')
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    fontFamily: 'JetBrains Mono',
    fontSize: '12px',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[field] ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px',
    color: '#e2dff5',
    outline: 'none',
    transition: 'border-color 0.2s',
  })

  const labelStyle = {
    fontFamily: 'JetBrains Mono',
    fontSize: '10px',
    color: 'rgba(226,223,245,0.35)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  }

  const errorStyle = {
    fontFamily: 'JetBrains Mono',
    fontSize: '10px',
    color: '#f87171',
    marginTop: '4px',
  }

  return (
    <section id="contact" style={{
      position: 'relative', zIndex: 5,
      padding: '2rem',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: '10px',
        color: 'rgba(226,223,245,0.25)', letterSpacing: '0.2em',
        textTransform: 'uppercase', marginBottom: '0.5rem',
      }}>
        <span style={{ color: '#a78bfa' }}>//</span> get_in_touch
      </div>

      <p style={{
        fontFamily: 'JetBrains Mono', fontSize: '12px',
        color: 'rgba(226,223,245,0.4)', marginBottom: '2rem', lineHeight: 1.8,
      }}>
        available for freelance, full-time, or collabs —{' '}
        <span style={{ color: '#34d399' }}>response within 24h</span>
      </p>

      {/* Success state */}
      {status === 'success' && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: '10px', padding: '1.5rem',
          color: '#34d399', marginBottom: '1.5rem', lineHeight: 1.8,
        }}>
          <div style={{ fontSize: '16px', marginBottom: '6px' }}>✓ message_sent()</div>
          <div style={{ color: 'rgba(52,211,153,0.7)' }}>
            thanks for reaching out — i will get back to you soon.
          </div>
          <button
            onClick={() => setStatus('idle')}
            style={{
              marginTop: '12px', fontFamily: 'JetBrains Mono', fontSize: '10px',
              background: 'none', border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
            }}
          >
            send_another()
          </button>
        </div>
      )}

      {/* Form */}
      {status !== 'success' && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px', padding: '1.75rem',
          maxWidth: '580px',
        }}>

          {/* Terminal bar */}
          <div style={{
            display: 'flex', gap: '6px', marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <span style={{
              marginLeft: '8px', fontFamily: 'JetBrains Mono',
              fontSize: '10px', color: 'rgba(226,223,245,0.25)',
            }}>
              new_message.sh
            </span>
          </div>

          {/* Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>name</label>
              <input
                value={form.name}
                onChange={handleChange('name')}
                placeholder="John Doe"
                style={inputStyle('name')}
              />
              {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>
            <div>
              <label style={labelStyle}>email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="john@example.com"
                style={inputStyle('email')}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>subject</label>
            <input
              value={form.subject}
              onChange={handleChange('subject')}
              placeholder="Freelance project / Job opportunity / Collab"
              style={inputStyle('subject')}
            />
            {errors.subject && <div style={errorStyle}>{errors.subject}</div>}
          </div>

          {/* Body */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>message</label>
            <textarea
              value={form.body}
              onChange={handleChange('body')}
              placeholder="Tell me about the project or opportunity..."
              rows={5}
              style={{ ...inputStyle('body'), resize: 'vertical', lineHeight: 1.7 }}
            />
            {errors.body && <div style={errorStyle}>{errors.body}</div>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === 'sending'}
            style={{
              width: '100%', fontFamily: 'JetBrains Mono', fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '13px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: status === 'sending'
                ? 'rgba(124,58,237,0.4)'
                : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              color: '#fff', fontWeight: 500,
              boxShadow: status === 'sending' ? 'none' : '0 0 20px rgba(124,58,237,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {status === 'sending' ? 'sending...' : './send_message.sh'}
          </button>

          {/* Error */}
          {status === 'error' && (
            <div style={{
              marginTop: '12px', fontFamily: 'JetBrains Mono',
              fontSize: '11px', color: '#f87171', textAlign: 'center',
            }}>
              error: failed to send — check Django is running on port 8080
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Contact