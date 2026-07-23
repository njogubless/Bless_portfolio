import { useId, useState } from 'react'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import profile from '../lib/data/profile'
import { validateContactForm } from '../lib/utils'
import styles from './Contact.module.css'

// Configurable per environment (see .env.example) instead of hardcoded,
// so the same build works against local Django, staging, and prod
// without a code change.
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.paulnjogu.com'
const CONTACT_ENDPOINT = `${API_BASE}/api/contact/`

const initialForm = { name: '', email: '', subject: '', body: '', company: '' }

function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})
  const idPrefix = useId()

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: a field real users never see or fill in. Bots that
    // auto-fill every input on the page will trip it. This is a cheap
    // first line of defense — see the audit report for the case for
    // adding real server-side rate limiting too.
    if (form.company) {
      setStatus('success')
      setForm(initialForm)
      return
    }

    const validation = validateContactForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setStatus('sending')

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, body: form.body }),
      })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      console.error('Contact form submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <>
      <SEO
        path="/contact"
        title="Contact"
        description="Get in touch about freelance work, full-time roles, or collaborations."
      />

      <Container narrow as="section" className={styles.wrap}>
        <Reveal>
          <span className={styles.eyebrow}>Get in touch</span>
          <h1 className={styles.title}>Let's build something.</h1>
          <p className={styles.lead}>
            Available for freelance, full-time, or collabs — I usually reply within 24 hours. You can also reach me
            directly at{' '}
            <a href={`mailto:${profile.email}`} className={styles.inlineLink}>{profile.email}</a>.
          </p>
        </Reveal>

        <Reveal>
          <Card as="section" className={styles.card}>
            {status === 'success' ? (
              <div className={styles.success} role="status">
                <p className={styles.successTitle}>✓ Message sent</p>
                <p className={styles.successBody}>Thanks for reaching out — I'll get back to you soon.</p>
                <Button variant="secondary" size="sm" onClick={() => setStatus('idle')}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <Field id={`${idPrefix}-name`} label="Name" error={errors.name}>
                    <input
                      id={`${idPrefix}-name`}
                      className={styles.input}
                      value={form.name}
                      onChange={handleChange('name')}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
                    />
                  </Field>
                  <Field id={`${idPrefix}-email`} label="Email" error={errors.email}>
                    <input
                      id={`${idPrefix}-email`}
                      type="email"
                      className={styles.input}
                      value={form.email}
                      onChange={handleChange('email')}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
                    />
                  </Field>
                </div>

                <Field id={`${idPrefix}-subject`} label="Subject" error={errors.subject}>
                  <input
                    id={`${idPrefix}-subject`}
                    className={styles.input}
                    value={form.subject}
                    onChange={handleChange('subject')}
                    placeholder="Freelance project / job opportunity / collab"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? `${idPrefix}-subject-error` : undefined}
                  />
                </Field>

                <Field id={`${idPrefix}-body`} label="Message" error={errors.body}>
                  <textarea
                    id={`${idPrefix}-body`}
                    className={styles.textarea}
                    rows={5}
                    value={form.body}
                    onChange={handleChange('body')}
                    placeholder="Tell me about the project or opportunity…"
                    aria-invalid={Boolean(errors.body)}
                    aria-describedby={errors.body ? `${idPrefix}-body-error` : undefined}
                  />
                </Field>

                {/* Honeypot — hidden from sighted and screen-reader users, visible to bots */}
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor={`${idPrefix}-company`}>Company</label>
                  <input
                    id={`${idPrefix}-company`}
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={handleChange('company')}
                  />
                </div>

                <Button type="submit" disabled={status === 'sending'} className={styles.submit}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </Button>

                {status === 'error' && (
                  <p className={styles.formError} role="alert">
                    Something went wrong sending that — please try again, or email me directly at{' '}
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                  </p>
                )}
              </form>
            )}
          </Card>
        </Reveal>
      </Container>
    </>
  )
}
