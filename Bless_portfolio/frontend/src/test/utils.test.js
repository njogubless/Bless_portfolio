import { describe, it, expect } from 'vitest'
import { formatDate, validateContactForm, cx } from '../lib/utils'

describe('formatDate', () => {
  it('formats an ISO date as a long-form date', () => {
    expect(formatDate('2026-03-10')).toBe('March 10, 2026')
  })

  it('returns an empty string for missing input', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('falls back to the raw string for unparsable input', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('validateContactForm', () => {
  const valid = { name: 'Jane Doe', email: 'jane@example.com', subject: 'Hello', body: 'This is a real message.' }

  it('returns no errors for a fully valid submission', () => {
    expect(validateContactForm(valid)).toEqual({})
  })

  it('flags a missing name', () => {
    const errors = validateContactForm({ ...valid, name: '  ' })
    expect(errors.name).toBeTruthy()
  })

  it('flags an invalid email address', () => {
    const errors = validateContactForm({ ...valid, email: 'not-an-email' })
    expect(errors.email).toBeTruthy()
  })

  it('flags a message that is too short', () => {
    const errors = validateContactForm({ ...valid, body: 'short' })
    expect(errors.body).toBeTruthy()
  })

  it('flags a missing subject', () => {
    const errors = validateContactForm({ ...valid, subject: '' })
    expect(errors.subject).toBeTruthy()
  })
})

describe('cx', () => {
  it('joins truthy class names and skips falsy ones', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })
})
