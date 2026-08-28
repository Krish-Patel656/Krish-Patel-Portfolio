"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { RefObject } from "react"
import Exhaust from "./Exhaust"

export default function Ship({
  innerRef,
  boostRef,
  speedRef,
}: {
  innerRef: RefObject<THREE.Group | null>
  boostRef: RefObject<boolean>
  speedRef: RefObject<number>
}) {
  const glow = useRef<THREE.Mesh>(null)
  const glowB = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const canopy = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const boosting = boostRef.current
    const pulse = 0.9 + Math.sin(t * (boosting ? 22 : 12)) * 0.2
    if (glow.current) glow.current.scale.setScalar(pulse * (boosting ? 1.55 : 1))
    if (glowB.current) glowB.current.scale.setScalar(pulse * (boosting ? 1.55 : 1))
    if (light.current) light.current.intensity = boosting ? 7.5 : 3.2
    if (canopy.current) {
      const mat = canopy.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = boosting ? 1.8 : 0.9
    }
  })

  return (
    <group ref={innerRef} scale={2.35}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 1.35, 5]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.82}
          roughness={0.18}
          emissive="#0f172a"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, 0.08, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh ref={canopy} position={[0, 0.14, 0.2]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.13, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.48, 0, -0.06]} rotation={[0.15, 0, 0.42]}>
        <boxGeometry args={[0.72, 0.04, 0.32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.85} metalness={0.4} />
      </mesh>
      <mesh position={[-0.48, 0, -0.06]} rotation={[0.15, 0, -0.42]}>
        <boxGeometry args={[0.72, 0.04, 0.32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.85} metalness={0.4} />
      </mesh>
      <mesh position={[0.22, -0.04, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.28, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      <mesh position={[-0.22, -0.04, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.28, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      <mesh ref={glow} position={[0.22, -0.04, -0.58]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowB} position={[-0.22, -0.04, -0.58]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.55, 8]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
      </mesh>
      <Exhaust boostRef={boostRef} speedRef={speedRef} />
      <pointLight ref={light} position={[0, 0, -0.7]} color="#67e8f9" intensity={3.2} distance={10} />
    </group>
  )
}
