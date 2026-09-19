/**
 * A deliberately small YAML-subset parser for markdown frontmatter.
 *
 * Why not js-yaml: the only consumer is ~24 static files whose frontmatter
 * uses five shapes. Shipping a full YAML engine to the browser to read them
 * costs more than it's worth. The trade is that this parser must *refuse*
 * anything it doesn't understand rather than guess — a silent mis-parse
 * would put wrong metadata on a live page, which is far worse than a build
 * that stops. Every unsupported construct throws.
 *
 * Supported:
 *   key: plain scalar          key: 42          key: true
 *   key: "double quoted"       key: 'single quoted'
 *   key: [a, b, c]             (inline list, optionally quoted items)
 *   key: >-                    (folded block — newlines become spaces)
 *     wrapped text
 *   key: |-                    (literal block — newlines preserved)
 *     line one
 */

const DELIMITER = '---'

export class FrontmatterError extends Error {
  constructor(message, source) {
    super(source ? `${message} (in ${source})` : message)
    this.name = 'FrontmatterError'
    this.source = source
  }
}

/** Unescape a double-quoted scalar. Single quotes use YAML's '' doubling. */
function parseQuoted(raw, source) {
  const quote = raw[0]
  if (raw.length < 2 || raw[raw.length - 1] !== quote) {
    throw new FrontmatterError(`Unterminated quoted value: ${raw}`, source)
  }
  const inner = raw.slice(1, -1)
  if (quote === "'") return inner.replace(/''/g, "'")
  return inner.replace(/\\(["\\nt])/g, (_, ch) =>
    ch === 'n' ? '\n' : ch === 't' ? '\t' : ch
  )
}

function parseScalar(raw, source) {
  const value = raw.trim()
  if (value === '') return ''
  if (value[0] === '"' || value[0] === "'") return parseQuoted(value, source)
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  // A bare scalar must not contain YAML structure we aren't parsing. Quoting
  // is cheap; guessing is not.
  if (/(^[[{>|*&!%@`])|(:\s)|(\s#)/.test(value)) {
    throw new FrontmatterError(
      `Ambiguous unquoted value "${value}" — wrap it in quotes`,
      source
    )
  }
  return value
}

function parseInlineList(raw, source) {
  const inner = raw.slice(1, -1).trim()
  if (inner === '') return []
  return inner.split(',').map((item) => parseScalar(item, source))
}

/**
 * Split a document into its frontmatter block and body.
 * Returns `{ data: null, body }` when the file has no frontmatter at all —
 * that is how an internal doc opts out of being published as an article.
 */
export function parseFrontmatter(raw, source) {
  const text = raw.replace(/^\uFEFF/, '')
  if (!text.startsWith(`${DELIMITER}\n`)) return { data: null, body: text }

  const lines = text.split('\n')
  const end = lines.indexOf(DELIMITER, 1)
  if (end === -1) {
    throw new FrontmatterError('Frontmatter block is never closed with "---"', source)
  }

  const data = {}
  let i = 1
  while (i < end) {
    const line = lines[i]
    if (line.trim() === '' || line.trimStart().startsWith('#')) { i++; continue }

    const match = /^([A-Za-z_][\w-]*):(.*)$/.exec(line)
    if (!match) {
      throw new FrontmatterError(`Cannot parse frontmatter line: ${line}`, source)
    }
    const [, key, rest] = match
    if (key in data) {
      throw new FrontmatterError(`Duplicate frontmatter key "${key}"`, source)
    }
    const value = rest.trim()

    if (value === '>' || value === '>-' || value === '|' || value === '|-') {
      // Block scalar: consume every following line that is more indented.
      const block = []
      i++
      while (i < end && (lines[i].trim() === '' || /^\s/.test(lines[i]))) {
        block.push(lines[i].trim() === '' ? '' : lines[i].replace(/^\s+/, ''))
        i++
      }
      while (block.length && block[block.length - 1] === '') block.pop()
      const folded = value[0] === '>'
      data[key] = folded ? block.join(' ').replace(/\s+/g, ' ').trim() : block.join('\n')
      continue
    }

    if (value.startsWith('[')) {
      if (!value.endsWith(']')) {
        throw new FrontmatterError(`Multi-line lists are not supported: ${key}`, source)
      }
      data[key] = parseInlineList(value, source)
    } else if (value === '') {
      throw new FrontmatterError(
        `Empty value for "${key}" — block lists ("- item") are not supported, use [a, b]`,
        source
      )
    } else {
      data[key] = parseScalar(value, source)
    }
    i++
  }

  return { data, body: lines.slice(end + 1).join('\n') }
}
