import { Component } from 'react'
import Container from './ui/Container'
import Button from './ui/Button'

/**
 * The previous app had zero error boundaries — a single thrown render
 * error (e.g. a malformed markdown post) would white-screen the entire
 * site with no recovery path. This catches render errors anywhere below
 * it in the tree and shows a recoverable fallback instead.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In production this is where you'd forward to an error-tracking
    // service (Sentry, etc). Logged locally for now.
    console.error('Portfolio crashed:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Container as="main" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-accent)', marginBottom: 12 }}>
          something broke
        </p>
        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>This page hit an error.</h1>
        <p style={{ color: 'var(--color-ink-soft)', marginBottom: 24 }}>
          Nothing was lost — try reloading the page. If it keeps happening, ping me directly.
        </p>
        <Button onClick={this.handleReset}>./retry</Button>
      </Container>
    )
  }
}
