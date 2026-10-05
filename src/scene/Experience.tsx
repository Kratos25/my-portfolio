import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Room } from './Room'
import { CameraRig } from './CameraRig'
import { Bookshelf, Duck, Lamp, Laptop, Monitor, Mug, Phone, Whiteboard } from './objects'
import { palette } from './helpers'
import { useStudio } from '../store'

export function Experience() {
  const quality = useStudio((s) => s.quality)
  const setQuality = useStudio((s) => s.setQuality)
  const close = useStudio((s) => s.close)
  const high = quality === 'high'

  return (
    <Canvas
      shadows={high ? 'percentage' : false}
      dpr={high ? [1, 2] : [1, 1.25]}
      camera={{ position: [8, 6, 9], fov: 40, near: 0.05, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      onPointerMissed={() => close()}
      aria-label="Interactive 3D studio. Use the section buttons to navigate without the 3D view."
    >
      <color attach="background" args={[palette.night]} />
      <fog attach="fog" args={[palette.night, 9, 18]} />
      <PerformanceMonitor onDecline={() => setQuality('low')} flipflops={2} />
      <AdaptiveDpr pixelated={false} />
      <CameraRig />
      <Room />
      <Monitor />
      <Laptop />
      <Mug />
      <Phone />
      <Lamp />
      <Duck />
      <Bookshelf />
      <Whiteboard />
      {high && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.85} intensity={0.6} radius={0.6} />
          <Vignette offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
