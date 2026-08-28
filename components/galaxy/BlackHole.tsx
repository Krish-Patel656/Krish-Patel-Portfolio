"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

export const BLACK_HOLE_POSITION: [number, number, number] = [0, 0, 0]

export default function BlackHole({ active }: { active: boolean }) {
  const disk = useRef<THREE.Group>(null)
  const lens = useRef<THREE.Mesh>(null)
  const outer = useRef<THREE.Mesh>(null)

  useFrame((state, dt) => {
    if (disk.current) disk.current.rotation.z -= dt * (active ? 3.8 : 0.42)
    if (lens.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.055
      lens.current.scale.setScalar(pulse * (active ? 1.35 : 1))
    }
    if (outer.current) {
      const material = outer.current.material as THREE.MeshBasicMaterial
      material.opacity = active ? 0.42 : 0.18
    }
  })

  return (
    <group position={BLACK_HOLE_POSITION}>
      <mesh ref={lens}>
        <sphereGeometry args={[2.65, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={outer}>
        <sphereGeometry args={[3.1, 48, 48]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <group ref={disk} rotation={[Math.PI / 2.35, 0.18, 0]}>
        {[
          { inner: 3.15, outer: 3.55, color: "#fef3c7", opacity: 0.85 },
          { inner: 3.62, outer: 4.35, color: "#fb7185", opacity: 0.62 },
          { inner: 4.42, outer: 5.4, color: "#8b5cf6", opacity: 0.38 },
          { inner: 5.5, outer: 6.4, color: "#38bdf8", opacity: 0.14 },
        ].map((ring) => (
          <mesh key={ring.inner}>
            <ringGeometry args={[ring.inner, ring.outer, 96]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={ring.opacity}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      <pointLight color="#a78bfa" intensity={active ? 12 : 6} distance={24} />
      <Html center position={[0, 5.8, 0]} distanceFactor={18} zIndexRange={[0, 0]}>
        <div className="anomaly-label">
          {active ? "EVENT HORIZON BREACH" : "GALACTIC CORE · KEEP CLEAR"}
        </div>
      </Html>
    </group>
  )
}
