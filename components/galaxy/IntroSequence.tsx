"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PROFILE } from "@/lib/content"

const LINES = [
  "POWER BUS ONLINE",
  "HUD PROJECTORS ALIGNED",
  "NAV COMPUTER HANDSHAKE OK",
  `PILOT IDENT: ${PROFILE.name.toUpperCase()}`,
  "SECTOR MAP LOADED · 11 BODIES",
  "WASD THRUST · SHIFT BOOST · E DOCK",
]

export default function IntroSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [gone, setGone] = useState(false)
  const [bar, setBar] = useState(0)

  useEffect(() => {
    const skip = () => finish()
    window.addEventListener("keydown", skip)
    window.addEventListener("pointerdown", skip)
    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("pointerdown", skip)
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setBar((b) => Math.min(100, b + 4))
    }, 80)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (step < LINES.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 620)
      return () => clearTimeout(t)
    }
    const t = setTimeout(finish, 700)
    return () => clearTimeout(t)
  }, [step])

  function finish() {
    setGone(true)
    setTimeout(onDone, 450)
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(16px)" }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030014]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.4),transparent_55%)]" />
          <div className="relative w-[min(92vw,520px)] px-6 text-center">
            <p className="font-display text-[10px] tracking-[0.5em] text-cyan-400 glow-cyan flicker">
              SYSTEM BOOT
            </p>
            <h1 className="warp-in mt-4 font-display text-4xl tracking-[0.18em] text-white sm:text-6xl">
              {PROFILE.name.toUpperCase()}
            </h1>
            <p className="mt-2 font-display text-xs tracking-[0.35em] text-fuchsia-200/80">
              CS @ UTD · GPA {PROFILE.gpa} · {PROFILE.graduation}
            </p>
            <div className="mt-8 h-1 w-full bg-white/10">
              <div className="h-full bg-cyan-300 transition-[width] duration-100" style={{ width: `${bar}%` }} />
            </div>
            <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
              {LINES.slice(0, step).map((line) => (
                <p key={line} className="font-display text-[11px] tracking-[0.22em] text-cyan-100/90">
                  {"> "}
                  {line}
                </p>
              ))}
              {step < LINES.length && <span className="cursor-blink text-cyan-300">_</span>}
            </div>
            <p className="mt-12 text-[10px] tracking-[0.3em] text-slate-500">TAP / KEY TO SKIP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
