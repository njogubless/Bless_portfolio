import { cx } from '../../lib/utils'
import styles from './Badge.module.css'

const TONES = ['neutral', 'accent', 'blue', 'green']

/** Small pill used for tech-stack tags, status labels, and filter chips. */
export default function Badge({ tone = 'neutral', as: Tag = 'span', className, children, ...rest }) {
  const safeTone = TONES.includes(tone) ? tone : 'neutral'
  return (
    <Tag className={cx(styles.badge, styles[safeTone], className)} {...rest}>
      {children}
    </Tag>
  )
}
