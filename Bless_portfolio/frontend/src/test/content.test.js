import { describe, it, expect } from 'vitest'
import { parseFrontmatter, FrontmatterError } from '../lib/content/frontmatter'
import { field, validate, SchemaError } from '../lib/content/schema'
import { readingTime, rewriteInternalLinks, stripLeadingHeading } from '../lib/content/markdown'
import {
  getAllPosts,
  getAllSeries,
  getCategories,
  getNextPost,
  getPostBySlug,
  getPostsByCategory,
  getRecentPosts,
  getSeries,
  getSeriesNavigation,
} from '../lib/content/posts'

describe('parseFrontmatter', () => {
  it('parses scalars, inline lists and folded blocks', () => {
    const { data, body } = parseFrontmatter(
      [
        '---',
        'slug: a-post',
        'title: "A: title with a colon"',
        'excerpt: >-',
        '  folded across',
        '  two lines',
        'tags: [one, two]',
        'part: 3',
        'draft: false',
        '---',
        'Body text.',
      ].join('\n')
    )
    expect(data).toEqual({
      slug: 'a-post',
      title: 'A: title with a colon',
      excerpt: 'folded across two lines',
      tags: ['one', 'two'],
      part: 3,
      draft: false,
    })
    expect(body.trim()).toBe('Body text.')
  })

  it('preserves newlines in a literal block', () => {
    const { data } = parseFrontmatter('---\nnote: |-\n  one\n  two\n---\n')
    expect(data.note).toBe('one\ntwo')
  })

  it('treats a file with no frontmatter as unpublished', () => {
    const { data, body } = parseFrontmatter('# Just a doc\n')
    expect(data).toBeNull()
    expect(body).toBe('# Just a doc\n')
  })

  it('throws rather than guessing at an ambiguous unquoted value', () => {
    expect(() => parseFrontmatter('---\ntitle: Schema: truth\n---\n', 'x.md')).toThrow(FrontmatterError)
  })

  it('throws on an unclosed block and on duplicate keys', () => {
    expect(() => parseFrontmatter('---\nslug: a\n')).toThrow(/never closed/)
    expect(() => parseFrontmatter('---\nslug: a\nslug: b\n---\n')).toThrow(/Duplicate/)
  })
})

describe('validate', () => {
  const schema = { slug: field.slug(), date: field.date(), part: field.number().optional() }

  it('accepts valid data and drops nothing declared', () => {
    expect(validate(schema, { slug: 'ok-slug', date: '2026-06-05' })).toEqual({
      slug: 'ok-slug',
      date: '2026-06-05',
    })
  })

  it('names the offending file and field', () => {
    expect(() => validate(schema, { slug: 'Bad Slug', date: '2026-06-05' }, 'p.md')).toThrow(
      /"slug".*hyphenated slug.*p\.md/s
    )
  })

  it('rejects a value outside a closed set', () => {
    const closed = { category: field.oneOf(['backend', 'mobile']) }
    expect(() => validate(closed, { category: 'backendd' }, 'p.md')).toThrow(
      /"category" must be one of: backend, mobile/
    )
    expect(validate(closed, { category: 'mobile' })).toEqual({ category: 'mobile' })
  })

  it('rejects missing required fields, bad dates and unknown keys', () => {
    expect(() => validate(schema, { date: '2026-06-05' })).toThrow(SchemaError)
    expect(() => validate(schema, { slug: 'a', date: '2026-13-40' })).toThrow(/not a real calendar date/)
    expect(() => validate(schema, { slug: 'a', date: '2026-06-05', catagory: 'x' })).toThrow(/unknown/)
  })
})

describe('markdown transforms', () => {
  it('strips only the leading H1', () => {
    expect(stripLeadingHeading('# Title\n\nBody\n\n## Keep me\n')).toBe('Body\n\n## Keep me\n')
  })

  it('derives reading time from word count', () => {
    expect(readingTime(Array(400).fill('word').join(' '))).toBe('2 min read')
    expect(readingTime('short')).toBe('1 min read')
  })

  it('rewrites relative .md links to routes, preserving anchors', () => {
    const routes = new Map([['/docs/s/02-next.md', '/blog/next-part']])
    const out = rewriteInternalLinks(
      '[Next](02-next.md) and [deep](02-next.md#section)',
      '/docs/s/01-first.md',
      routes
    )
    expect(out).toBe('[Next](/blog/next-part) and [deep](/blog/next-part#section)')
  })

  it('leaves external and already-absolute links alone', () => {
    const body = '[ext](https://example.com/a.md) [abs](/blog/x)'
    expect(rewriteInternalLinks(body, '/docs/s/a.md', new Map())).toBe(body)
  })

  it('throws on a relative link to an unpublished file', () => {
    expect(() => rewriteInternalLinks('[x](nope.md)', '/docs/s/a.md', new Map())).toThrow(/Broken internal link/)
  })
})

