"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars, Sparkles } from "@react-three/drei"
import * as THREE from "three"
import { SECTORS } from "@/lib/content"
import GalaxyDust from "./GalaxyDust"
import Planet from "./Planet"
import Ship from "./Ship"
import Atmosphere from "./Atmosphere"
import BlackHole, { BLACK_HOLE_POSITION } from "./BlackHole"
import { playWhoosh } from "@/lib/sfx"
import { pushShipState } from "@/lib/shipBus"
import { getOrbitPoint, ORBIT_RADII } from "@/lib/orbits"

const SPEED = 26
const BOOST = 2.7
const DAMP = 0.905
const INTERACT = 8.4
const BOUNDS = 60

type Keys = Record<string, boolean>

export default function Scene({
  paused,
  nearestId,
  onNearest,
  autopilotId,
  onAutopilotArrive,
  extraKeys,
  onPilotTo,
  boostLocked,
  warping,
  revealedIds,
  onReveal,
  blackHoleActive,
  onBlackHole,
}: {
  paused: boolean
  nearestId: string | null
  onNearest: (id: string | null) => void
  autopilotId: string | null
  onAutopilotArrive: () => void
  extraKeys: Keys
  onPilotTo: (id: string) => void
  boostLocked: boolean
  warping: boolean
  revealedIds: Set<string>
  onReveal: (id: string) => void
  blackHoleActive: boolean
  onBlackHole: () => void
}) {
  const shipRef = useRef<THREE.Group>(null)
  const keys = useRef<Keys>({})
  const vel = useRef(new THREE.Vector3())
  const pos = useRef(new THREE.Vector3(0, 0, 34))
  const lastNear = useRef<string | null>(null)
  const extra = useRef(extraKeys)
  extra.current = extraKeys
  const arriving = useRef(false)
  const dummy = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const boostRef = useRef(false)
  const speedRef = useRef(0)
  const wasBoosting = useRef(false)
  const reportAcc = useRef(0)
  const camSpring = useRef(0)
  const revealedRef = useRef(revealedIds)
  revealedRef.current = revealedIds
  const boostLockRef = useRef(boostLocked)
  boostLockRef.current = boostLocked
  const warpRef = useRef(warping)
  warpRef.current = warping
  const localReveal = useRef(new Set<string>())
  const blackHoleTriggered = useRef(false)

  useEffect(() => {
    arriving.current = false
    camSpring.current = 1
  }, [autopilotId])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase()) || e.key === " ") {
        e.preventDefault()
      }
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener("keydown", down, { passive: false })
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  useFrame((state, dt) => {
    const ship = shipRef.current
    if (!ship) return
    const clampedDt = Math.min(dt, 0.05)
    const persp = state.camera as THREE.PerspectiveCamera

    if (blackHoleActive) {
      boostRef.current = true
      dummy.set(...BLACK_HOLE_POSITION).sub(pos.current)
      const distance = Math.max(0.1, dummy.length())
      const pull = THREE.MathUtils.clamp(52 / distance, 5, 32)
      vel.current.lerp(dummy.normalize().multiplyScalar(pull), 0.12)
      pos.current.addScaledVector(vel.current, clampedDt)
      ship.rotation.z += clampedDt * (1.4 + pull * 0.08)
      const shrink = 2.35 * THREE.MathUtils.clamp(distance / 8, 0.04, 1)
      ship.scale.lerp(dummy.setScalar(shrink), 0.08)
    } else if (!paused) {
      const k = keys.current
      const pressed = (code: string) => !!(k[code] || extra.current[code])
      const boosting = boostLockRef.current || pressed("shift")
      boostRef.current = boosting
      if (boosting && !wasBoosting.current) playWhoosh()
      wasBoosting.current = boosting
      const boost = boosting ? BOOST : 1
      const ax = (pressed("d") || pressed("arrowright") ? 1 : 0) - (pressed("a") || pressed("arrowleft") ? 1 : 0)
      const az = (pressed("s") || pressed("arrowdown") ? 1 : 0) - (pressed("w") || pressed("arrowup") ? 1 : 0)

      if (autopilotId) {
        const sector = SECTORS.find((s) => s.id === autopilotId)
        if (sector) {
          const orbit = getOrbitPoint(sector.id, performance.now() / 1000)
          dummy.set(orbit.x, orbit.y, orbit.z + 3.6)
          dummy.sub(pos.current)
          const dist = dummy.length()
          if (dist < 1.35) {
            vel.current.set(0, 0, 0)
            if (!arriving.current) {
              arriving.current = true
              onAutopilotArrive()
            }
          } else {
            dummy.normalize().multiplyScalar(SPEED * 1.35)
            vel.current.lerp(dummy, 0.07)
          }
        }
      } else {
        vel.current.x += ax * SPEED * boost * clampedDt
        vel.current.z += az * SPEED * boost * clampedDt
        vel.current.multiplyScalar(DAMP)
      }

      pos.current.addScaledVector(vel.current, clampedDt)
      pos.current.x = THREE.MathUtils.clamp(pos.current.x, -BOUNDS, BOUNDS)
      pos.current.z = THREE.MathUtils.clamp(pos.current.z, -BOUNDS, BOUNDS)
      pos.current.y = Math.sin(state.clock.elapsedTime * 2.4) * 0.08
    }

    speedRef.current = vel.current.length()
    ship.position.copy(pos.current)

    if (blackHoleActive) {
      // The event-horizon pull controls rotation and scale above.
    } else if (vel.current.lengthSq() > 0.04) {
      const yaw = Math.atan2(vel.current.x, vel.current.z)
      let dyaw = yaw - ship.rotation.y
      while (dyaw > Math.PI) dyaw -= Math.PI * 2
      while (dyaw < -Math.PI) dyaw += Math.PI * 2
      ship.rotation.y += dyaw * 0.14
      const bank = THREE.MathUtils.clamp(-dyaw * 2.8 - vel.current.x * 0.045, -0.72, 0.72)
      ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, bank, 0.12)
      ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, vel.current.z * 0.012, 0.1)
    } else {
      ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, 0, 0.1)
      ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, 0, 0.1)
    }

    const boostingNow = boostRef.current
    const targetFov = boostingNow ? 64 : 50
    persp.fov = THREE.MathUtils.lerp(persp.fov, targetFov, 0.08)
    persp.updateProjectionMatrix()

    if (autopilotId) {
      camSpring.current = THREE.MathUtils.lerp(camSpring.current, 0, 0.045)
    } else {
      camSpring.current = THREE.MathUtils.lerp(camSpring.current, 0, 0.08)
    }
    const overshoot = camSpring.current * 4.2

    const cam = state.camera
    dummy.set(
      pos.current.x + vel.current.x * 0.12,
      pos.current.y + 17.5 + (boostingNow ? 0.4 : 0),
      pos.current.z + 16.2 + overshoot
    )
    if (warpRef.current && lastNear.current) {
      const s = SECTORS.find((p) => p.id === lastNear.current)
      if (s) {
        const orbit = getOrbitPoint(s.id, performance.now() / 1000)
        dummy.set(orbit.x, orbit.y + 5.5, orbit.z + 7)
      }
    }
    cam.position.lerp(dummy, 1 - Math.pow(0.016, clampedDt))
    if (boostingNow) {
      cam.position.x += (Math.random() - 0.5) * 0.14
      cam.position.y += (Math.random() - 0.5) * 0.1
    }
    if (blackHoleActive) {
      look.set(...BLACK_HOLE_POSITION)
    } else {
      look.set(pos.current.x, 0.5, pos.current.z)
    }
    cam.lookAt(look)

    let nearest: string | null = null
    let best = INTERACT
    for (const sector of SECTORS) {
      const orbit = getOrbitPoint(sector.id, performance.now() / 1000)
      const dx = pos.current.x - orbit.x
      const dz = pos.current.z - orbit.z
      const d = Math.hypot(dx, dz)
      if (sector.hidden && d < 14 && !localReveal.current.has(sector.id) && !revealedRef.current.has(sector.id)) {
        localReveal.current.add(sector.id)
        onReveal(sector.id)
      }
      if (d < best) {
        best = d
        nearest = sector.id
      }
    }
    if (nearest !== lastNear.current) {
      lastNear.current = nearest
      onNearest(nearest)
    }

    const holeDistance = Math.hypot(
      pos.current.x - BLACK_HOLE_POSITION[0],
      pos.current.z - BLACK_HOLE_POSITION[2]
    )
    if (holeDistance < 7 && !autopilotId && !blackHoleTriggered.current) {
      blackHoleTriggered.current = true
      onBlackHole()
    }

    reportAcc.current += clampedDt
    if (reportAcc.current > 0.05) {
      reportAcc.current = 0
      pushShipState({
        x: pos.current.x,
        z: pos.current.z,
        heading: ship.rotation.y,
        speed: speedRef.current,
        boosting: boostingNow,
      })
    }
  })

  return (
    <>
      <color attach="background" args={["#050018"]} />
      <fog attach="fog" args={["#08011c", 32, 95]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[20, 30, 10]} intensity={0.7} color="#ddd6fe" />
      <Stars radius={140} depth={70} count={4200} factor={3.4} saturation={0} fade speed={0.55} />
      <Sparkles count={90} scale={48} size={3.2} speed={0.45} color="#a5b4fc" opacity={0.6} />
      <Atmosphere />
      <GalaxyDust />
      <BlackHole active={blackHoleActive} />
      {ORBIT_RADII.map((radius) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
          <ringGeometry args={[radius - 0.025, radius + 0.025, 160]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.11}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      {SECTORS.map((sector) => (
        <Planet
          key={sector.id}
          sector={sector}
          highlighted={nearestId === sector.id}
          dimmed={!!sector.hidden && !revealedIds.has(sector.id)}
          onSelect={onPilotTo}
        />
      ))}
      <Ship innerRef={shipRef} boostRef={boostRef} speedRef={speedRef} />
    </>
  )
}
