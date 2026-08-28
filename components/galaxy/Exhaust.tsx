"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { RefObject } from "react"

const COUNT = 56

export default function Exhaust({
  boostRef,
  speedRef,
}: {
  boostRef: RefObject<boolean>
  speedRef: RefObject<number>
}) {
  const points = useRef<THREE.Points>(null)
  const { positions, geo } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.08
      positions[i * 3 + 2] = -0.55 - Math.random() * 2.4
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return { positions, geo }
  }, [])

  const ages = useRef(Float32Array.from({ length: COUNT }, () => Math.random()))

  useFrame((_, dt) => {
    const boosting = boostRef.current
    const speed = speedRef.current
    const intensity = Math.min(1, speed / 18) * 0.55 + (boosting ? 0.55 : 0.12)
    const attr = geo.getAttribute("position") as THREE.BufferAttribute

    for (let i = 0; i < COUNT; i++) {
      ages.current[i] += dt * (1.8 + intensity * 4)
      if (ages.current[i] > 1) {
        ages.current[i] = 0
        positions[i * 3] = (Math.random() - 0.5) * (boosting ? 0.28 : 0.14)
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1
        positions[i * 3 + 2] = -0.55
      }
      positions[i * 3 + 2] -= dt * (3.2 + intensity * 10)
      attr.setXYZ(i, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
    }
    attr.needsUpdate = true

    const mat = points.current?.material as THREE.PointsMaterial | undefined
    if (mat) {
      mat.size = boosting ? 0.16 : 0.08
      mat.opacity = 0.25 + intensity * 0.7
      mat.color.set(boosting ? "#c4b5fd" : "#67e8f9")
    }
  })

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial
        size={0.09}
        color="#67e8f9"
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
