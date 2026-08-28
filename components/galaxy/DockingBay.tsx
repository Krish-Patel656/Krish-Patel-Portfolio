"use client"

import { AnimatePresence, motion } from "framer-motion"
import { PROFILE, SKILL_GROUPS, type Sector } from "@/lib/content"
import SkillConstellation from "./SkillConstellation"

export default function DockingBay({
  sector,
  onClose,
}: {
  sector: Sector | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {sector && (
        <motion.aside
          initial={{ x: 80, opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="pointer-events-auto fixed bottom-4 right-4 top-20 z-50 w-[min(96vw,460px)] overflow-hidden"
        >
          <div className="panel-glass flex h-full flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-cyan-400/15 px-5 py-4">
              <div>
                <p className="font-display text-[10px] tracking-[0.32em] text-cyan-300">
                  ATMOSPHERE BREACH · {sector.callsign}
                </p>
                <h2 className="mt-1 font-display text-2xl tracking-[0.08em] text-white">{sector.name}</h2>
                <p className="text-sm text-slate-300">{sector.subtitle}</p>
                {(sector.period || sector.location) && (
                  <p className="mt-1 text-xs tracking-wide text-slate-400">
                    {[sector.period, sector.location].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="font-display text-[11px] tracking-[0.2em] text-slate-400 hover:text-white"
              >
                ESC
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {sector.stats && (
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {sector.stats.map((s) => (
                    <div key={s.label} className="border border-white/10 bg-white/5 px-2 py-2 text-center">
                      <p className="font-display text-sm text-cyan-200">{s.value}</p>
                      <p className="text-[10px] tracking-wider text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {sector.bullets && (
                <ul className="space-y-3 text-sm leading-relaxed text-slate-200">
                  {sector.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: sector.color }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sector.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sector.tags.map((t) => (
                    <span
                      key={t}
                      className="border px-2 py-0.5 font-display text-[10px] tracking-wider"
                      style={{ borderColor: `${sector.color}55`, color: sector.color }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {sector.type === "skills" && (
                <div className="mt-4 space-y-4">
                  <SkillConstellation />
                  {SKILL_GROUPS.map((g) => (
                    <div key={g.id}>
                      <p className="font-display text-[10px] tracking-[0.28em] text-cyan-300/80">{g.label}</p>
                      <p className="mt-1 text-xs leading-6 text-slate-300">{g.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              )}

              {sector.type === "contact" && (
                <div className="mt-5 space-y-3">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="block border border-pink-400/30 bg-pink-500/10 px-4 py-3 font-display text-sm tracking-[0.18em] text-pink-100 hover:bg-pink-500/20"
                  >
                    TRANSMIT EMAIL
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-cyan-400/30 px-4 py-3 font-display text-sm tracking-[0.18em] text-cyan-100 hover:bg-cyan-500/10"
                  >
                    OPEN LINKEDIN
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-violet-400/30 px-4 py-3 font-display text-sm tracking-[0.18em] text-violet-100 hover:bg-violet-500/10"
                  >
                    OPEN GITHUB
                  </a>
                  <p className="text-xs text-slate-400">
                    {PROFILE.phone} · {PROFILE.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
