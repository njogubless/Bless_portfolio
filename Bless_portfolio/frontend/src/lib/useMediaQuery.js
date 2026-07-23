import { useEffect, useState } from 'react'

/**
 * Tracks a CSS media query in JS, for the rare cases where markup (not
 * just styling) needs to change between breakpoints — e.g. swapping a
 * horizontal desktop nav for a mobile menu button.
 *
 * This replaces the `window.innerWidth` + `resize` listener pattern used
 * throughout the previous codebase (Hero.jsx, Work.jsx), which re-renders
 * on every pixel of a resize and misses zoom/devtools-driven changes.
 * `matchMedia` only fires when the query's truthiness actually flips.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
