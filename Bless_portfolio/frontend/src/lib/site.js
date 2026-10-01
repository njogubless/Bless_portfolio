/**
 * Canonical identity of the deployed site.
 *
 * One literal, imported by everything that needs it: the SEO component at
 * runtime, and vite.config.js at build time for index.html, sitemap.xml and
 * robots.txt. Previously the domain was hardcoded in five places and all
 * five pointed at paulnjogu.com, which does not resolve — every page
 * declared a canonical URL for a site that does not exist, which tells
 * search engines to ignore the pages that do.
 *
 * Moving to a custom domain is a one-line change here.
 *
 * Kept free of Vite-only syntax (no import.meta.glob) so Node can import it
 * directly from the build config.
 */
export const SITE_URL = 'https://bless-portfolio-nine.vercel.app'

export const SITE_NAME = 'Paul Njogu'
