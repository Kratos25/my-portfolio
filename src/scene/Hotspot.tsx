import { useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStudio, isTouch, type SectionId } from '../store'

type Props = {
  id: string
  label: string
  section?: SectionId
  onActivate?: () => void
  /** Where the floating label / mobile pin sits, in world space relative to the group. */
  pin: [number, number, number]
  children: ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const touch = isTouch()

/** Wraps any object in the room so it can be hovered, clicked, and labelled. */
export function Hotspot({ id, label, section, onActivate, pin, children, position, rotation }: Props) {
  const group = useRef<THREE.Group>(null!)
  const [hover, setHover] = useState(false)
  const active = useStudio((s) => s.active)
  const booted = useStudio((s) => s.booted)
  const setHovered = useStudio((s) => s.setHovered)
  const open = useStudio((s) => s.open)

  useFrame((_, dt) => {
    const target = hover && !active ? 1.045 : 1
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 10, dt)
    group.current.scale.setScalar(s)
  })

  const activate = () => {
    if (section) open(section)
    else onActivate?.()
  }

  const showLabel = booted && !active && (touch || hover)

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        setHovered(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        setHovered(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        activate()
      }}
    >
      {children}
      {showLabel && (
        <Html position={pin} center zIndexRange={[20, 0]} style={{ pointerEvents: touch ? 'auto' : 'none' }}>
          {touch ? (
            // Phones: a small glowing dot with a generous tap area (labels would collide).
            <button className="dot" onClick={activate} tabIndex={-1} aria-hidden>
              <span />
            </button>
          ) : (
            <span className="pin" aria-hidden>
              <span className="pin__dot" />
              {label}
            </span>
          )}
        </Html>
      )}
    </group>
  )
}
