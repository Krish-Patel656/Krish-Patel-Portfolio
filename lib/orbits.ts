type Orbit = {
  radius: number
  phase: number
  speed: number
  tilt: number
}

export const ORBITS: Record<string, Orbit> = {
  command: { radius: 15, phase: -1.55, speed: 0.035, tilt: 0.25 },
  utd: { radius: 21, phase: -0.35, speed: 0.028, tilt: -0.2 },
  contact: { radius: 21, phase: 2.75, speed: 0.028, tilt: 0.15 },
  echostar: { radius: 28, phase: -2.75, speed: 0.022, tilt: -0.28 },
  nebula: { radius: 28, phase: 0.42, speed: 0.022, tilt: 0.3 },
  eyesnow: { radius: 35, phase: 2.48, speed: 0.018, tilt: 0.18 },
  safeway: { radius: 35, phase: -0.92, speed: 0.018, tilt: -0.22 },
  biosight: { radius: 42, phase: -2.15, speed: 0.015, tilt: 0.24 },
  mapscrib: { radius: 42, phase: -0.32, speed: 0.015, tilt: -0.17 },
  skills: { radius: 49, phase: 0.72, speed: 0.012, tilt: 0.2 },
  funfacts: { radius: 49, phase: 2.92, speed: 0.012, tilt: -0.24 },
}

export const ORBIT_RADII = [15, 21, 28, 35, 42, 49]

export function getOrbitPoint(id: string, timeSeconds: number) {
  const orbit = ORBITS[id]
  if (!orbit) return { x: 0, y: 0, z: 0 }

  const angle = orbit.phase + (timeSeconds % 20000) * orbit.speed
  return {
    x: Math.cos(angle) * orbit.radius,
    y: Math.sin(angle * 1.7) * orbit.tilt,
    z: Math.sin(angle) * orbit.radius,
  }
}
