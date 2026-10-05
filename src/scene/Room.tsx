import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { canvasTexture, daylight, palette } from './helpers'
import { useStudio } from '../store'

const day = daylight()

function Sky() {
  const tex = useMemo(
    () =>
      canvasTexture(256, 256, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 256)
        const top = new THREE.Color('#0b0e26').lerp(new THREE.Color('#7fb3e6'), day)
        const bottom = new THREE.Color('#2a2552').lerp(new THREE.Color('#f3d7b0'), day)
        g.addColorStop(0, `#${top.getHexString()}`)
        g.addColorStop(1, `#${bottom.getHexString()}`)
        c.fillStyle = g
        c.fillRect(0, 0, 256, 256)
        if (day < 0.5) {
          for (let i = 0; i < 40; i++) {
            c.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.6})`
            c.fillRect(Math.random() * 256, Math.random() * 170, 1.5, 1.5)
          }
          c.fillStyle = '#f4f1ea'
          c.beginPath()
          c.arc(190, 60, 16, 0, Math.PI * 2)
          c.fill()
        }
        // distant city skyline
        c.fillStyle = day < 0.5 ? '#121533' : '#5d6aa0'
        let x = 0
        while (x < 256) {
          const w = 14 + Math.random() * 22
          const h = 30 + Math.random() * 70
          c.fillRect(x, 256 - h, w, h)
          if (day < 0.5) {
            c.fillStyle = 'rgba(255,190,110,0.8)'
            for (let k = 0; k < 4; k++) c.fillRect(x + 3 + Math.random() * (w - 6), 256 - h + 6 + Math.random() * (h - 12), 2, 2)
            c.fillStyle = '#121533'
          }
          x += w + 2
        }
      }),
    [],
  )
  return (
    <mesh position={[0, 0, -0.005]}>
      <planeGeometry args={[1.1, 1.0]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

function Rain({ count = 45 }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const drops = useMemo(
    () => Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 1.05, y: Math.random(), s: 0.6 + Math.random() * 0.8 })),
    [count],
  )
  const m = useMemo(() => new THREE.Matrix4(), [])
  useFrame((_, dt) => {
    drops.forEach((d, i) => {
      d.y -= dt * d.s * 1.4
      if (d.y < 0) {
        d.y = 1
        d.x = (Math.random() - 0.5) * 1.05
      }
      m.makeTranslation(d.x, d.y - 0.5, 0.002)
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.003, 0.05]} />
      <meshBasicMaterial color="#cfd8ff" transparent opacity={0.45} depthWrite={false} />
    </instancedMesh>
  )
}

function Window() {
  return (
    <group position={[-1.6, 1.85, -2.79]}>
      <Sky />
      <Rain />
      {/* frame */}
      {[
        [0, 0.52, 1.2, 0.05],
        [0, -0.52, 1.2, 0.05],
        [-0.575, 0, 0.05, 1.08],
        [0.575, 0, 0.05, 1.08],
        [0, 0, 1.1, 0.025],
        [0, 0, 0.025, 1.0],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.02]} castShadow>
          <boxGeometry args={[w, h, 0.05]} />
          <meshStandardMaterial color="#e8e2d2" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.57, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.16]} />
        <meshStandardMaterial color="#e8e2d2" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Desk() {
  const wood = <meshStandardMaterial color={palette.wood} roughness={0.55} />
  return (
    <group position={[0, 0, -2.35]}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.06, 0.85]} />
        {wood}
      </mesh>
      {[
        [-1.18, -0.36],
        [1.18, -0.36],
        [-1.18, 0.36],
        [1.18, 0.36],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.6} />
        </mesh>
      ))}
      {/* keyboard + mouse */}
      <mesh position={[0, 0.79, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.02, 0.17]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0.79, 0.22]} castShadow>
        <boxGeometry args={[0.06, 0.025, 0.1]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.5} />
      </mesh>
      {/* notebook */}
      <mesh position={[-0.55, 0.785, 0.22]} rotation={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.015, 0.32]} />
        <meshStandardMaterial color="#c9573b" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Chair() {
  return (
    <group position={[-1.4, 0, -1.15]} rotation={[0, 0.75, 0]}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.08, 0.5]} />
        <meshStandardMaterial color="#3d4580" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0.24]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.65, 0.07]} />
        <meshStandardMaterial color="#3d4580" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.44, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.17, 0.03, Math.sin((i / 5) * Math.PI * 2) * 0.17]} rotation={[0, -(i / 5) * Math.PI * 2, 0]} castShadow>
          <boxGeometry args={[0.34, 0.03, 0.04]} />
          <meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Plant() {
  return (
    <group position={[1.65, 0, -2.4]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.4, 20]} />
        <meshStandardMaterial color="#c9573b" roughness={0.7} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.08, 0.62 + (i % 3) * 0.08, Math.sin(a) * 0.08]} rotation={[Math.sin(a) * 0.5, a, Math.cos(a) * 0.5]} castShadow>
            <coneGeometry args={[0.07, 0.5, 6]} />
            <meshStandardMaterial color={i % 2 ? '#3f7d63' : '#4f9476'} roughness={0.7} flatShading />
          </mesh>
        )
      })}
    </group>
  )
}

export function Room() {
  const lampOn = useStudio((s) => s.lampOn)
  // Light mode (lamp "off" == lights on in the room): brighter fill, cooler shadows.
  const ambient = lampOn ? 0.35 + day * 0.4 : 1.1
  return (
    <group>
      <hemisphereLight args={['#8b93d6', '#2a1f33', ambient]} />
      <directionalLight
        position={[-2.5, 3.5, -1]}
        color={day > 0.5 ? '#ffe3bd' : '#8fa2ff'}
        intensity={0.4 + day * 1.2}
      />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.15]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color={palette.floor} roughness={0.85} />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.004, -1.15]} receiveShadow>
        <circleGeometry args={[1.25, 48]} />
        <meshStandardMaterial color="#4b3f6b" roughness={1} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.5, -2.85]} receiveShadow>
        <boxGeometry args={[6, 3, 0.1]} />
        <meshStandardMaterial color={palette.wall} roughness={0.9} />
      </mesh>
      {/* left wall */}
      <mesh position={[-3.0, 1.5, 0.15]} receiveShadow>
        <boxGeometry args={[0.1, 3, 6]} />
        <meshStandardMaterial color={palette.wallSide} roughness={0.9} />
      </mesh>
      {/* skirting */}
      <mesh position={[0, 0.05, -2.79]}>
        <boxGeometry args={[6, 0.1, 0.02]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <Window />
      <Desk />
      <Chair />
      <Plant />
    </group>
  )
}
