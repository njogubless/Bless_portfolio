import { useEffect } from 'react'

const SITE_NAME = 'Paul Njogu'
const BASE_URL = 'https://paulnjogu.com'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Lightweight per-page SEO without pulling in react-helmet: updates
 * document.title and the description/OG/canonical tags on route change.
 * Static <meta> defaults already live in index.html for the first paint
 * (important for crawlers that don't execute JS); this only overrides
 * them per-route.
 */
export default function SEO({ title, description, path = '' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Flutter & Python Developer`
    document.title = fullTitle

    setMeta('description', description)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', `${BASE_URL}${path}`, 'property')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `${BASE_URL}${path}`)
  }, [title, description, path])

  return null
}
