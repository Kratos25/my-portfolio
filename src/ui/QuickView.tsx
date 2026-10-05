import { useEffect, useRef, useState } from 'react'
import { useStudio } from '../store'
import { experience, profile, projects, stack } from '../data/content'
import { ErrorBoundary } from './ErrorBoundary'

const anchors = [
  { id: 'qv-work', label: 'Work' },
  { id: 'qv-experience', label: 'Experience' },
  { id: 'qv-stack', label: 'Stack' },
  { id: 'qv-contact', label: 'Contact' },
]

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
    <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** The recruiter fast path: one calm, readable page with everything that matters. */
export function QuickView() {
  const visible = useStudio((s) => s.quickView)
  const setQuickView = useStudio((s) => s.setQuickView)
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (visible) {
      ref.current?.focus({ preventScroll: true })
      if (ref.current) ref.current.scrollTop = 0
    }
  }, [visible])

  if (!visible) return null

  const jump = (id: string) => {
    const root = ref.current
    const el = root?.querySelector<HTMLElement>(`#${id}`)
    if (root && el) root.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
  }
  const copy = () => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  const [featured, ...rest] = projects
  // Count jobs only (skip education entries) for the summary line.
  const jobs = experience.filter((e) => !/b\.?tech|degree|university|college|school/i.test(`${e.role} ${e.org}`))

  return (
    <div className="qv" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${profile.name} — quick view`}>
      <ErrorBoundary label="quick view">
        <header className="qv-bar">
          <div className="qv-bar__in">
            <span className="qv-bar__name">{profile.name}</span>
            <nav className="qv-bar__nav" aria-label="Jump to">
              {anchors.map((a) => (
                <button key={a.id} onClick={() => jump(a.id)}>{a.label}</button>
              ))}
            </nav>
            <button className="qv-btn qv-btn--ghost qv-btn--sm" onClick={() => setQuickView(false)}>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
                <path d="M8 1.5l5.5 3v7L8 14.5l-5.5-3v-7zM8 8l5.5-3.5M8 8v6.5M8 8L2.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              Back to 3D studio
            </button>
          </div>
        </header>

        <main className="qv-main">
          {/* ── Hero ── */}
          <section className="qv-hero">
            <p className="qv-status"><span aria-hidden />{profile.availability}</p>
            <h1>{profile.name}</h1>
            <p className="qv-hero__role">{profile.role} · {profile.location}</p>
            <p className="qv-hero__lede">{profile.tagline}</p>
            <div className="qv-cta">
              <a className="qv-btn qv-btn--primary" href={`mailto:${profile.email}`}>Email me</a>
              <a className="qv-btn qv-btn--ghost" href={profile.resumeUrl} download>Download résumé</a>
            </div>
            <ul className="qv-social">
              {profile.links.map((l) => (
                <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer">{l.label} <Arrow /></a></li>
              ))}
            </ul>
            <dl className="qv-facts">
              <div><dt>Focus</dt><dd>{profile.focus}</dd></div>
              <div><dt>Experience</dt><dd>{jobs.length} roles since {jobs[jobs.length - 1]?.when.slice(0, 4)}</dd></div>
              <div><dt>Shipped</dt><dd>{projects.length} featured projects below</dd></div>
            </dl>
          </section>

          {/* ── Work ── */}
          <section id="qv-work" className="qv-section">
            <h2>Selected work</h2>
            <div className="qv-work">
              {[featured, ...rest].map((p, i) => (
                <article key={p.slug} className={`qv-project ${i === 0 ? 'qv-project--featured' : ''}`}>
                  <p className="qv-project__meta">{p.year}</p>
                  <h3>{p.title}</h3>
                  <p className="qv-project__summary">{p.summary}</p>
                  <dl className="qv-project__pr">
                    <div><dt>Problem</dt><dd>{p.problem}</dd></div>
                    <div><dt>Result</dt><dd>{p.outcome}</dd></div>
                  </dl>
                  <ul className="qv-tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                  <div className="qv-project__actions">
                    {p.link && <a className="qv-btn qv-btn--primary qv-btn--sm" href={p.link} target="_blank" rel="noreferrer">View live site <Arrow /></a>}
                    {p.repo && <a className="qv-btn qv-btn--ghost qv-btn--sm" href={p.repo} target="_blank" rel="noreferrer">Source code <Arrow /></a>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Experience ── */}
          <section id="qv-experience" className="qv-section">
            <h2>Experience</h2>
            <ol className="qv-exp">
              {experience.map((e, i) => (
                <li key={i}>
                  <p className="qv-exp__when">{e.when}</p>
                  <div>
                    <h3>{e.role}</h3>
                    <p className="qv-exp__org">{e.org}</p>
                    <p>{e.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Stack ── */}
          <section id="qv-stack" className="qv-section">
            <h2>Tech stack</h2>
            <div className="qv-stack">
              {stack.map((s) => (
                <div key={s.shelf}>
                  <h3>{s.shelf}</h3>
                  <ul>{s.books.map((b) => <li key={b}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── About ── */}
          <section className="qv-section qv-about">
            <h2>About</h2>
            <div>{profile.about.map((t, i) => <p key={i}>{t}</p>)}</div>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer id="qv-contact" className="qv-contact">
          <div className="qv-contact__in">
            <h2>Let’s build something good.</h2>
            <p>The fastest way to reach me is email. I reply within a day.</p>
            <div className="qv-contact__email">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <button className="qv-btn qv-btn--light qv-btn--sm" onClick={copy}>{copied ? 'Copied' : 'Copy email'}</button>
            </div>
            <div className="qv-cta">
              <a className="qv-btn qv-btn--amber" href={`mailto:${profile.email}`}>Email me</a>
              <a className="qv-btn qv-btn--outline-light" href={profile.resumeUrl} download>Download résumé</a>
              <button className="qv-btn qv-btn--outline-light" onClick={() => setQuickView(false)}>Explore the 3D studio</button>
            </div>
            <p className="qv-contact__fine">© {new Date().getFullYear()} {profile.name}</p>
          </div>
        </footer>

        {/* Phones: the main action is always one tap away. */}
        <div className="qv-dock">
          <a className="qv-btn qv-btn--primary" href={`mailto:${profile.email}`}>Email me</a>
          <a className="qv-btn qv-btn--ghost" href={profile.resumeUrl} download>Résumé</a>
        </div>
      </ErrorBoundary>
    </div>
  )
}
