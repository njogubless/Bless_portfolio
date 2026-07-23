import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  // index.html sets data-theme on <html> before React mounts (see the
  // inline script there) so there is no flash-of-wrong-theme. We just
  // read it back here to sync React state.
  return document.documentElement.getAttribute('data-theme') || 'light'
}

/** Reads/writes the light/dark theme, persisted in localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage can throw in private-browsing/blocked-storage modes;
      // the app still works, it just won't remember the preference.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme }
}
