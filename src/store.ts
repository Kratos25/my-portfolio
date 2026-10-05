import { create } from 'zustand'

export type SectionId = 'projects' | 'stack' | 'experience' | 'about' | 'github' | 'contact'

export const sections: { id: SectionId; label: string; object: string }[] = [
  { id: 'projects', label: 'Projects', object: 'Monitor' },
  { id: 'stack', label: 'Tech stack', object: 'Bookshelf' },
  { id: 'experience', label: 'Experience', object: 'Whiteboard' },
  { id: 'about', label: 'About', object: 'Coffee mug' },
  { id: 'github', label: 'GitHub', object: 'Laptop' },
  { id: 'contact', label: 'Contact', object: 'Phone' },
]

type State = {
  booted: boolean
  active: SectionId | null
  hovered: string | null
  lampOn: boolean
  sound: boolean
  quality: 'high' | 'low'
  quickView: boolean
  toast: string | null
  setBooted: () => void
  open: (id: SectionId) => void
  close: () => void
  setHovered: (h: string | null) => void
  toggleLamp: () => void
  toggleSound: () => void
  setQuality: (q: 'high' | 'low') => void
  setQuickView: (v: boolean) => void
  showToast: (t: string) => void
}

let toastTimer: number | undefined

export const useStudio = create<State>((set) => ({
  booted: false,
  active: null,
  hovered: null,
  lampOn: true,
  sound: false,
  quality: 'high',
  quickView: false,
  toast: null,
  setBooted: () => set({ booted: true }),
  open: (id) => set({ active: id, hovered: null }),
  close: () => set({ active: null }),
  setHovered: (hovered) => set({ hovered }),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  setQuality: (quality) => set({ quality }),
  setQuickView: (quickView) => set({ quickView, active: null }),
  showToast: (toast) => {
    window.clearTimeout(toastTimer)
    set({ toast })
    toastTimer = window.setTimeout(() => set({ toast: null }), 3200)
  },
}))

export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
