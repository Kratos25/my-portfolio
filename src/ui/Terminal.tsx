import { useEffect, useRef, useState, type ReactNode } from 'react'
import { experience, profile, projects, stack } from '../data/content'
import { useStudio } from '../store'

type Line = { kind: 'in' | 'out'; body: ReactNode }

const prompt = '~/studio $'

/** A small, real terminal. Commands are plain functions — easy to add more. */
export function Terminal() {
  const open = useStudio((s) => s.open)
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', body: <>Welcome. Type <b>help</b> to see what you can do, or tap a command below.</> },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const screen = useRef<HTMLDivElement>(null)

  // Keep the newest output in view. (Braces matter: newer browsers return a
  // Promise from scroll methods, and React must never receive one from an effect.)
  useEffect(() => {
    const el = screen.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const commands: Record<string, (arg: string) => ReactNode | null> = {
    help: () => (
      <table className="term__help">
        <tbody>
          {[
            ['ls', 'list projects'],
            ['open <name>', 'read a project case study'],
            ['whoami', 'who built this room'],
            ['stack', 'what I work with'],
            ['git log', 'my experience'],
            ['contact', 'how to reach me'],
            ['clear', 'clear the screen'],
          ].map(([c, d]) => (
            <tr key={c}>
              <td>{c}</td>
              <td>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
    ls: () => (
      <div className="term__ls">
        {projects.map((p) => (
          <button key={p.slug} onClick={() => run(`open ${p.slug}`)}>
            {p.slug}/
          </button>
        ))}
      </div>
    ),
    open: (arg) => {
      const p = projects.find((x) => x.slug === arg.trim() || x.title.toLowerCase() === arg.trim().toLowerCase())
      if (!p) return <>No project called “{arg}”. Type <b>ls</b> to see them all.</>
      return (
        <div className="term__project">
          <div className="term__title">
            {p.title} <span>{p.year}</span>
          </div>
          <p>{p.summary}</p>
          <p>
            <em>Problem</em> {p.problem}
          </p>
          <p>
            <em>Result</em> {p.outcome}
          </p>
          <p className="term__dim">{p.stack.join('  ·  ')}</p>
          <p className="term__links">
            {p.link && <a href={p.link} target="_blank" rel="noreferrer">live site ↗</a>}
            {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">source ↗</a>}
          </p>
        </div>
      )
    },
    whoami: () => <>{profile.name} — {profile.role}. {profile.tagline}</>,
    stack: () => (
      <div>
        {stack.map((s) => (
          <div key={s.shelf}>
            <span className="term__dim">{s.shelf.padEnd(11)}</span>
            {s.books.join(', ')}
          </div>
        ))}
      </div>
    ),
    git: (arg) => {
      if (arg.trim() !== 'log') return <>Try <b>git log</b>.</>
      return (
        <div>
          {experience.map((e, i) => (
            <div key={i} className="term__commit">
              <span className="term__hash">{(0xa3f9c1 - i * 0x1b2c3).toString(16)}</span> {e.role} @ {e.org}
              <div className="term__dim">{e.when} — {e.note}</div>
            </div>
          ))}
        </div>
      )
    },
    contact: () => {
      setTimeout(() => open('contact'), 600)
      return <>Opening the phone… or write to <a href={`mailto:${profile.email}`}>{profile.email}</a></>
    },
    sudo: (arg) => (arg.includes('hire') ? <>Permission granted. Sending you to my inbox… <a href={`mailto:${profile.email}?subject=Let's work together`}>{profile.email}</a></> : <>Nice try.</>),
    clear: () => {
      setLines([])
      return null
    },
    exit: () => {
      useStudio.getState().close()
      return null
    },
  }

  function run(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    const [name, ...rest] = cmd.split(/\s+/)
    const fn = commands[name.toLowerCase()]
    const out = fn ? fn(rest.join(' ')) : <>command not found: {name}. Type <b>help</b>.</>
    setHistory((h) => [cmd, ...h].slice(0, 30))
    setHIndex(-1)
    if (name === 'clear') return
    setLines((l) => [...l, { kind: 'in', body: cmd }, ...(out ? [{ kind: 'out' as const, body: out }] : [])])
  }

  return (
    <div className="term" onClick={() => input.current?.focus({ preventScroll: true })}>
      <div className="term__screen" ref={screen} role="log" aria-live="polite">
        {lines.map((l, i) =>
          l.kind === 'in' ? (
            <div key={i} className="term__in">
              <span className="term__prompt">{prompt}</span> {l.body}
            </div>
          ) : (
            <div key={i} className="term__out">{l.body}</div>
          ),
        )}
        <form
          className="term__row"
          onSubmit={(e) => {
            e.preventDefault()
            run(value)
            setValue('')
          }}
        >
          <label className="term__prompt" htmlFor="term-input">{prompt}</label>
          <input
            id="term-input"
            ref={input}
            value={value}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                const i = Math.min(hIndex + 1, history.length - 1)
                if (history[i]) { setHIndex(i); setValue(history[i]) }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                const i = hIndex - 1
                setHIndex(Math.max(i, -1))
                setValue(i >= 0 ? history[i] : '')
              }
            }}
          />
        </form>
      </div>
      <div className="term__chips" aria-label="Suggested commands">
        {['ls', 'whoami', 'git log', 'stack', 'help'].map((c) => (
          <button key={c} onClick={(e) => { e.stopPropagation(); run(c) }}>{c}</button>
        ))}
      </div>
    </div>
  )
}
