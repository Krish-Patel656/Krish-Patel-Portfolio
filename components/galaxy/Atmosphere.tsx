"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function ParallaxLayer({
  count,
  spread,
  y,
  factor,
  size,
}: {
  count: number
  spread: number
  y: number
  factor: number
  size: number
}) {
  const group = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [count, spread, y])

  useFrame(() => {
    if (!group.current) return
    group.current.position.x = camera.position.x * factor
    group.current.position.z = camera.position.z * factor
  })

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          size={size}
          color="#e2e8f0"
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function Nebula() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh scale={70}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            vec3 p = vPos * 1.8;
            float n = 0.5 + 0.5 * sin(p.x * 2.1 + uTime * 0.07) * sin(p.y * 1.4 + 0.4) * sin(p.z * 1.8 + uTime * 0.05);
            n += 0.25 * sin(p.x * 4.0 + p.z * 3.0 + uTime * 0.1);
            vec3 a = vec3(0.18, 0.04, 0.38);
            vec3 b = vec3(0.03, 0.18, 0.32);
            vec3 c = vec3(0.08, 0.02, 0.16);
            vec3 col = mix(c, mix(a, b, n), smoothstep(0.2, 0.85, n));
            float alpha = 0.22 + n * 0.28;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  )
}

function Comet({ delay }: { delay: number }) {
  const ref = useRef<THREE.Group>(null)
  const seed = useMemo(
    () => ({
      origin: new THREE.Vector3(-48 + Math.random() * 10, 6 + Math.random() * 8, -30 + Math.random() * 40),
      dir: new THREE.Vector3(1.1, -0.08, 0.35 + Math.random() * 0.4).normalize(),
    }),
    []
  )

  useFrame((state) => {
    if (!ref.current) return
    const t = ((state.clock.elapsedTime + delay) % 11) / 11
    const dist = t * 90
    ref.current.position.copy(seed.origin).addScaledVector(seed.dir, dist)
    ref.current.lookAt(ref.current.position.clone().add(seed.dir))
    ref.current.visible = t > 0.04 && t < 0.92
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.9]}>
        <coneGeometry args={[0.07, 1.8, 6]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.45} />
      </mesh>
      <pointLight color="#bfdbfe" intensity={1.4} distance={6} />
    </group>
  )
}

export default function Atmosphere() {
  return (
    <>
      <Nebula />
      <ParallaxLayer count={900} spread={160} y={-18} factor={0.12} size={0.09} />
      <ParallaxLayer count={500} spread={120} y={4} factor={0.28} size={0.07} />
      <ParallaxLayer count={220} spread={90} y={16} factor={0.48} size={0.05} />
      <Comet delay={0} />
      <Comet delay={4.2} />
      <Comet delay={7.8} />
    </>
  )
}
