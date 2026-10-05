import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; label?: string; onReset?: () => void }

/** If one section breaks, show a calm fallback instead of blanking the whole site. */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error) {
    console.error(`[${this.props.label ?? 'section'}]`, error)
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="fallback" role="alert">
        <p>This part of the studio didn’t load.</p>
        <button
          className="btn btn--ghost"
          onClick={() => {
            this.setState({ error: null })
            this.props.onReset?.()
          }}
        >
          Try again
        </button>
      </div>
    )
  }
}