describe('the posts collection', () => {
  const posts = getAllPosts()

  it('loads every article from docs/', () => {
    expect(posts.length).toBe(24)
  })

  it('sorts newest first', () => {
    const dates = posts.map((p) => p.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })

  it('gives every post the fields the pages render', () => {
    for (const post of posts) {
      expect(post.title, post.sourcePath).toBeTruthy()
      expect(post.excerpt, post.sourcePath).toBeTruthy()
      expect(post.content.length, post.sourcePath).toBeGreaterThan(50)
      expect(post.route, post.sourcePath).toBe(`/blog/${post.slug}`)
      expect(post.readingTime, post.sourcePath).toMatch(/^\d+ min read$/)
    }
  })

  it('leaves no unrewritten relative markdown link in any body', () => {
    for (const post of posts) {
      expect(post.content, post.sourcePath).not.toMatch(/\]\((?!https?:|\/|#)[^)]*\.md[^)]*\)/)
    }
  })

  it('strips the standalone H1 so the title is not rendered twice', () => {
    for (const post of posts) {
      expect(post.content.startsWith('# '), post.sourcePath).toBe(false)
    }
  })

  it('derives categories from content instead of a hardcoded list', () => {
    expect(getCategories()).toEqual(['backend', 'career', 'infrastructure', 'mobile'])
  })

  it('looks posts up by slug', () => {
    expect(getPostBySlug('changa-schema-truth')?.category).toBe('backend')
    expect(getPostBySlug('does-not-exist')).toBeUndefined()
  })

  it('filters by category, with "all" as a passthrough', () => {
    expect(getPostsByCategory('all')).toEqual(posts)
    expect(getPostsByCategory('mobile').every((p) => p.category === 'mobile')).toBe(true)
  })

  it('returns the most recent posts for the homepage', () => {
    expect(getRecentPosts(3)).toEqual(posts.slice(0, 3))
  })
})

describe('series', () => {
  it('groups an index with its parts in reading order', () => {
    const series = getSeries('hardening-the-reconciliation-worker')
    expect(series.index.slug).toBe('hardening-the-reconciliation-worker')
    expect(series.parts.map((p) => p.part)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('numbers every series contiguously from 1', () => {
    for (const series of getAllSeries()) {
      expect(series.index, `series "${series.id}" has no index post`).toBeTruthy()
      expect(series.parts.map((p) => p.part), series.id).toEqual(
        series.parts.map((_, i) => i + 1)
      )
    }
  })

  it('finds both series in the collection', () => {
    expect(getAllSeries().map((s) => s.id).sort()).toEqual([
      'changa-engineering-log',
      'hardening-the-reconciliation-worker',
    ])
  })

  it('navigates by part number, not publication date', () => {
    const part1 = getPostBySlug('dlq-delivery-semantics-poison-pills')
    const nav = getSeriesNavigation(part1)
    expect(nav.part).toBe(1)
    expect(nav.total).toBe(7)
    expect(nav.previous.slug).toBe('hardening-the-reconciliation-worker')
    expect(nav.next.slug).toBe('dlq-retry-policy-idempotency')
  })

  it('sends a reader from a series index into part one', () => {
    const index = getPostBySlug('hardening-the-reconciliation-worker')
    expect(getNextPost(index).slug).toBe('dlq-delivery-semantics-poison-pills')
  })

  it('offers the next part rather than the next post by date', () => {
    expect(getNextPost(getPostBySlug('dlq-retry-policy-idempotency')).slug).toBe(
      'dlq-building-the-dead-letter-queue'
    )
  })

  it('falls back to date order outside a series and at a series end', () => {
    const standalone = getPostBySlug('kubernetes-for-solo-devs')
    expect(getSeriesNavigation(standalone)).toBeNull()
    expect(getNextPost(standalone)).toBeTruthy()
    expect(getNextPost(getPostBySlug('dlq-reconciliation-business-exceptions'))).toBeTruthy()
  })
})
