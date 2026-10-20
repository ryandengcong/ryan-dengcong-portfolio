import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

function Knot({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (reducedMotion || !group.current || !knot.current) return
    const step = Math.min(delta, 0.05)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * 0.13, 2, step)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.2, 2, step)
    knot.current.rotation.y += step * 0.09
    knot.current.rotation.z += step * 0.035
    knot.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.045
  })

  return (
    <group ref={group} rotation={[0.12, 0.12, 0]}>
      <mesh ref={knot} rotation={[0.5, -0.3, -0.55]} scale={0.88}>
        <torusKnotGeometry args={[1.22, 0.37, 220, 40, 2, 3]} />
        <meshPhysicalMaterial color="#9ca6b9" metalness={0.92} roughness={0.24} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[1.35, 1.15, -0.2]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#89aef5" metalness={0.6} roughness={0.25} />
      </mesh>
      <Environment resolution={128}>
        <Lightformer intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[7, 3, 1]} />
        <Lightformer intensity={4} color="#e1e8ff" position={[-4, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 6, 1]} />
        <Lightformer intensity={2} color="#688bc8" position={[4, -1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 5, 1]} />
        <Lightformer intensity={1.3} color="#ffffff" position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 3, 1]} />
      </Environment>
    </group>
  )
}

export function StaticSculpture() {
  return (
    <div className="static-sculpture" data-testid="sculpture-fallback">
      <svg viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="metal" x1="100" y1="70" x2="390" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0f3fa" /><stop offset=".26" stopColor="#8896b2" />
            <stop offset=".5" stopColor="#30394b" /><stop offset=".74" stopColor="#b3bdcf" /><stop offset="1" stopColor="#495a78" />
          </linearGradient>
          <linearGradient id="metal-front" x1="150" y1="110" x2="350" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d5deee" /><stop offset=".45" stopColor="#7d8da7" /><stop offset="1" stopColor="#263143" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="255" rx="116" ry="167" transform="rotate(-38 250 255)" stroke="url(#metal)" strokeWidth="48" />
        <ellipse cx="250" cy="255" rx="116" ry="167" transform="rotate(38 250 255)" stroke="url(#metal-front)" strokeWidth="48" />
        <path d="M150 121C75 178 116 335 222 383" stroke="url(#metal)" strokeWidth="48" strokeLinecap="round" />
        <circle cx="391" cy="112" r="8" fill="#8eaee6" />
      </svg>
    </div>
  )
}

export default function Sculpture({ reducedMotion }: { reducedMotion: boolean }) {
  const [lost, setLost] = useState(false)
  const cleanup = useRef<(() => void) | null>(null)
  useEffect(() => () => cleanup.current?.(), [])

  if (lost) return <StaticSculpture />

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 43 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      fallback={<StaticSculpture />}
      onCreated={({ gl }) => {
        const canvas = gl.domElement
        const onLost = (event: Event) => { event.preventDefault(); setLost(true) }
        canvas.addEventListener('webglcontextlost', onLost)
        cleanup.current = () => canvas.removeEventListener('webglcontextlost', onLost)
      }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Suspense fallback={null}><Knot reducedMotion={reducedMotion} /></Suspense>
    </Canvas>
  )
}
