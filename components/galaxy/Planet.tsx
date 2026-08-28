"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import type { RefObject } from "react"
import type { Sector } from "@/lib/content"
import { getOrbitPoint } from "@/lib/orbits"

function Body({ sector, ringRef }: { sector: Sector; ringRef: RefObject<THREE.Group | null> }) {
  const { shape, color, emissive, size } = sector
  const core = (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.85}
      roughness={0.28}
      metalness={0.25}
    />
  )

  if (shape === "station") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[size * 1.5, size * 0.5, size * 1.5]} />
          {core}
        </mesh>
        <mesh position={[0, size * 0.65, 0]}>
          <cylinderGeometry args={[0.16, 0.16, size * 1.35, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} />
        </mesh>
        <mesh position={[0, size * 1.35, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    )
  }

  if (shape === "rings") {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[size, 48, 48]} />
          {core}
        </mesh>
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2.3, 0, 0.25]}>
            <ringGeometry args={[size * 1.4, size * 1.78, 80]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2.15, 0.1, -0.1]}>
            <ringGeometry args={[size * 1.9, size * 2.15, 80]} />
            <meshBasicMaterial color="#fde68a" side={THREE.DoubleSide} transparent opacity={0.55} />
          </mesh>
        </group>
      </group>
    )
  }

  if (shape === "iris") {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial color="#ecfeff" emissive={emissive} emissiveIntensity={0.4} roughness={0.15} />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 0.64, 32, 32]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 0.28, 16, 16]} />
          <meshStandardMaterial color="#042f2e" />
        </mesh>
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.12, 0.08, 10, 64]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      </group>
    )
  }

  if (shape === "nebula") {
    return (
      <mesh>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.15} roughness={0.2} />
      </mesh>
    )
  }

  if (shape === "campus") {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[size, 40, 40]} />
          {core}
        </mesh>
        <group ref={ringRef}>
          <mesh position={[0, size * 0.12, 0]} rotation={[0.4, 0.2, 0]}>
            <torusGeometry args={[size * 0.82, 0.09, 8, 32]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
        </group>
      </group>
    )
  }

  if (shape === "road") {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[size, 40, 40]} />
          {core}
        </mesh>
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.22, 0.09, 8, 56]} />
            <meshBasicMaterial color="#bbf7d0" />
          </mesh>
        </group>
      </group>
    )
  }

  if (shape === "cell") {
    return (
      <mesh>
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.05} roughness={0.25} />
      </mesh>
    )
  }

  if (shape === "graph") {
    return (
      <group>
        <mesh>
          <octahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.9} wireframe />
        </mesh>
        <mesh>
          <octahedronGeometry args={[size * 0.58, 0]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.2} />
        </mesh>
      </group>
    )
  }

  if (shape === "cluster") {
    const offsets: [number, number, number][] = [
      [0, 0, 0],
      [0.85, 0.5, 0.25],
      [-0.75, 0.35, -0.45],
      [0.4, -0.55, 0.6],
      [-0.5, -0.25, 0.7],
    ]
    return (
      <group>
        {offsets.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[size * (0.32 + i * 0.06), 20, 20]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.16, 0.28, size * 2.3, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} />
      </mesh>
      <mesh position={[0, size * 1.2, 0]}>
        <sphereGeometry args={[size * 0.5, 20, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group ref={ringRef}>
        <mesh position={[0, size * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.82, 0.07, 8, 40]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}

function Moons({
  tags,
  size,
  color,
  fast,
}: {
  tags: string[]
  size: number
  color: string
  fast: boolean
}) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * (fast ? 0.85 : 0.28)
  })
  const moons = tags.slice(0, 4)
  return (
    <group ref={group}>
      {moons.map((tag, i) => {
        const r = size * 2.15 + i * 0.38
        const a = (i / moons.length) * Math.PI * 2
        return (
          <group key={tag} position={[Math.cos(a) * r, Math.sin(i) * 0.25, Math.sin(a) * r]}>
            <mesh>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
            </mesh>
            {fast && (
              <Html center distanceFactor={22} zIndexRange={[0, 0]}>
                <div className="moon-label">{tag}</div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function Planet({
  sector,
  highlighted,
  dimmed,
  onSelect,
}: {
  sector: Sector
  highlighted: boolean
  dimmed: boolean
  onSelect: (id: string) => void
}) {
  const spin = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)
  const aura = useRef<THREE.Mesh>(null)
  const root = useRef<THREE.Group>(null)
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1))

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (spin.current) spin.current.rotation.y += dt * (highlighted ? 0.42 : 0.16)
    if (ringRef.current) ringRef.current.rotation.z += dt * (highlighted ? 1.1 : 0.22)
    if (aura.current) {
      const s = (highlighted ? 1.28 : 1) + Math.sin(t * (highlighted ? 4.2 : 1.8)) * 0.08
      aura.current.scale.setScalar(s)
      const mat = aura.current.material as THREE.MeshBasicMaterial
      mat.opacity = highlighted ? 0.32 : dimmed ? 0.05 : 0.14
    }
    if (root.current) {
      const orbit = getOrbitPoint(sector.id, performance.now() / 1000)
      root.current.position.set(orbit.x, orbit.y, orbit.z)
      const t = dimmed ? 0.55 : 1
      scaleTarget.current.set(t, t, t)
      root.current.scale.lerp(scaleTarget.current, 0.06)
    }
  })

  return (
    <group
      ref={root}
      position={[getOrbitPoint(sector.id, 0).x, 0, getOrbitPoint(sector.id, 0).z]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(sector.id)
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto"
      }}
    >
      <group ref={spin}>
        <Body sector={sector} ringRef={ringRef} />
      </group>
      {sector.tags && sector.tags.length > 0 && (
        <Moons tags={sector.tags} size={sector.size} color={sector.color} fast={highlighted} />
      )}
      <mesh ref={aura}>
        <sphereGeometry args={[sector.size * 2.05, 28, 28]} />
        <meshBasicMaterial color={sector.color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <pointLight color={sector.color} intensity={highlighted ? 6.5 : 3.2} distance={18} />
      <Html center position={[0, sector.size + 1.55, 0]} distanceFactor={16} zIndexRange={[0, 0]}>
        <div
          className="planet-label"
          style={{
            color: sector.color,
            borderColor: `${sector.color}88`,
            opacity: dimmed ? 0.35 : 1,
          }}
        >
          {sector.name}
        </div>
      </Html>
    </group>
  )
}
