"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function makeSpiral(count: number, arms: number, spread: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [
    new THREE.Color("#67e8f9"),
    new THREE.Color("#c084fc"),
    new THREE.Color("#818cf8"),
    new THREE.Color("#f5d0fe"),
    new THREE.Color("#38bdf8"),
    new THREE.Color("#e0e7ff"),
  ]

  for (let i = 0; i < count; i++) {
    const arm = i % arms
    const radius = Math.pow(Math.random(), 0.55) * spread
    const spin = radius * 0.55
    const angle = (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.45
    const y = (Math.random() - 0.5) * (0.6 + radius * 0.04)

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const c = palette[i % palette.length].clone()
    c.multiplyScalar(0.55 + Math.random() * 0.7)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  return { positions, colors }
}

export default function GalaxyDust() {
  const points = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => makeSpiral(4200, 4, 52), [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  useFrame((_, dt) => {
    if (points.current) points.current.rotation.y += dt * 0.012
  })

  return (
    <points ref={points} geometry={geometry} rotation={[-0.18, 0, 0.08]}>
      <pointsMaterial
        size={0.085}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
