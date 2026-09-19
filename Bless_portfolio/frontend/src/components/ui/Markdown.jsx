import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'

/**
 * Renders article markdown.
 *
 * The custom anchor exists because post bodies cross-reference each other
 * with site-absolute links (series indexes link to every part). Left as
 * plain <a>, each of those triggers a full document reload and throws away
 * the SPA — so internal hrefs go through react-router instead, and external
 * ones get the usual noopener treatment.
 */
const components = {
  a({ href = '', children, ...props }) {
    if (href.startsWith('/') && !href.startsWith('//')) {
      return <Link to={href} {...props}>{children}</Link>
    }
    const isExternal = /^https?:\/\//i.test(href)
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  },
}

export default function Markdown({ children, className }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
