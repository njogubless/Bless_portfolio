import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you're looking for doesn't exist." />
      <Container as="section" className={styles.wrap}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>This route doesn't exist.</h1>
        <p className={styles.lead}>The page you were looking for may have moved, or the link is stale.</p>
        <Button as={Link} to="/">Back to home</Button>
      </Container>
    </>
  )
}
