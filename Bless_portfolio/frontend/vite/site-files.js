import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontmatter } from '../src/lib/content/frontmatter.js'
import { SITE_URL } from '../src/lib/site.js'

/** Every markdown file under a directory, recursively. */
function markdownFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return markdownFiles(full)
    return full.endsWith('.md') ? [full] : []
  })
}

/**
 * Published article routes, read straight from docs/.
 *
 * Uses the same rule the app uses — a file is an article if it has
 * frontmatter — so the sitemap cannot disagree with what the site serves.
 * README.md and docs/architecture/ have no frontmatter and drop out on
 * their own, with no exclusion list to keep in step.
 */
function articleRoutes(docsDir) {
  return markdownFiles(docsDir)
    .map((file) => parseFrontmatter(readFileSync(file, 'utf8'), file).data)
    .filter((data) => data && data.slug)
    .map((data) => ({ path: `/blog/${data.slug}`, priority: '0.6', lastmod: data.date }))
    .sort((a, b) => a.path.localeCompare(b.path))
}

const STATIC_ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/work', priority: '0.9' },
  { path: '/about', priority: '0.8' },
  { path: '/blog', priority: '0.7' },
  { path: '/contact', priority: '0.6' },
]

/**
 * Substitutes %SITE_URL% into index.html and generates sitemap.xml and
 * robots.txt at build time.
 *
 * These were previously static files in public/ carrying a hardcoded
 * domain, and the sitemap listed five URLs while the site had 29 — none of
 * the articles were discoverable by search.
 */
export default function siteFiles({ docsDir }) {
  return {
    name: 'site-files',

    // `order: 'pre'` matters. Vite's own HTML plugin parses href/src
    // attributes and runs decodeURI over them; it must see a real absolute
    // URL, not a placeholder. (A %…% token fails outright — "%SI" reads as
    // a malformed percent-escape and the build dies.)
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    },

    generateBundle() {
      const routes = [...STATIC_ROUTES, ...articleRoutes(docsDir)]
      const urls = routes
        .map(({ path, priority, lastmod }) =>
          `  <url><loc>${SITE_URL}${path}</loc>` +
          (lastmod ? `<lastmod>${lastmod}</lastmod>` : '') +
          `<priority>${priority}</priority></url>`
        )
        .join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
    },
  }
}
