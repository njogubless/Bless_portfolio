import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import Badge from '../components/ui/Badge'
import { formatDate } from '../lib/utils'
import posts from '../lib/data/posts'
import styles from './BlogPost.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  // Redirect to a real 404 instead of rendering a blank page for a bad
  // or stale slug (e.g. an old bookmark, or a typo in a shared link).
  if (!post) return <Navigate to="/blog" replace />

  const index = posts.findIndex((p) => p.slug === slug)
  const next = posts[(index + 1) % posts.length]

  return (
    <>
      <SEO path={`/blog/${post.slug}`} title={post.title} description={post.excerpt} />

      <Container as="article" narrow className={styles.wrap}>
        <Reveal>
          <Link to="/blog" className={styles.back}>← All posts</Link>

          <div className={styles.meta}>
            <Badge tone="accent">{post.category}</Badge>
            <span className={styles.date}>{formatDate(post.createdAt)}</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span className={styles.readingTime}>{post.readingTime}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>

          <ul className={styles.tags}>
            {post.tags.map((tag) => (
              <li key={tag}><Badge>{tag}</Badge></li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.content}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Reveal>

        <Reveal className={styles.nextWrap}>
          <span className={styles.nextLabel}>Next up</span>
          <Link to={`/blog/${next.slug}`} className={styles.nextLink}>
            {next.title} →
          </Link>
        </Reveal>
      </Container>
    </>
  )
}
