"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { SECTORS } from "@/lib/content"
import HUD from "@/components/galaxy/HUD"
import DockingBay from "@/components/galaxy/DockingBay"
import IntroSequence from "@/components/galaxy/IntroSequence"
import Archive from "@/components/galaxy/Archive"
import MobileControls from "@/components/galaxy/MobileControls"
import Toasts, { type ToastItem } from "@/components/galaxy/Toasts"
import { initAudio, playBeep, playWhoosh, setMuted as setSfxMuted } from "@/lib/sfx"

const GalaxyCanvas = dynamic(() => import("@/components/galaxy/GalaxyCanvas"), {
  ssr: false,
})

export default function Home() {
  const router = useRouter()
  const [intro, setIntro] = useState(true)
  const [nearestId, setNearestId] = useState<string | null>(null)
  const [dockedId, setDockedId] = useState<string | null>(null)
  const [autopilotId, setAutopilotId] = useState<string | null>(null)
  const [scanned, setScanned] = useState<Set<string>>(new Set())
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [extraKeys, setExtraKeys] = useState<Record<string, boolean>>({})
  const [boostLocked, setBoostLocked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [warping, setWarping] = useState(false)
  const [blackHoleActive, setBlackHoleActive] = useState(false)
  const [timeTone, setTimeTone] = useState<"day" | "sunset" | "night">("night")
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const nearest = useMemo(
    () => SECTORS.find((s) => s.id === nearestId) ?? null,
    [nearestId]
  )
  const docked = useMemo(
    () => SECTORS.find((s) => s.id === dockedId) ?? null,
    [dockedId]
  )

  const pushToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((t) => [...t.slice(-3), { id, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  const markScanned = useCallback(
    (id: string) => {
      setScanned((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev).add(id)
        const sector = SECTORS.find((s) => s.id === id)
        if (sector) {
          pushToast(
            id === "funfacts"
              ? "Black Box decoded · off-catalog telemetry"
              : `First contact with ${sector.name} established`
          )
        }
        const exp = SECTORS.filter((s) => s.type === "experience")
        const prj = SECTORS.filter((s) => s.type === "project")
        if (exp.every((s) => next.has(s.id)) && exp.some((s) => s.id === id)) {
          pushToast("Experience sector fully mapped")
        }
        if (prj.every((s) => next.has(s.id)) && prj.some((s) => s.id === id)) {
          pushToast("Project cluster fully mapped")
        }
        if (next.size === SECTORS.length) {
          pushToast("All sectors scanned · constellation complete")
        }
        if (next.size >= 5) {
          window.setTimeout(() => {
            setRevealedIds((rev) => {
              if (rev.has("funfacts")) return rev
              pushToast("Unlisted body triangulated · far rim")
              return new Set(rev).add("funfacts")
            })
          }, 0)
        }
        return next
      })
    },
    [pushToast]
  )

  const beginDock = useCallback(
    (id: string | null) => {
      if (!id || warping || dockedId) return
      setWarping(true)
      playBeep()
      window.setTimeout(() => {
        setDockedId(id)
        markScanned(id)
        setWarping(false)
      }, 520)
    },
    [warping, dockedId, markScanned]
  )

  const dock = useCallback(() => beginDock(nearestId), [beginDock, nearestId])

  const undock = useCallback(() => {
    setDockedId(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (intro) return
      if (e.key === "Escape") {
        if (archiveOpen) setArchiveOpen(false)
        else undock()
      }
      if ((e.key === "e" || e.key === "E" || e.key === "Enter") && !dockedId && !archiveOpen) {
        dock()
      }
      if (e.key === "b" || e.key === "B") {
        setBoostLocked((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [intro, dock, undock, dockedId, archiveOpen])

  useEffect(() => {
    const hour = new Date().getHours()
    setTimeTone(hour >= 17 && hour < 21 ? "sunset" : hour >= 7 && hour < 17 ? "day" : "night")
  }, [])

  useEffect(() => {
    document.body.classList.toggle("archive-open", archiveOpen)
    return () => document.body.classList.remove("archive-open")
  }, [archiveOpen])

  useEffect(() => {
    const kick = () => {
      void initAudio()
    }
    window.addEventListener("pointerdown", kick)
    window.addEventListener("keydown", kick)
    return () => {
      window.removeEventListener("pointerdown", kick)
      window.removeEventListener("keydown", kick)
    }
  }, [])

  const pilotTo = (id: string) => {
    setDockedId(null)
    setArchiveOpen(false)
    setAutopilotId(id)
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#050018]">
      {intro && (
        <IntroSequence
          onDone={() => {
            setIntro(false)
            void initAudio()
          }}
        />
      )}

      <GalaxyCanvas
        paused={blackHoleActive ? false : !!dockedId || archiveOpen || intro || warping}
        nearestId={nearestId}
        onNearest={setNearestId}
        autopilotId={autopilotId}
        onAutopilotArrive={() => {
          const id = autopilotId
          setAutopilotId(null)
          if (id) {
            setNearestId(id)
            beginDock(id)
          }
        }}
        extraKeys={extraKeys}
        onPilotTo={pilotTo}
        boostLocked={boostLocked}
        warping={warping}
        revealedIds={revealedIds}
        onReveal={(id) => {
          setRevealedIds((prev) => {
            if (prev.has(id)) return prev
            const next = new Set(prev).add(id)
            if (id === "funfacts") pushToast("Anomalous signal · Black Box on radar")
            return next
          })
        }}
        blackHoleActive={blackHoleActive}
        onBlackHole={() => {
          if (blackHoleActive) return
          setBlackHoleActive(true)
          setAutopilotId(null)
          setDockedId(null)
          playWhoosh()
          pushToast("GRAVITATIONAL LOCK · escape velocity unavailable")
          window.setTimeout(() => router.push("/void#from-galaxy"), 2300)
        }}
      />

      <div className={`time-wash time-${timeTone}`} />
      <div className="scanlines" />
      <div className="vignette" />
      {warping && <div className="warp-flash" />}
      {blackHoleActive && (
        <div className="black-hole-suction">
          <p className="font-display text-xs tracking-[0.42em] text-violet-100">
            EVENT HORIZON BREACH
          </p>
        </div>
      )}

      {!intro && !blackHoleActive && (
        <>
          <HUD
            nearest={nearest}
            docked={!!dockedId || warping}
            scanned={scanned}
            onToggleArchive={() => setArchiveOpen((v) => !v)}
            archiveOpen={archiveOpen}
            onPilotTo={pilotTo}
            onDock={dock}
            boostLocked={boostLocked}
            onToggleBoost={() => setBoostLocked((v) => !v)}
            muted={muted}
            onToggleMute={() => {
              const next = !muted
              setMuted(next)
              setSfxMuted(next)
              void initAudio()
            }}
            revealedIds={revealedIds}
          />
          <DockingBay sector={docked} onClose={undock} />
          <MobileControls
            onPress={(k) => setExtraKeys((p) => ({ ...p, [k]: true }))}
            onRelease={(k) => setExtraKeys((p) => ({ ...p, [k]: false }))}
            onDock={dock}
            canDock={!!nearestId && !dockedId && !warping}
            boostLocked={boostLocked}
            onToggleBoost={() => setBoostLocked((v) => !v)}
          />
          <Toasts items={toasts} />
        </>
      )}

      <AnimatePresence>{archiveOpen && <Archive onClose={() => setArchiveOpen(false)} />}</AnimatePresence>
    </main>
  )
}
