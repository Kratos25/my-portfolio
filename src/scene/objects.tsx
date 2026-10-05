import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from './Hotspot'
import { canvasTexture, palette } from './helpers'
import { useStudio } from '../store'
import { experience, profile, stack } from '../data/content'

// Each object below is self-contained. To upgrade one to a Blender model later,
// replace the meshes inside its <Hotspot> with <primitive object={gltf.scene} />.

/* ── Monitor: projects ──────────────────────────────────────────────── */
export function Monitor() {
  const cursor = useRef<THREE.Mesh>(null!)
  const screen = useMemo(
    () =>
      canvasTexture(1024, 600, (c) => {
        c.fillStyle = '#0f1430'
        c.fillRect(0, 0, 1024, 600)
        c.fillStyle = '#1a2048'
        c.fillRect(0, 0, 1024, 34)
        ;['#ff7a7a', '#ffcf6b', '#7be08e'].forEach((col, i) => {
          c.fillStyle = col
          c.beginPath()
          c.arc(22 + i * 22, 17, 6, 0, Math.PI * 2)
          c.fill()
        })
        c.font = '500 26px "JetBrains Mono", monospace'
        const lines: [string, string][] = [
          ['#7FE7E0', '~/studio $ ls projects'],
          ['#EEE7D7', 'pulse/   shelf/   atlas-cli/'],
          ['#7FE7E0', '~/studio $ cat about.md'],
          ['#b9b3d8', `# ${profile.name}`],
          ['#b9b3d8', `> ${profile.role}`],
          ['#7FE7E0', '~/studio $ npm run ship'],
          ['#FFB45C', '✓ built in 812ms'],
          ['#7FE7E0', '~/studio $ '],
        ]
        lines.forEach(([col, t], i) => {
          c.fillStyle = col
          c.fillText(t, 36, 92 + i * 58)
        })
      }),
    [],
  )
  useFrame(({ clock }) => {
    cursor.current.visible = Math.floor(clock.elapsedTime * 2) % 2 === 0
  })
  return (
    <Hotspot id="monitor" section="projects" label="Projects" pin={[0, 0.5, 0]} position={[0, 0.78, -2.5]}>
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.02, 0.22]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.17, -0.02]} castShadow>
        <boxGeometry args={[0.06, 0.32, 0.04]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.04, 0.62, 0.04]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.42, 0.0215]}>
        <planeGeometry args={[0.98, 0.575]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <mesh ref={cursor} position={[-0.27, 0.24, 0.023]}>
        <planeGeometry args={[0.018, 0.03]} />
        <meshBasicMaterial color={palette.cyan} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.42, 0.3]} color={palette.cyan} intensity={0.9} distance={2.2} decay={2} />
    </Hotspot>
  )
}

/* ── Laptop: live GitHub ────────────────────────────────────────────── */
export function Laptop() {
  const screen = useMemo(
    () =>
      canvasTexture(512, 320, (c) => {
        c.fillStyle = '#0f1430'
        c.fillRect(0, 0, 512, 320)
        c.fillStyle = '#EEE7D7'
        c.font = '500 22px Geist, sans-serif'
        c.fillText('contributions', 24, 42)
        for (let x = 0; x < 26; x++)
          for (let y = 0; y < 7; y++) {
            const v = Math.random()
            c.fillStyle = v > 0.8 ? '#7FE7E0' : v > 0.55 ? '#3f8f97' : v > 0.3 ? '#25466a' : '#1b2350'
            c.fillRect(24 + x * 18, 70 + y * 18, 14, 14)
          }
        c.fillStyle = '#FFB45C'
        c.fillRect(24, 220, 300, 6)
        c.fillStyle = '#b9b3d8'
        c.font = '18px Geist, sans-serif'
        c.fillText('main ← feature/studio  ✓ merged', 24, 268)
      }),
    [],
  )
  return (
    <Hotspot id="laptop" section="github" label="GitHub" pin={[0, 0.38, 0]} position={[0.85, 0.78, -2.2]} rotation={[0, -0.45, 0]}>
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.02, 0.34]} />
        <meshStandardMaterial color="#8a8fb8" roughness={0.35} metalness={0.6} />
      </mesh>
      <group position={[0, 0.02, -0.17]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.5, 0.32, 0.015]} />
          <meshStandardMaterial color="#8a8fb8" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.16, 0.0085]}>
          <planeGeometry args={[0.46, 0.28]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  )
}

