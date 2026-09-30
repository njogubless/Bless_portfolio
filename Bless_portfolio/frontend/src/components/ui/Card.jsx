import { forwardRef } from 'react'
import { cx } from '../../lib/utils'
import styles from './Card.module.css'

/**
 * Base surface used for project cards, timeline entries, and form panels.
 *
 * Forwards its ref because <Reveal as={Card}> needs to observe the real DOM
 * node. React strips `ref` from the props object for a plain function
 * component, so without forwardRef the observer never attached, `visible`
 * never flipped, and every Card rendered through Reveal stayed at
 * opacity: 0 — the whole About page was invisible below the intro.
 */
const Card = forwardRef(function Card(
  { as: Tag = 'div', interactive = false, accent, className, children, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cx(styles.card, interactive && styles.interactive, className)}
      style={accent ? { '--card-accent': `var(--color-${accent})` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default Card
