import { useEffect, useRef, useState } from 'react'
import { cx } from '../../lib/utils'

/**
 * Fades/slides children into view the first time they scroll into the
 * viewport, using IntersectionObserver rather than a scroll listener
 * (cheaper, and doesn't run on the main thread on every scroll tick).
 *
 * Deliberately dependency-free: the previous design used inline
 * `<style>` blocks with @keyframes duplicated in five different
 * components for essentially decorative blinking-cursor effects. This
 * is the one motion primitive the whole app shares.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={cx('reveal', visible && 'is-visible', className)}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
