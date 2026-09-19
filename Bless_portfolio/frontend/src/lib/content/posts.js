import { defineCollection } from './collection'
import { field } from './schema'
import { readingTime, rewriteInternalLinks, stripLeadingHeading } from './markdown'

/**
 * The blog collection.
 *
 * Articles live as markdown files under `docs/`, one file per article, and
 * are discovered by this glob — adding a post means adding a file, with no
 * registry to update. The same files are the repo's own documentation, so
 * there is exactly one copy of every article's prose.
 *
 * Bodies are bundled eagerly. At ~24 posts that is a few tens of kB gzipped
 * on a route that is already code-split, and it keeps the loader to one
 * line. If the corpus grows enough to matter, only this glob changes —
 * pages call functions, never an array, so nothing below has to move.
 */
const sources = import.meta.glob('/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const ROUTE_PREFIX = '/blog'

/**
 * Categories an article may declare.
 *
 * A closed set rather than a free string: a typo like `backendd` would
 * otherwise sail through validation and show up as a filter chip matching
 * exactly one post. Mirrors BlogPost.CATEGORY_CHOICES in the Django API.
 * To add a category, add it here — the error message says so.
 */
const CATEGORIES = ['backend', 'career', 'frontend', 'infrastructure', 'mobile']

const schema = {
  slug: field.slug(),
  title: field.string(),
  excerpt: field.string(),
  category: field.oneOf(CATEGORIES),
  date: field.date(),
  tags: field.list(),
  // Present on both a series index and its parts; `part` is what tells them
  // apart. An index carries the series id but no part number.
  series: field.slug().optional(),
  part: field.number().optional(),
}

const routeOf = (slug) => `${ROUTE_PREFIX}/${slug}`

const posts = defineCollection({
  name: 'posts',
  sources,
  schema,
  sort: (a, b) => new Date(b.date) - new Date(a.date),
  transform: ({ path, data, body }, all) => {
    const routeFor = new Map(all.map((entry) => [entry.path, routeOf(entry.data.slug)]))
    const content = rewriteInternalLinks(stripLeadingHeading(body), path, routeFor).trim()

    if (data.part != null && !data.series) {
      throw new Error(`"${data.slug}" has a part number but no series (in ${path})`)
    }

    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      date: data.date,
      tags: data.tags,
      content,
      readingTime: readingTime(content),
      route: routeOf(data.slug),
      sourcePath: path,
      series: data.series ?? null,
      part: data.part ?? null,
    }
  },
})

/** Every published post, newest first. */
export const getAllPosts = () => posts.all()

/** One post by slug, or undefined if there is no such post. */
export const getPostBySlug = (slug) => posts.get(slug)

/** Posts in a category, newest first. */
export const getPostsByCategory = (category) =>
  category === 'all' ? posts.all() : posts.filter((post) => post.category === category)

/** The n most recent posts — what the homepage lists. */
export const getRecentPosts = (limit) => posts.all().slice(0, limit)

/**
 * Categories that actually have posts, alphabetically.
 *
 * Derived from the content rather than hand-listed: the previous hardcoded
 * array had to be edited in step with the posts and could silently offer a
 * filter that matched nothing. `CATEGORIES` bounds what may be written;
 * this bounds what is offered.
 */
export const getCategories = () => posts.distinct('category').sort()

/** Every tag used across the collection, alphabetically. */
export const getAllTags = () =>
  [...new Set(posts.all().flatMap((post) => post.tags))].sort()

/**
 * A series as a whole: its index post and its parts in reading order.
 * Returns null for an id that names no series.
 */
export function getSeries(id) {
  if (!id) return null
  const members = posts.filter((post) => post.series === id)
  if (members.length === 0) return null

  const index = members.find((post) => post.part == null) ?? null
  const parts = members
    .filter((post) => post.part != null)
    .sort((a, b) => a.part - b.part)

  return { id, title: index?.title ?? id, index, parts }
}

/** Every series in the collection, newest index first. */
export const getAllSeries = () =>
  posts
    .distinct('series')
    .map(getSeries)
    .filter(Boolean)

/**
 * Where a post sits in its series, and what comes either side.
 *
 * Reading order is the part number, not the publication date. The index of
 * a series is typically published last (it summarises the finished set), so
 * sorting by date walks a series backwards.
 */
export function getSeriesNavigation(post) {
  const series = getSeries(post?.series)
  if (!series) return null

  const isIndex = post.part == null
  const position = isIndex ? 0 : series.parts.findIndex((p) => p.slug === post.slug)

  return {
    series,
    part: isIndex ? null : position + 1,
    total: series.parts.length,
    previous: isIndex ? null : position === 0 ? series.index : series.parts[position - 1],
    next: isIndex ? (series.parts[0] ?? null) : (series.parts[position + 1] ?? null),
  }
}

/**
 * The post to offer a reader next.
 *
 * Series order wins where it applies — finishing Part 1 should lead to Part
 * 2, not to whatever happened to be published next. Outside a series (or at
 * the end of one) it falls back to the next post by date, wrapping around.
 */
export function getNextPost(post) {
  const navigation = getSeriesNavigation(post)
  if (navigation?.next) return navigation.next

  const all = posts.all()
  const index = all.findIndex((candidate) => candidate.slug === post.slug)
  return all[(index + 1) % all.length]
}
