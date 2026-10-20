import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type PointerTarget = { x: number; y: number }

function Knot({ reducedMotion, pointerTarget, keyLight }: { reducedMotion: boolean; pointerTarget: RefObject<PointerTarget>; keyLight: RefObject<THREE.DirectionalLight | null> }) {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)
  const reflections = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')
    if (!context) return null

    const background = context.createLinearGradient(0, 0, 0, canvas.height)
    background.addColorStop(0, '#111722')
    background.addColorStop(0.48, '#8993a3')
    background.addColorStop(0.52, '#242b37')
    background.addColorStop(1, '#080b11')
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Broad, soft studio panels create calm metallic highlights without postprocessing.
    const panels = [
      { x: 110, width: 90, color: '#dce5f5' },
      { x: 365, width: 180, color: '#ffffff' },
      { x: 730, width: 110, color: '#829dc9' },
    ]
    for (const panel of panels) {
      const gradient = context.createLinearGradient(panel.x, 0, panel.x + panel.width, 0)
      gradient.addColorStop(0, '#ffffff00')
      gradient.addColorStop(0.5, `${panel.color}aa`)
      gradient.addColorStop(1, '#ffffff00')
      context.fillStyle = gradient
      context.fillRect(panel.x, 48, panel.width, 420)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  useEffect(() => () => reflections?.dispose(), [reflections])

  useFrame((state, delta) => {
    if (reducedMotion || !group.current || !knot.current) return
    const step = Math.min(delta, 0.05)
    const pointer = pointerTarget.current
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.12 + pointer.y * 0.075, 2.4, step)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0.12 + pointer.x * 0.11, 2.4, step)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.24) * 0.022
    knot.current.rotation.y += step * 0.055
    knot.current.rotation.z += step * 0.02
    if (keyLight.current) {
      keyLight.current.position.x = THREE.MathUtils.damp(keyLight.current.position.x, 3 + pointer.x * 0.35, 2, step)
      keyLight.current.position.y = THREE.MathUtils.damp(keyLight.current.position.y, 5 + pointer.y * 0.25, 2, step)
    }
  })

  return (
    <group ref={group} rotation={[0.12, 0.12, 0]}>
      <mesh ref={knot} rotation={[0.5, -0.3, -0.55]} scale={0.88}>
        <torusKnotGeometry args={[1.22, 0.37, 160, 28, 2, 3]} />
        <meshPhysicalMaterial color="#9ca6b9" metalness={0.88} roughness={0.3} envMap={reflections ?? undefined} envMapIntensity={0.8} clearcoat={0.4} clearcoatRoughness={0.26} />
      </mesh>
      <mesh position={[1.35, 1.15, -0.2]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#89aef5" metalness={0.6} roughness={0.25} />
      </mesh>
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

export default function Sculpture({ reducedMotion, pointerTarget }: { reducedMotion: boolean; pointerTarget: RefObject<PointerTarget> }) {
  const [lost, setLost] = useState(false)
  const [coarsePointer] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const cleanup = useRef<(() => void) | null>(null)
  const keyLight = useRef<THREE.DirectionalLight>(null)
  useEffect(() => () => cleanup.current?.(), [])

  if (lost) return <StaticSculpture />

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 43 }}
      dpr={coarsePointer ? [1, 1.1] : [1, 1.35]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ antialias: !coarsePointer, alpha: true, powerPreference: 'low-power' }}
      fallback={<StaticSculpture />}
      onCreated={({ gl }) => {
        const canvas = gl.domElement
        const onLost = (event: Event) => { event.preventDefault(); setLost(true) }
        canvas.addEventListener('webglcontextlost', onLost)
        cleanup.current = () => canvas.removeEventListener('webglcontextlost', onLost)
      }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight ref={keyLight} position={[3, 5, 4]} intensity={2} />
      <Knot reducedMotion={reducedMotion} pointerTarget={pointerTarget} keyLight={keyLight} />
    </Canvas>
  )
}
