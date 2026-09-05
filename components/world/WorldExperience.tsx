"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { getCreatureSector, WORLD_CREATURES, type WorldCreature } from "@/lib/worldData"

const PixelWorldGame = dynamic(() => import("./PixelWorldGame"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-[#0b1712] font-display text-xs tracking-[0.3em] text-emerald-200">
      GROWING BYTEWORLD…
    </div>
  ),
})

function CreaturePortrait({ creature, small = false }: { creature: WorldCreature; small?: boolean }) {
  return (
    <div
      className={`byte-creature ${small ? "byte-creature-small" : ""}`}
      style={{
        "--creature-color": `#${creature.color.toString(16).padStart(6, "0")}`,
        "--creature-accent": `#${creature.accent.toString(16).padStart(6, "0")}`,
      } as React.CSSProperties}
    >
      <span className="byte-ear byte-ear-left" />
      <span className="byte-ear byte-ear-right" />
      <span className="byte-eye byte-eye-left" />
      <span className="byte-eye byte-eye-right" />
      <span className="byte-mouth" />
    </div>
  )
}

function sendMove(direction: "up" | "down" | "left" | "right", active: boolean) {
  window.dispatchEvent(new CustomEvent("byteworld:move", { detail: { direction, active } }))
}

export default function WorldExperience() {
  const router = useRouter()
  const [caughtIds, setCaughtIds] = useState<string[]>([])
  const [encounter, setEncounter] = useState<WorldCreature | null>(null)
  const [nearby, setNearby] = useState<WorldCreature | null>(null)
  const [location, setLocation] = useState("Central Crossing")
  const [dexOpen, setDexOpen] = useState(false)
  const [selected, setSelected] = useState<WorldCreature>(WORLD_CREATURES[0])
  const [capturePhase, setCapturePhase] = useState<"ready" | "throwing" | "caught">("ready")
  const [arrival, setArrival] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    document.documentElement.classList.remove("traditional-open")
    document.body.classList.remove("traditional-open")
    const saved = window.localStorage.getItem("byteworld-caught")
    if (saved) {
      try {
        setCaughtIds(JSON.parse(saved))
      } catch {
        window.localStorage.removeItem("byteworld-caught")
      }
    }
  }, [])

  const caughtSet = useMemo(() => new Set(caughtIds), [caughtIds])
  const sector = encounter ? getCreatureSector(encounter) : null

  const closeEncounter = (caught = false) => {
    if (!encounter) return
    window.dispatchEvent(
      new CustomEvent("byteworld:finish", { detail: { id: encounter.id, caught } })
    )
    setEncounter(null)
    setCapturePhase("ready")
  }

  const catchCreature = () => {
    if (!encounter || caughtSet.has(encounter.id) || capturePhase !== "ready") return
    setCapturePhase("throwing")
    window.setTimeout(() => {
      const next = [...new Set([...caughtIds, encounter.id])]
      setCaughtIds(next)
      window.localStorage.setItem("byteworld-caught", JSON.stringify(next))
      setCapturePhase("caught")
      window.setTimeout(() => closeEncounter(true), 900)
    }, 1050)
  }

  return (
    <main className="byteworld-page relative h-dvh w-full overflow-hidden bg-[#07110d]">
      <PixelWorldGame
        caughtIds={caughtIds}
        onEncounter={(creature) => {
          setEncounter(creature)
          setCapturePhase(caughtSet.has(creature.id) ? "caught" : "ready")
        }}
        onNearby={setNearby}
        onLocation={setLocation}
        onGalaxyExit={() => {
          if (exiting) return
          setExiting(true)
          window.setTimeout(() => router.push("/galaxy#from-world-hole"), 850)
        }}
      />

      <div className="byteworld-vignette" />
      {exiting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
          animate={{ opacity: 1, scale: 2.4, rotate: 180 }}
          transition={{ duration: 0.85, ease: "easeIn" }}
          className="byteworld-rift-exit"
        >
          <span>RETURNING TO ORBIT</span>
        </motion.div>
      )}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="byte-panel pointer-events-auto px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.24em] text-emerald-300/70">Current area</p>
          <p className="mt-1 font-display text-xs text-white">{location}</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
          <Link href="/galaxy#from-world" className="byte-button">← GALAXY</Link>
          <Link href="/#from-world" className="byte-button">CLASSIC</Link>
          <button onClick={() => setDexOpen(true)} className="byte-button byte-button-primary">
            TECHDEX {caughtIds.length}/{WORLD_CREATURES.length}
          </button>
        </div>
      </header>

      <div className="byte-panel pointer-events-none fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 px-5 py-3 text-center sm:block">
        {nearby ? (
          <>
            <p className="font-display text-xs text-yellow-200">A wild {nearby.name} is nearby!</p>
            <p className="mt-1 text-[10px] tracking-[0.16em] text-white/60">PRESS E OR SPACE TO MEET IT</p>
          </>
        ) : (
          <p className="text-[10px] tracking-[0.14em] text-white/55">
            MOVE WITH WASD / ARROWS · FIND CREATURES · COMPLETE THE TECHDEX
          </p>
        )}
      </div>

      <div className="byte-dpad fixed bottom-4 left-4 z-30 grid grid-cols-3 gap-1 sm:hidden">
        <span />
        <button
          onPointerDown={() => sendMove("up", true)}
          onPointerUp={() => sendMove("up", false)}
          onPointerCancel={() => sendMove("up", false)}
        >▲</button>
        <span />
        <button
          onPointerDown={() => sendMove("left", true)}
          onPointerUp={() => sendMove("left", false)}
          onPointerCancel={() => sendMove("left", false)}
        >◀</button>
        <button
          onClick={() => window.dispatchEvent(new Event("byteworld:interact"))}
          className="!bg-yellow-300 !text-slate-950"
          disabled={!nearby}
        >E</button>
        <button
          onPointerDown={() => sendMove("right", true)}
          onPointerUp={() => sendMove("right", false)}
          onPointerCancel={() => sendMove("right", false)}
        >▶</button>
        <span />
        <button
          onPointerDown={() => sendMove("down", true)}
          onPointerUp={() => sendMove("down", false)}
          onPointerCancel={() => sendMove("down", false)}
        >▼</button>
      </div>

      <AnimatePresence>
        {arrival && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-[#07110d]/92 p-5 backdrop-blur"
          >
            <motion.div
              initial={{ y: 25, scale: 0.94 }}
              animate={{ y: 0, scale: 1 }}
              className="byte-dialogue max-w-xl"
            >
              <p className="font-display text-[10px] tracking-[0.28em] text-emerald-700">
                BLACK HOLE EXIT · UNKNOWN REGION
              </p>
              <h1 className="mt-3 font-display text-3xl text-slate-950">Welcome to ByteWorld.</h1>
              <p className="mt-4 leading-7 text-slate-700">
                Krish&apos;s work has taken creature form. Walk through the region, approach a
                ByteBeast, and press <strong>E</strong> or <strong>Space</strong>. Catching one
                unlocks the real project or experience behind it.
              </p>
              <button onClick={() => setArrival(false)} className="byte-dialogue-action">
                BEGIN FIELD STUDY
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {encounter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 grid place-items-center bg-[#07110d]/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 40, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.94 }}
              className="byte-encounter"
            >
              <button onClick={() => closeEncounter(false)} className="absolute right-4 top-3 text-xl text-slate-500">×</button>
              <div className="byte-encounter-field">
                <div className={capturePhase === "throwing" ? "capture-target" : ""}>
                  <CreaturePortrait creature={encounter} />
                </div>
                {capturePhase === "throwing" && <div className="capture-orb" />}
                {capturePhase === "caught" && <div className="caught-stamp">REGISTERED!</div>}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-[9px] tracking-[0.24em] text-emerald-700">{encounter.category}</p>
                    <h2 className="mt-1 font-display text-3xl text-slate-950">{encounter.name}</h2>
                    <p className="text-sm text-slate-500">{encounter.species} · {encounter.ability}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                    {sector?.name}
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-800">{sector?.subtitle}</p>
                <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto text-sm leading-6 text-slate-600">
                  {sector?.bullets?.map((bullet) => <li key={bullet}>• {bullet}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {sector?.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={catchCreature}
                  disabled={caughtSet.has(encounter.id) || capturePhase !== "ready"}
                  className="byte-catch-button"
                >
                  {caughtSet.has(encounter.id) || capturePhase === "caught"
                    ? "✓ IN TECHDEX"
                    : capturePhase === "throwing"
                      ? "THROWING CODEBALL…"
                      : "THROW CODEBALL"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dexOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed bottom-0 right-0 top-0 z-40 w-full max-w-2xl overflow-y-auto bg-[#f5f0dc] text-slate-900 shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-4 border-slate-900 bg-[#e85345] p-5 text-white">
              <div>
                <p className="font-display text-[10px] tracking-[0.24em]">FIELD DATABASE</p>
                <h2 className="mt-1 font-display text-2xl">TECHDEX</h2>
              </div>
              <button onClick={() => setDexOpen(false)} className="text-3xl">×</button>
            </div>
            <div className="grid min-h-[calc(100vh-88px)] sm:grid-cols-[220px_1fr]">
              <div className="border-r border-slate-300 p-3">
                {WORLD_CREATURES.map((creature, index) => {
                  const caught = caughtSet.has(creature.id)
                  return (
                    <button
                      key={creature.id}
                      onClick={() => setSelected(creature)}
                      className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-2 text-left ${
                        selected.id === creature.id ? "border-slate-900 bg-white" : "border-slate-300"
                      }`}
                    >
                      <span className="w-7 font-mono text-xs text-slate-400">#{String(index + 1).padStart(2, "0")}</span>
                      {caught ? <CreaturePortrait creature={creature} small /> : <span className="grid h-10 w-10 place-items-center text-2xl text-slate-300">?</span>}
                      <span className="text-sm font-semibold">{caught ? creature.name : "Unknown"}</span>
                    </button>
                  )
                })}
              </div>
              <div className="p-6">
                {caughtSet.has(selected.id) ? (
                  <>
                    <div className="grid place-items-center rounded-2xl bg-emerald-100 py-10">
                      <CreaturePortrait creature={selected} />
                    </div>
                    <p className="mt-6 font-display text-[10px] tracking-[0.24em] text-emerald-700">{selected.category}</p>
                    <h3 className="mt-1 font-display text-3xl">{selected.name}</h3>
                    <p className="text-slate-500">{selected.species} · Ability: {selected.ability}</p>
                    <h4 className="mt-6 font-bold">{getCreatureSector(selected)?.name}</h4>
                    <p className="mt-1 text-sm text-slate-600">{getCreatureSector(selected)?.subtitle}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                      {getCreatureSector(selected)?.bullets?.map((bullet) => <li key={bullet}>— {bullet}</li>)}
                    </ul>
                  </>
                ) : (
                  <div className="grid min-h-[420px] place-items-center text-center text-slate-400">
                    <div>
                      <p className="text-7xl">?</p>
                      <p className="mt-4 font-display text-sm">DATA MISSING</p>
                      <p className="mt-2 text-sm">Find and register this creature in the field.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  )
}
