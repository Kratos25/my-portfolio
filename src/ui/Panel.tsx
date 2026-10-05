import { useEffect, useRef, type ComponentType } from 'react'
import { useStudio, sections, type SectionId } from '../store'
import { ErrorBoundary } from './ErrorBoundary'
import { AboutSection, ContactSection, ExperienceSection, GithubSection, ProjectsSection, StackSection } from './Sections'

const content: Record<SectionId, { title: string; Body: ComponentType }> = {
  projects: { title: 'Things I’ve built', Body: ProjectsSection },
  stack: { title: 'What’s on the shelf', Body: StackSection },
  experience: { title: 'Where I’ve worked', Body: ExperienceSection },
  about: { title: 'Hello, properly', Body: AboutSection },
  github: { title: 'Recent activity', Body: GithubSection },
  contact: { title: 'Let’s talk', Body: ContactSection },
}

/** Side panel on desktop, swipe-down bottom sheet on phones. */
export function Panel() {
  const active = useStudio((s) => s.active)
  const close = useStudio((s) => s.close)
  const open = useStudio((s) => s.open)
  const ref = useRef<HTMLElement>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    if (active) ref.current?.focus({ preventScroll: true })
  }, [active])

  const idx = active ? sections.findIndex((s) => s.id === active) : -1
  const step = (d: number) => open(sections[(idx + d + sections.length) % sections.length].id)

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      className={`panel ${active ? 'is-open' : ''}`}
      aria-hidden={!active}
      aria-label={active ? content[active].title : undefined}
    >
      {active && (
        <>
          <div
            className="panel__grab"
            onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
            onTouchEnd={(e) => {
              if (startY.current !== null && e.changedTouches[0].clientY - startY.current > 70) close()
              startY.current = null
            }}
          >
            <span />
          </div>
          <header className="panel__head">
            <p className="panel__kicker">{sections[idx].object}</p>
            <h2>{content[active].title}</h2>
            <button className="icon-btn" onClick={close} aria-label="Back to the room">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </header>
          <div className="panel__body" key={active}>
            <ErrorBoundary label={active}>{(() => { const B = content[active].Body; return <B /> })()}</ErrorBoundary>
          </div>
          <footer className="panel__foot">
            <button onClick={() => step(-1)}>← {sections[(idx - 1 + sections.length) % sections.length].label}</button>
            <button onClick={() => step(1)}>{sections[(idx + 1) % sections.length].label} →</button>
          </footer>
        </>
      )}
    </aside>
  )
}
