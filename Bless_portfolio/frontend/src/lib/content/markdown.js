/**
 * Markdown transforms applied to a document as it is loaded.
 *
 * These exist because one markdown file serves two readers with different
 * needs: someone browsing the repo on GitHub, and someone reading the
 * published site. Rather than keep two copies of the prose in sync by hand
 * (which is exactly what this refactor removed), the file is authored for
 * GitHub and adapted for the site here.
 */

/** Average adult reading speed for technical prose. */
const WORDS_PER_MINUTE = 200

/**
 * Drop the leading `# Heading` from a body.
 *
 * Every doc opens with an H1 so it reads standalone on GitHub, but the post
 * page already renders the title from frontmatter — without this the title
 * would appear twice, at two different sizes.
 */
export function stripLeadingHeading(body) {
  return body.replace(/^\s*#\s+.*(\r?\n)+/, '')
}

/**
 * Estimate reading time from word count.
 *
 * Previously this was typed by hand per post and had drifted badly — a
 * 117-word note claimed "5 min read". Deriving it means it cannot be wrong.
 */
export function readingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`
}

/** Resolve a relative href against the directory of `fromPath`. */
function resolvePath(fromPath, href) {
  const segments = fromPath.split('/').slice(0, -1)
  for (const part of href.split('/')) {
    if (part === '.' || part === '') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }
  return segments.join('/')
}

// Matches the target of a markdown inline link: `](target)`.
const LINK_TARGET = /\]\(([^)\s]+)\)/g

/**
 * Rewrite relative links to sibling markdown files into site routes.
 *
 * `[Part 2](02-retry-policy.md)` works on GitHub but 404s on the site;
 * `/blog/dlq-retry-policy-idempotency` is the reverse. Authors write the
 * GitHub form and this converts it, resolving through `routeFor` — a map
 * from document path to route.
 *
 * A relative `.md` link with no known route throws: a broken cross-reference
 * becomes a build failure rather than a dead link a reader finds first.
 */
export function rewriteInternalLinks(body, fromPath, routeFor) {
  return body.replace(LINK_TARGET, (match, target) => {
    if (!target.endsWith('.md') && !target.includes('.md#')) return match
    if (/^([a-z]+:)?\/\//i.test(target) || target.startsWith('/')) return match

    const [path, hash] = target.split('#')
    const resolved = resolvePath(fromPath, path)
    const route = routeFor.get(resolved)
    if (!route) {
      throw new Error(
        `Broken internal link "${target}" in ${fromPath} — ` +
          `resolves to ${resolved}, which is not a published article`
      )
    }
    return `](${route}${hash ? `#${hash}` : ''})`
  })
}
