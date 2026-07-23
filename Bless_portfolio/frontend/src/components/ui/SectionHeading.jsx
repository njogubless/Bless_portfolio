import { cx } from '../../lib/utils'
import styles from './SectionHeading.module.css'

/**
 * Editorial-style numbered section header, e.g. "02 — Selected work".
 * Used at the top of every major page section for a consistent rhythm.
 */
export default function SectionHeading({ index, eyebrow, title, description, className }) {
  return (
    <div className={cx(styles.wrap, className)}>
      <div className={styles.meta}>
        {index != null && <span className={styles.index}>{String(index).padStart(2, '0')}</span>}
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      </div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
