/**
 * Small, dependency-free helpers shared across components. Kept pure and
 * framework-agnostic on purpose — this is what gets unit tested in
 * src/test, since pure functions are cheap to test and refactor safely.
 */

/** Combine class names, skipping falsy values. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

/** Format an ISO date string ("2026-03-10") as "March 10, 2026". */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return dateFormatter.format(date)
}

/**
 * Validate the contact form. Returns a map of field -> error message;
 * an empty object means the form is valid. Pulled out of Contact.jsx so
 * the validation rules can be unit tested without rendering the form.
 */
export function validateContactForm(values) {
  const errors = {}
  if (!values.name || !values.name.trim()) errors.name = 'Name is required.'
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.subject || !values.subject.trim()) errors.subject = 'Subject is required.'
  if (!values.body || values.body.trim().length < 10) {
    errors.body = 'Message should be at least 10 characters.'
  }
  return errors
}

/** True while running in a browser (guards against SSR/build-time access to window). */
export const isBrowser = typeof window !== 'undefined'