/* ── Coffee mug: about ──────────────────────────────────────────────── */
export function Mug() {
  const steam = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    steam.current.children.forEach((m, i) => {
      const t = (clock.elapsedTime * 0.35 + i / 3) % 1
      m.position.y = 0.09 + t * 0.28
      m.position.x = Math.sin(t * 6 + i) * 0.02
      const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = Math.sin(t * Math.PI) * 0.22
      m.scale.setScalar(0.6 + t)
    })
  })
  return (
    <Hotspot id="mug" section="about" label="About me" pin={[0, 0.34, 0]} position={[-0.55, 0.78, -2.0]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.12, 24]} />
        <meshStandardMaterial color={palette.paper} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial color="#3b2418" roughness={0.2} />
      </mesh>
      <mesh position={[0.055, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.009, 8, 16, Math.PI]} />
        <meshStandardMaterial color={palette.paper} roughness={0.4} />
      </mesh>
      <group ref={steam}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  )
}

/* ── Phone: contact ─────────────────────────────────────────────────── */
export function Phone() {
  const glow = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 6
    glow.current.color.set(t < 1.2 ? palette.amber : '#1b2350')
  })
  return (
    <Hotspot id="phone" section="contact" label="Contact" pin={[0, 0.2, 0]} position={[0.3, 0.785, -1.98]} rotation={[0, 0.3, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.085, 0.012, 0.17]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.075, 0.155]} />
        <meshBasicMaterial ref={glow} toneMapped={false} />
      </mesh>
    </Hotspot>
  )
}

/* ── Desk lamp: light / dark ────────────────────────────────────────── */
export function Lamp() {
  const lampOn = useStudio((s) => s.lampOn)
  const toggleLamp = useStudio((s) => s.toggleLamp)
  const spot = useRef<THREE.SpotLight>(null!)
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(-0.2, 0.75, -2.0)
    return o
  }, [])
  const quality = useStudio((s) => s.quality)
  return (
    <>
      <primitive object={target} />
      <Hotspot id="lamp" label={lampOn ? 'Lamp off' : 'Lamp on'} onActivate={toggleLamp} pin={[0.1, 0.75, 0.1]} position={[-1.0, 0.78, -2.5]}>
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.11, 0.03, 24]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.5} />
        </mesh>
        <mesh position={[0.04, 0.27, 0.05]} rotation={[0.3, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.52, 8]} />
          <meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.4} />
        </mesh>
        <group position={[0.15, 0.52, 0.17]} rotation={[0.9, 0, -0.5]}>
          <mesh castShadow>
            <coneGeometry args={[0.1, 0.16, 24, 1, true]} />
            <meshStandardMaterial color="#c9573b" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={lampOn ? '#fff1d6' : '#555'} toneMapped={!lampOn} />
          </mesh>
        </group>
      </Hotspot>
      <spotLight
        ref={spot}
        position={[-0.85, 1.28, -2.33]}
        target={target}
        color={palette.amber}
        intensity={lampOn ? 9 : 0}
        angle={0.85}
        penumbra={0.7}
        distance={6}
        decay={1.6}
        castShadow={quality === 'high'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-0.8, 1.3, -2.2]} color={palette.amber} intensity={lampOn ? 1.6 : 0} distance={5} decay={1.4} />
    </>
  )
}

/* ── Rubber duck: easter egg ────────────────────────────────────────── */
const duckTips = [
  'Quack. Have you tried explaining it out loud?',
  'Quack. Is it cached?',
  'Quack. It works on my machine.',
  'Quack. Read the error message. The whole thing.',
  'Quack. Did you check it’s plugged in? (The env variable.)',
]
export function Duck() {
  const body = useRef<THREE.Group>(null!)
  const squash = useRef(0)
  const n = useRef(0)
  const showToast = useStudio((s) => s.showToast)
  useFrame((_, dt) => {
    squash.current = Math.max(0, squash.current - dt * 3)
    const k = Math.sin(squash.current * Math.PI) * 0.3
    body.current.scale.set(1 + k, 1 - k, 1 + k)
  })
  return (
    <Hotspot
      id="duck"
      label="Duck"
      pin={[0, 0.2, 0]}
      position={[0.5, 0.78, -2.35]}
      rotation={[0, -0.6, 0]}
      onActivate={() => {
        squash.current = 1
        showToast(duckTips[n.current++ % duckTips.length])
      }}
    >
      <group ref={body}>
        <mesh position={[0, 0.04, 0]} scale={[1.2, 0.85, 1]} castShadow>
          <sphereGeometry args={[0.05, 20, 20]} />
          <meshStandardMaterial color={palette.duck} roughness={0.35} />
        </mesh>
        <mesh position={[0.035, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.032, 20, 20]} />
          <meshStandardMaterial color={palette.duck} roughness={0.35} />
        </mesh>
        <mesh position={[0.07, 0.095, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.013, 0.03, 12]} />
          <meshStandardMaterial color="#f08a3a" roughness={0.4} />
        </mesh>
      </group>
    </Hotspot>
  )
}

