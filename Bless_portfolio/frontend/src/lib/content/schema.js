/**
 * Field validators for content frontmatter.
 *
 * The point of this layer is *when* errors surface. Frontmatter is authored
 * by hand in markdown files, so a typo ("catagory") or a missing excerpt is
 * a matter of time. Validating at module load turns those into a build-time
 * failure naming the file and the field, instead of `undefined` rendering
 * into a live page or an empty <meta description>.
 */

export class SchemaError extends Error {
  constructor(message, source) {
    super(source ? `${message} (in ${source})` : message)
    this.name = 'SchemaError'
    this.source = source
  }
}

const define = (name, check) => ({ name, check, required: true, optional() {
  return { ...this, required: false }
} })

export const field = {
  string: () => define('string', (v) => {
    if (typeof v !== 'string' || v.trim() === '') return 'must be a non-empty string'
    return v
  }),

  /** A URL-safe identifier: lowercase letters, digits and single hyphens. */
  slug: () => define('slug', (v) => {
    if (typeof v !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)) {
      return 'must be a lowercase hyphenated slug, e.g. "my-post-title"'
    }
    return v
  }),

  /** An ISO calendar date. Kept as a string — no timezone surprises. */
  date: () => define('date', (v) => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'must be an ISO date, e.g. 2026-06-05'
    if (Number.isNaN(new Date(`${v}T00:00:00`).getTime())) return 'is not a real calendar date'
    return v
  }),

  number: () => define('number', (v) => (typeof v === 'number' ? v : 'must be a number')),

  list: (item = field.string()) => define('list', (v, source) => {
    if (!Array.isArray(v)) return 'must be a list, e.g. [a, b, c]'
    return v.map((entry) => {
      const result = item.check(entry, source)
      if (typeof result === 'string' && result !== entry) {
        throw new SchemaError(`list item "${entry}" ${result}`, source)
      }
      return result
    })
  }),

  oneOf: (allowed) => define('oneOf', (v) =>
    allowed.includes(v) ? v : `must be one of: ${allowed.join(', ')}`
  ),
}

/**
 * Validate `data` against `schema`, returning a new object containing only
 * the declared fields. Unknown keys are rejected — a stray key is nearly
 * always a typo in a key that was meant to do something.
 */
export function validate(schema, data, source) {
  if (!data) throw new SchemaError('missing frontmatter block', source)

  const result = {}
  for (const [key, validator] of Object.entries(schema)) {
    const value = data[key]
    if (value === undefined || value === null) {
      if (validator.required) throw new SchemaError(`"${key}" is required`, source)
      continue
    }
    const checked = validator.check(value, source)
    if (typeof checked === 'string' && checked !== value) {
      throw new SchemaError(`"${key}" ${checked}`, source)
    }
    result[key] = checked
  }

  const unknown = Object.keys(data).filter((key) => !(key in schema))
  if (unknown.length) {
    throw new SchemaError(`unknown frontmatter key(s): ${unknown.join(', ')}`, source)
  }
  return result
}
