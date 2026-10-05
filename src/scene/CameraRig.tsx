import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStudio, isTouch, prefersReducedMotion, type SectionId } from '../store'

// `?debug` disables GSAP lag smoothing so slow test browsers still finish tweens.
if (typeof location !== 'undefined' && location.search.includes('debug')) gsap.ticker.lagSmoothing(0)

type View = { pos: [number, number, number]; target: [number, number, number] }

// Where the camera goes for each section. Tweak these to reframe shots.
const views: Record<SectionId, View> = {
  projects: { pos: [0.05, 1.4, -0.55], target: [0, 1.15, -2.5] },
  stack: { pos: [-0.2, 1.35, 0.4], target: [-2.7, 1.0, 0.1] },
  experience: { pos: [1.75, 1.65, -0.35], target: [1.75, 1.7, -2.8] },
  about: { pos: [-0.25, 1.3, -1.0], target: [-0.55, 0.85, -2.0] },
  github: { pos: [0.45, 1.35, -1.05], target: [0.85, 0.92, -2.2] },
  contact: { pos: [0.2, 1.45, -1.1], target: [0.3, 0.8, -1.98] },
}

function overview(aspect: number): View {
  // Portrait phones: step back and look down more so the whole desk fits.
  if (aspect < 0.8) return { pos: [3.7, 4.0, 5.0], target: [-0.7, 0.75, -1.45] }
  if (aspect < 1.25) return { pos: [3.6, 3.1, 4.4], target: [-0.7, 0.8, -1.4] }
  return { pos: [3.3, 2.6, 3.9], target: [-0.8, 0.85, -1.4] }
}

/** Keeps the room framed on any screen and flies between objects. */
export function CameraRig() {
  const { camera, size } = useThree()
  const cam = camera as THREE.PerspectiveCamera
  const active = useStudio((s) => s.active)
  const booted = useStudio((s) => s.booted)
  const target = useMemo(() => new THREE.Vector3(), [])
  const base = useRef(new THREE.Vector3())
  const pointer = useRef({ x: 0, y: 0 })
  const first = useRef(true)
  const shift = useMemo(() => ({ x: 0, y: 0 }), [])
  const aspect = size.width / size.height

  // Responsive field of view: keep the horizontal framing roughly constant.
  useEffect(() => {
    const hfov = THREE.MathUtils.degToRad(aspect < 0.8 ? 62 : 58)
    const vfov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hfov / 2) / aspect))
    cam.fov = THREE.MathUtils.clamp(vfov, 34, 80)
    cam.updateProjectionMatrix()
  }, [aspect, cam])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const v = active ? views[active] : overview(aspect)
    const pos = new THREE.Vector3(...v.pos)
    const tgt = new THREE.Vector3(...v.target)

    if (first.current) {
      // Intro: start pulled back and high, then glide in once booted.
      first.current = false
      base.current.copy(pos).multiplyScalar(1.6).add(new THREE.Vector3(0, 1.2, 0))
      target.copy(tgt)
    }
    if (!booted) return

    const duration = prefersReducedMotion() ? 0 : active ? 1.3 : 1.6
    // Slide the picture (not the camera) so the object sits in the space the panel leaves free.
    const sheet = aspect < 1 || size.width <= 860
    const panelFrac = Math.min(478, size.width * 0.42 + 18) / size.width
    gsap.to(shift, {
      x: active && !sheet ? panelFrac / 2 : 0,
      y: active && sheet ? 0.27 : 0,
      duration,
      ease: 'power3.inOut',
      overwrite: true,
    })
    gsap.to(base.current, { x: pos.x, y: pos.y, z: pos.z, duration, ease: 'power3.inOut', overwrite: true })
    gsap.to(target, { x: tgt.x, y: tgt.y, z: tgt.z, duration, ease: 'power3.inOut', overwrite: true })
  }, [active, aspect, booted, camera, target, shift, size.width])

  useFrame((_, dt) => {
    // Gentle parallax in the overview on devices with a mouse.
    const p = !active && !isTouch() && !prefersReducedMotion() ? pointer.current : { x: 0, y: 0 }
    const desired = base.current.clone().add(new THREE.Vector3(p.x * 0.25, -p.y * 0.15, 0))
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desired.x, 6, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desired.y, 6, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desired.z, 6, dt)
    camera.lookAt(target)
    const { width: w, height: h } = size
    if (shift.x || shift.y) cam.setViewOffset(w, h, shift.x * w, shift.y * h, w, h)
    else if (cam.view?.enabled) cam.clearViewOffset()
  })

  return null
}
