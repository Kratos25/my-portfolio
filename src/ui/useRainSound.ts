import { useEffect, useRef } from 'react'

/** Soft rain made in the browser (filtered noise) — no audio files to download. */
export function useRainSound(on: boolean) {
  const ctx = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)

  useEffect(() => {
    if (on && !ctx.current) {
      const ac = new AudioContext()
      const len = ac.sampleRate * 4
      const buf = ac.createBuffer(2, len, ac.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch)
        let last = 0
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1
          last = (last + 0.02 * white) / 1.02 // brown noise
          d[i] = last * 3.5 + (Math.random() < 0.0008 ? (Math.random() - 0.5) * 0.6 : 0) // + droplets
        }
      }
      const src = ac.createBufferSource()
      src.buffer = buf
      src.loop = true
      const filter = ac.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1400
      const g = ac.createGain()
      g.gain.value = 0
      src.connect(filter).connect(g).connect(ac.destination)
      src.start()
      ctx.current = ac
      gain.current = g
    }
    const ac = ctx.current
    if (ac && gain.current) {
      if (on) ac.resume()
      gain.current.gain.setTargetAtTime(on ? 0.35 : 0, ac.currentTime, 0.4)
    }
  }, [on])
}
