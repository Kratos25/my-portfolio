import { useEffect, useState } from 'react'
import { useStudio, prefersReducedMotion } from '../store'
import { profile } from '../data/content'

const bootLines = [
  'mounting /home/studio',
  'warming up the coffee',
  'compiling portfolio',
  'finding the light switch',
]

/** Boot sequence that doubles as the loader. Click or press any key to skip. */
export function Loader() {
  const booted = useStudio((s) => s.booted)
  const setBooted = useStudio((s) => s.setBooted)
  const [shown, setShown] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const step = prefersReducedMotion() ? 120 : 420
    const timers = bootLines.map((_, i) => window.setTimeout(() => setShown(i + 1), step * (i + 1)))
    const done = window.setTimeout(async () => {
      await document.fonts?.ready
      setBooted()
    }, step * (bootLines.length + 1))
    const skip = () => setBooted()
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
      window.removeEventListener('keydown', skip)
    }
  }, [setBooted])

  useEffect(() => {
    if (booted) {
      const t = window.setTimeout(() => setGone(true), 900)
      return () => clearTimeout(t)
    }
  }, [booted])

  if (gone) return null
  return (
    <div className={`boot ${booted ? 'is-done' : ''}`} onClick={() => setBooted()} role="status" aria-live="polite">
      <div className="boot__inner">
        <p className="boot__name">{profile.name}</p>
        <ul>
          {bootLines.slice(0, shown).map((l, i) => (
            <li key={l}>
              <span>{l}</span>
              <span className="boot__ok">{i < shown - 1 || booted ? 'ok' : '…'}</span>
            </li>
          ))}
        </ul>
        <div className="boot__bar"><span style={{ width: `${(shown / bootLines.length) * 100}%` }} /></div>
      </div>
    </div>
  )
}
