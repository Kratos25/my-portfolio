import { useEffect } from 'react'
import { useStudio, sections, isTouch } from '../store'
import { profile } from '../data/content'
import { useRainSound } from './useRainSound'

export function Hud() {
  const { active, booted, sound, lampOn, toast, open, close, toggleSound, toggleLamp, setQuickView } = useStudio()
  useRainSound(sound)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (useStudio.getState().quickView) setQuickView(false)
        else close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, setQuickView])

  return (
    <div className={`hud ${booted ? 'is-on' : ''} ${active ? 'has-panel' : ''}`}>
      <div className="hud__top">
        <button className="hud__mark" onClick={close} aria-label="Back to the room overview">
          {profile.name.split(' ').map((w) => w[0]).join('')}
        </button>
        <div className="hud__actions">
          <button className="chip" onClick={toggleLamp} aria-pressed={!lampOn}>
            {lampOn ? 'Lights on' : 'Lights off'}
          </button>
          <button className="chip" onClick={toggleSound} aria-pressed={sound}>
            {sound ? 'Rain on' : 'Rain off'}
          </button>
          <button className="chip chip--solid" onClick={() => setQuickView(true)}>Quick view</button>
        </div>
      </div>

      <div className="hud__intro" aria-hidden={!!active}>
        <h1>{profile.name}</h1>
        <p>{profile.role}. {isTouch() ? 'Tap anything glowing.' : 'Click anything on the desk.'}</p>
      </div>

      <nav className="hud__nav" aria-label="Sections">
        {sections.map((s) => (
          <button key={s.id} aria-current={active === s.id ? 'true' : undefined} onClick={() => open(s.id)}>
            {s.label}
          </button>
        ))}
      </nav>

      <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}
