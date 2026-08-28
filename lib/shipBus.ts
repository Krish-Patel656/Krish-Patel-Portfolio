export type ShipState = {
  x: number
  z: number
  heading: number
  speed: number
  boosting: boolean
}

type Fn = (s: ShipState) => void
const listeners = new Set<Fn>()

export const DEFAULT_SHIP: ShipState = {
  x: 0,
  z: 34,
  heading: 0,
  speed: 0,
  boosting: false,
}

export function pushShipState(s: ShipState) {
  listeners.forEach((fn) => fn(s))
}

export function subscribeShipState(fn: Fn) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
