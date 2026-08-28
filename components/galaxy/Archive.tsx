"use client"

import { motion } from "framer-motion"
import { PROFILE, SECTORS, SKILL_GROUPS } from "@/lib/content"

export default function Archive({ onClose }: { onClose: () => void }) {
  const experiences = SECTORS.filter((s) => s.type === "experience")
  const projects = SECTORS.filter((s) => s.type === "project")
  const education = SECTORS.find((s) => s.type === "education")
  const about = SECTORS.find((s) => s.id === "command")
  const funfacts = SECTORS.find((s) => s.id === "funfacts")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] overflow-y-auto bg-[#030014]/95 px-4 py-16 sm:px-10"
    >
      <div className="mx-auto max-w-3xl pb-20">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.4em] text-cyan-300">MISSION ARCHIVE</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.12em] text-white">{PROFILE.name}</h2>
            <p className="mt-2 max-w-xl text-slate-300">{PROFILE.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="border border-cyan-400/30 px-3 py-1 font-display text-[10px] tracking-[0.2em] text-cyan-200"
          >
            RETURN
          </button>
        </div>

        <section className="mb-10">
          <h3 className="font-display text-sm tracking-[0.3em] text-cyan-300">COMMAND BRIEF</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {about?.bullets?.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="font-display text-sm tracking-[0.3em] text-orange-300">EDUCATION</h3>
          <p className="mt-2 text-white">
            {education?.subtitle} · {PROFILE.school}
          </p>
          <p className="text-sm text-slate-400">
            GPA {PROFILE.gpa} · {education?.period}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {education?.bullets?.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="font-display text-sm tracking-[0.3em] text-amber-300">EXPERIENCE</h3>
          <div className="mt-4 space-y-6">
            {experiences.map((e) => (
              <article key={e.id}>
                <p className="font-display text-lg text-white">{e.name}</p>
                <p className="text-sm text-cyan-200">{e.subtitle}</p>
                <p className="text-xs text-slate-400">
                  {e.period} · {e.location}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {e.bullets?.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="font-display text-sm tracking-[0.3em] text-sky-300">PROJECTS</h3>
          <div className="mt-4 space-y-6">
            {projects.map((e) => (
              <article key={e.id}>
                <p className="font-display text-lg text-white">{e.name}</p>
                <p className="text-sm text-cyan-200">{e.subtitle}</p>
                <p className="text-xs text-slate-400">{e.period}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {e.bullets?.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-sm tracking-[0.3em] text-violet-300">SKILLS</h3>
          {SKILL_GROUPS.map((g) => (
            <p key={g.id} className="mt-3 text-sm text-slate-200">
              <span className="text-cyan-300">{g.label}: </span>
              {g.items.join(", ")}
            </p>
          ))}
        </section>

        {funfacts && (
          <section className="mt-10">
            <h3 className="font-display text-sm tracking-[0.3em] text-slate-300">BLACK BOX</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
              {funfacts.bullets?.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300">
          <p>
            {PROFILE.email} · {PROFILE.phone}
          </p>
          <p>
            <a className="text-cyan-300" href={PROFILE.github}>
              GitHub
            </a>
            {" · "}
            <a className="text-cyan-300" href={PROFILE.linkedin}>
              LinkedIn
            </a>
          </p>
        </section>
      </div>
    </motion.div>
  )
}
