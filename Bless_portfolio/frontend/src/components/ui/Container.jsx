import { cx } from '../../lib/utils'
import styles from './Container.module.css'

/** Consistent max-width + horizontal padding wrapper used by every section. */
export default function Container({ as: Tag = 'div', narrow = false, className, children, ...rest }) {
  return (
    <Tag className={cx(styles.container, narrow && styles.narrow, className)} {...rest}>
      {children}
    </Tag>
  )
}
