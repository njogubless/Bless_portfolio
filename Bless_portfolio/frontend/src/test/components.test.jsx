import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../components/ui/Card'
import Reveal from '../components/ui/Reveal'

describe('Card', () => {
  /**
   * Regression guard. Card was a plain function component, so React
   * dropped the ref that <Reveal as={Card}> passes down. The observer
   * never attached, `is-visible` was never added, and every Card rendered
   * through Reveal stayed at opacity: 0 — the About page was blank below
   * the intro. Asserting the text is present would NOT have caught this,
   * because the nodes were in the DOM the whole time; only the ref was.
   */
  it('forwards its ref to the underlying element', () => {
    const ref = createRef()
    render(<Card ref={ref}>content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('still honours the `as` prop when forwarding', () => {
    const ref = createRef()
    render(<Card as="article" ref={ref}>content</Card>)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  it('becomes visible when revealed', () => {
    render(<Reveal as={Card}>revealed content</Reveal>)
    expect(screen.getByText('revealed content')).toHaveClass('is-visible')
  })
})
