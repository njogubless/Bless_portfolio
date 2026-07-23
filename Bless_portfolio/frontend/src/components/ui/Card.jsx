import { cx } from '../../lib/utils'
import styles from './Card.module.css'

/** Base surface used for project cards, timeline entries, and form panels. */
export default function Card({ as: Tag = 'div', interactive = false, accent, className, children, ...rest }) {
  return (
    <Tag
      className={cx(styles.card, interactive && styles.interactive, className)}
      style={accent ? { '--card-accent': `var(--color-${accent})` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