/* ── Bookshelf: tech stack (book spines come from content.ts) ───────── */
const bookColors = ['#c9573b', '#7FE7E0', '#EEE7D7', '#8f7bd1', '#FFB45C', '#4f8a8b', '#d98a9c']
export function Bookshelf() {
  const books = useMemo(() => {
    const out: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = []
    stack.forEach((row, r) => {
      let z = -0.6
      row.books.forEach((_, i) => {
        const h = 0.26 + ((i * 37 + r * 11) % 9) / 100
        const w = 0.07 + ((i * 13 + r) % 4) / 100
        out.push({ pos: [0, 0.06 + r * 0.45 + h / 2, z + w / 2], size: [0.28, h, w], color: bookColors[(i + r * 2) % bookColors.length] })
        z += w + 0.012
      })
      // a few anonymous books to fill the shelf
      for (let k = 0; k < 4 && z < 0.5; k++) {
        const h = 0.24 + (k % 3) * 0.03
        out.push({ pos: [0, 0.06 + r * 0.45 + h / 2, z + 0.04], size: [0.26, h, 0.07], color: '#3a3f6b' })
        z += 0.085
      }
    })
    return out
  }, [])
  const leds = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    leds.current.children.forEach((m, i) => {
      m.visible = Math.sin(clock.elapsedTime * (3 + i * 2.3) + i) > -0.2
    })
  })
  return (
    <Hotspot id="bookshelf" section="stack" label="Tech stack" pin={[0.3, 2.15, 0]} position={[-2.72, 0, 0.1]}>
      {/* frame */}
      <mesh position={[0, 0.95, -0.72]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.9, 0.04]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.95, 0.72]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.9, 0.04]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.03 + i * 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.03, 1.48]} />
          <meshStandardMaterial color={palette.wood} roughness={0.7} />
        </mesh>
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} roughness={0.8} />
        </mesh>
      ))}
      {/* tiny router on top, with blinking lights */}
      <mesh position={[0.02, 1.86, 0.3]} castShadow>
        <boxGeometry args={[0.18, 0.04, 0.26]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.5} />
      </mesh>
      <group ref={leds}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.112, 1.865, 0.22 + i * 0.05]}>
            <boxGeometry args={[0.005, 0.01, 0.015]} />
            <meshBasicMaterial color={i === 2 ? palette.amber : '#7be08e'} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  )
}

/* ── Whiteboard: experience timeline, drawn from content.ts ─────────── */
export function Whiteboard() {
  const tex = useMemo(
    () =>
      canvasTexture(1200, 760, (c) => {
        c.fillStyle = '#f4f1ea'
        c.fillRect(0, 0, 1200, 760)
        c.strokeStyle = '#2B3160'
        c.lineWidth = 6
        c.lineCap = 'round'
        c.beginPath()
        c.moveTo(80, 380)
        c.bezierCurveTo(400, 372, 800, 390, 1120, 378)
        c.stroke()
        const items = [...experience].reverse()
        items.forEach((e, i) => {
          const x = 140 + i * (920 / Math.max(1, items.length - 1))
          const up = i % 2 === 0
          c.fillStyle = i === items.length - 1 ? '#c9573b' : '#2B3160'
          c.beginPath()
          c.arc(x, 380, 14, 0, Math.PI * 2)
          c.fill()
          c.textAlign = 'center'
          c.fillStyle = '#2B3160'
          c.font = 'italic 46px "Instrument Serif", serif'
          c.fillText(e.when.split(' ')[0], x, up ? 300 : 480)
          c.font = '500 26px Geist, sans-serif'
          c.fillStyle = '#3d4580'
          c.fillText(e.org, x, up ? 250 : 525)
        })
        c.textAlign = 'left'
        c.fillStyle = '#c9573b'
        c.font = 'italic 56px "Instrument Serif", serif'
        c.fillText('the road so far', 80, 110)
      }),
    [],
  )
  return (
    <Hotspot id="whiteboard" section="experience" label="Experience" pin={[0, 0.62, 0.05]} position={[1.75, 1.75, -2.78]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.56, 1.0, 0.03]} />
        <meshStandardMaterial color="#b7b9cc" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[1.5, 0.95]} />
        <meshStandardMaterial map={tex} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.52, 0.04]} castShadow>
        <boxGeometry args={[1.2, 0.025, 0.06]} />
        <meshStandardMaterial color="#b7b9cc" metalness={0.5} roughness={0.4} />
      </mesh>
    </Hotspot>
  )
}
