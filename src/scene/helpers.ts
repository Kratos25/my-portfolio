import * as THREE from 'three'

/** Draw on a 2D canvas and turn it into a crisp texture (screens, whiteboard, sky). */
export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  draw(ctx)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export const palette = {
  night: '#151936',
  wall: '#2B3160',
  wallSide: '#252a55',
  floor: '#3a2f3f',
  wood: '#6b4a3a',
  woodDark: '#4a3229',
  amber: '#FFB45C',
  cyan: '#7FE7E0',
  paper: '#EEE7D7',
  duck: '#F5CE3A',
  metal: '#3c4062',
  plastic: '#1d2140',
}

/** 0 = deep night, 1 = full day, based on the visitor's local clock. */
export function daylight(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60
  if (h >= 8 && h < 17.5) return 1
  if (h >= 6 && h < 8) return (h - 6) / 2
  if (h >= 17.5 && h < 19.5) return 1 - (h - 17.5) / 2
  return 0
}
