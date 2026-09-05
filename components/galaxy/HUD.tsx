"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PROFILE, SECTORS, HUD_GROUPS, type Sector } from "@/lib/content"
import { DEFAULT_SHIP, subscribeShipState, type ShipState } from "@/lib/shipBus"
import { getOrbitPoint } from "@/lib/orbits"

export default function HUD({
  nearest,
  docked,
  scanned,
  onToggleArchive,
  archiveOpen,
  onPilotTo,
  onDock,
  boostLocked,
  onToggleBoost,
  muted,
  onToggleMute,
  revealedIds,
}: {
  nearest: Sector | null
  docked: boolean
  scanned: Set<string>
  onToggleArchive: () => void
  archiveOpen: boolean
  onPilotTo: (id: string) => void
  onDock: () => void
  boostLocked: boolean
  onToggleBoost: () => void
  muted: boolean
  onToggleMute: () => void
  revealedIds: Set<string>
}) {
  const [ship, setShip] = useState<ShipState>(DEFAULT_SHIP)
  useEffect(() => subscribeShipState(setShip), [])
  const visible = useMemo(
    () => SECTORS.filter((s) => !s.hidden || revealedIds.has(s.id) || scanned.has(s.id)),
    [revealedIds, scanned]
  )
  const progress = Math.round((scanned.size / SECTORS.length) * 100)

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div
        className="speed-lines"
        style={{ opacity: Math.min(0.75, ship.speed / 28) * (ship.boosting ? 1 : 0.55) }}
      />
      <div className="hud-frame">
        <span className="hud-corners-bl" />
        <span className="hud-corners-br" />
      </div>

      <header className="pointer-events-auto absolute left-5 top-5 right-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[10px] tracking-[0.35em] text-cyan-300/80 glow-cyan">
            NEBULA EXPLORER // {PROFILE.name.toUpperCase()}
          </p>
          <h1 className="mt-1 font-display text-lg sm:text-xl tracking-[0.18em] text-white">
            {PROFILE.role.toUpperCase()}
          </h1>
          <p className="mt-1 text-[11px] tracking-widest text-slate-400">
            X {ship.x.toFixed(0)} · Z {ship.z.toFixed(0)} · SPD {ship.speed.toFixed(0)}
            {ship.boosting ? " · AFTERBURNER" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            className="max-w-[140px] border border-cyan-400/30 bg-black/60 px-2 py-1.5 font-display text-[10px] tracking-wider text-cyan-100 md:hidden"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) onPilotTo(e.target.value)
            }}
          >
            <option value="" disabled>
              JUMP TO
            </option>
            {HUD_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {visible
                  .filter((s) => g.types.includes(s.type) && (!s.hidden || g.id === "stations"))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={onToggleBoost}
            className={`border px-3 py-1.5 font-display text-[10px] tracking-[0.22em] ${
              boostLocked
                ? "border-fuchsia-400/70 bg-fuchsia-500/25 text-fuchsia-100"
                : "border-fuchsia-400/30 bg-black/40 text-fuchsia-200 hover:bg-fuchsia-400/10"
            }`}
          >
            {boostLocked ? "BOOST ON" : "BOOST"}
          </button>
          <button
            onClick={onToggleMute}
            className="border border-slate-400/30 bg-black/40 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-slate-200 hover:bg-white/10"
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
          <button
            onClick={onToggleArchive}
            className="border border-cyan-400/30 bg-black/40 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-cyan-200 hover:bg-cyan-400/10"
          >
            {archiveOpen ? "CLOSE LOGS" : "MISSION LOGS"}
          </button>
          <Link
            href="/#from-galaxy"
            className="border border-emerald-400/30 bg-black/40 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-emerald-200 hover:bg-emerald-400/10"
          >
            CLASSIC VIEW
          </Link>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-fuchsia-400/30 bg-black/40 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-fuchsia-200 hover:bg-fuchsia-400/10"
          >
            GITHUB
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-blue-400/30 bg-black/40 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-blue-200 hover:bg-blue-400/10"
          >
            LINKEDIN
          </a>
        </div>
      </header>

      <div className="pointer-events-auto absolute right-5 top-24 hidden w-56 md:block">
        <div className="panel-glass max-h-[58vh] overflow-y-auto p-3">
          <p className="font-display text-[9px] tracking-[0.28em] text-cyan-300/70">
            SECTORS SCANNED {scanned.size}/{SECTORS.length}
          </p>
          <div className="mt-2 h-1 w-full bg-white/10">
            <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
          </div>
          {HUD_GROUPS.map((g) => {
            const items = visible.filter((s) => g.types.includes(s.type))
            if (!items.length) return null
            return (
              <div key={g.id} className="mt-3">
                <p className="font-display text-[9px] tracking-[0.28em] text-slate-400">{g.label}</p>
                <ul className="mt-1 space-y-0.5">
                  {items.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => onPilotTo(s.id)}
                        className="flex w-full items-center gap-2 px-1 py-1 text-left text-[11px] text-slate-300 hover:text-white"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: scanned.has(s.id) ? s.color : "#334155",
                            boxShadow: scanned.has(s.id) ? `0 0 8px ${s.color}` : "none",
                          }}
                        />
                        <span className="truncate tracking-wide">{s.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-5 hidden text-[10px] tracking-[0.2em] text-slate-400 sm:block">
        <p className="font-display text-cyan-200/70">CONTROLS</p>
        <p className="mt-1">WASD / ARROWS — THRUST</p>
        <p>SHIFT / BOOST — AFTERBURNER</p>
        <p>CLICK PLANET — AUTOPILOT · E — DOCK</p>
      </div>

      <div className="pointer-events-auto absolute bottom-6 right-5 hidden md:block">
        <MiniMap
          nearestId={nearest?.id ?? null}
          scanned={scanned}
          onPilotTo={onPilotTo}
          ship={ship}
          visible={visible}
        />
      </div>

      {nearest && !docked && (
        <div className="pointer-events-auto absolute bottom-8 left-1/2 w-[min(92vw,420px)] -translate-x-1/2">
          <button onClick={onDock} className="panel-glass w-full px-5 py-4 text-left">
            <p className="font-display text-[10px] tracking-[0.3em] text-cyan-300">
              IN RANGE · {nearest.callsign}
            </p>
            <p className="mt-1 font-display text-lg tracking-[0.12em] text-white">{nearest.name}</p>
            <p className="text-sm text-slate-300">{nearest.subtitle}</p>
            <p className="mt-2 font-display text-[11px] tracking-[0.25em] text-cyan-200 flicker">
              PRESS [ E ] TO DOCK
            </p>
          </button>
        </div>
      )}
    </div>
  )
}

function MiniMap({
  nearestId,
  scanned,
  onPilotTo,
  ship,
  visible,
}: {
  nearestId: string | null
  scanned: Set<string>
  onPilotTo: (id: string) => void
  ship: ShipState
  visible: Sector[]
}) {
  const size = 168
  const pad = 12
  const minX = -58
  const maxX = 58
  const minZ = -58
  const maxZ = 58
  const sx = (x: number) => pad + ((x - minX) / (maxX - minX)) * (size - pad * 2)
  const sz = (z: number) => pad + ((z - minZ) / (maxZ - minZ)) * (size - pad * 2)
  const cx = size / 2
  const cy = size / 2
  const shipX = sx(ship.x)
  const shipY = sz(ship.z)
  const rot = (ship.heading * 180) / Math.PI
  const orbitTime = typeof performance === "undefined" ? 0 : performance.now() / 1000

  return (
    <div className="panel-glass p-2">
      <p className="mb-1 px-1 font-display text-[8px] tracking-[0.28em] text-cyan-300/70">RADAR</p>
      <svg width={size} height={size} className="block overflow-hidden">
        <rect width={size} height={size} fill="#030014" />
        <circle cx={cx} cy={cy} r={size * 0.42} fill="none" stroke="rgba(103,232,249,0.12)" />
        <circle cx={cx} cy={cy} r={size * 0.28} fill="none" stroke="rgba(103,232,249,0.1)" />
        <g className="radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path
            d={`M ${cx} ${cy} L ${cx} ${pad} A ${size / 2 - pad} ${size / 2 - pad} 0 0 1 ${cx + 36} ${pad + 18} Z`}
            fill="rgba(103,232,249,0.12)"
          />
        </g>
        {visible.map((s) => (
          <circle
            key={s.id}
            cx={sx(getOrbitPoint(s.id, orbitTime).x)}
            cy={sz(getOrbitPoint(s.id, orbitTime).z)}
            r={nearestId === s.id ? 5 : 3.2}
            fill={scanned.has(s.id) || nearestId === s.id ? s.color : "#64748b"}
            className="cursor-pointer"
            onClick={() => onPilotTo(s.id)}
          >
            <title>{s.name}</title>
          </circle>
        ))}
        <circle cx={sx(0)} cy={sz(0)} r={5} fill="#020202" stroke="#a78bfa" strokeWidth={1.2}>
          <title>Galactic core</title>
        </circle>
        <g transform={`translate(${shipX}, ${shipY}) rotate(${rot})`}>
          <polygon points="0,-6 4,5 -4,5" fill="#f8fafc" stroke="#67e8f9" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  )
}
