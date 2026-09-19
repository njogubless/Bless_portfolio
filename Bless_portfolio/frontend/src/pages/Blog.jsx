import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import Badge from '../components/ui/Badge'
import { cx, formatDate } from '../lib/utils'
import { getCategories, getPostsByCategory } from '../lib/content/posts'
import styles from './Blog.module.css'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all')

  // 'all' is a UI affordance, not a category anyone writes on a post —
  // the real list is derived from the published content.
  const categories = useMemo(() => ['all', ...getCategories()], [])
  const filtered = useMemo(() => getPostsByCategory(activeCategory), [activeCategory])

  return (
    <>
      <SEO path="/blog" title="Blog" description="Notes on Flutter, Django, DevOps, and building software in Kenya." />

      <Container as="section" className={styles.intro}>
        <Reveal>
          <span className={styles.eyebrow}>Writing</span>
          <h1 className={styles.title}>Notes from the field.</h1>
          <p className={styles.lead}>
            Short write-ups on what I'm building and learning — Flutter, Django, infrastructure, and what it's
            actually like shipping software from Kenya.
          </p>
        </Reveal>
      </Container>

      <Container as="section" className={styles.block}>
        <div className={styles.filters} role="group" aria-label="Filter posts by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cx(styles.filterChip, activeCategory === cat && styles.filterChipActive)}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.postGrid}>
          {filtered.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 6) * 40}>
              <Link to={post.route} className={styles.postCard}>
                <div className={styles.postMeta}>
                  <Badge tone="accent">{post.category}</Badge>
                  <span className={styles.postDate}>{formatDate(post.date)}</span>
                </div>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <span className={styles.postReadingTime}>{post.readingTime}</span>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>No posts in this category yet.</p>
        )}
      </Container>
    </>
  )
}
