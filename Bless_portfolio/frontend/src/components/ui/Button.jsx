import { forwardRef } from 'react'
import { cx } from '../../lib/utils'
import styles from './Button.module.css'

/**
 * Renders a <button> or, when `href` is passed, an <a> — so call sites
 * don't have to remember which element a given action needs, and we
 * never end up with a <div onClick> (inaccessible, no keyboard support).
 */
const Button = forwardRef(function Button(
  { as, href, variant = 'primary', size = 'md', className, children, ...rest },
  ref
) {
  const classes = cx(styles.button, styles[variant], styles[size], className)

  if (href) {
    const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:')
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const Tag = as || 'button'
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  )
})

export default Button
