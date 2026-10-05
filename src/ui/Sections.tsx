import { useEffect, useState } from 'react'
import { experience, githubFallback, profile, projects, stack } from '../data/content'
import { Terminal } from './Terminal'

export function ProjectsSection() {
  const [mode, setMode] = useState<'terminal' | 'list'>('terminal')
  return (
    <>
      <div className="seg" role="tablist" aria-label="View projects as">
        <button role="tab" aria-selected={mode === 'terminal'} onClick={() => setMode('terminal')}>Terminal</button>
        <button role="tab" aria-selected={mode === 'list'} onClick={() => setMode('list')}>List</button>
      </div>
      {mode === 'terminal' ? (
        <Terminal />
      ) : (
        <ProjectList />
      )}
    </>
  )
}

export function ProjectList() {
  return (
    <ul className="projects">
      {projects.map((p) => (
        <li key={p.slug}>
          <h3>{p.title} <span>{p.year}</span></h3>
          <p>{p.summary}</p>
          <p className="muted">{p.outcome}</p>
          <p className="tags">{p.stack.join(', ')}</p>
          <p className="links">
            {p.link && <a href={p.link} target="_blank" rel="noreferrer">Live site</a>}
            {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Source code</a>}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function StackSection() {
  return (
    <div className="shelves">
      {stack.map((s) => (
        <section key={s.shelf}>
          <h3>{s.shelf}</h3>
          <ul>{s.books.map((b) => <li key={b}>{b}</li>)}</ul>
        </section>
      ))}
    </div>
  )
}

export function ExperienceSection() {
  return (
    <ol className="timeline">
      {experience.map((e, i) => (
        <li key={i}>
          <span className="when">{e.when}</span>
          <h3>{e.role}</h3>
          <p className="org">{e.org}</p>
          <p className="muted">{e.note}</p>
        </li>
      ))}
    </ol>
  )
}

export function AboutSection() {
  return (
    <div className="prose">
      <p className="lede">{profile.tagline}</p>
      {profile.about.map((p, i) => <p key={i}>{p}</p>)}
      <p className="muted">Based in {profile.location}.</p>
    </div>
  )
}

export function GithubSection() {
  const [stats, setStats] = useState({ ...githubFallback, live: false })
  useEffect(() => {
    // Live numbers when hosted normally; falls back quietly if the request is blocked.
    fetch(`https://api.github.com/users/${profile.github}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStats((s) => ({ ...s, repos: d.public_repos, followers: d.followers, live: true })))
      .catch(() => {})
  }, [])
  return (
    <div>
      <dl className="stats">
        <div><dt>Public repositories</dt><dd>{stats.repos}</dd></div>
        <div><dt>Followers</dt><dd>{stats.followers}</dd></div>
        <div><dt>Contributions this year</dt><dd>{stats.contributionsThisYear.toLocaleString()}</dd></div>
      </dl>
      <p className="muted small">{stats.live ? 'Live from GitHub.' : 'Sample numbers — these go live once the site is hosted with your username.'}</p>
      <a className="btn" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">Open my GitHub</a>
    </div>
  )
}

export function ContactSection() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="contact">
      <p className="lede">Building something? I’d like to hear about it.</p>
      <div className="contact__email">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <button
          className="btn btn--ghost"
          onClick={() => {
            navigator.clipboard?.writeText(profile.email).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            })
          }}
        >
          {copied ? 'Copied' : 'Copy email'}
        </button>
      </div>
      <ul className="contact__links">
        {profile.links.map((l) => (
          <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>
        ))}
        <li><a href={profile.resumeUrl}>Download résumé</a></li>
      </ul>
    </div>
  )
}
