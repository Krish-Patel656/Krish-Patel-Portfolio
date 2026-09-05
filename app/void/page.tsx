"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { PROFILE, SECTORS, SKILL_GROUPS } from "@/lib/content"

const projects = SECTORS.filter((sector) => sector.type === "project")
const experiences = SECTORS.filter((sector) => sector.type === "experience")

export default function VoidArchive() {
  const router = useRouter()
  const pageRef = useRef<HTMLElement>(null)
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("traditional-open")
    document.body.classList.add("traditional-open")
    setCanGoBack(window.location.hash.startsWith("#from-"))
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"

    const resetScroll = () => {
      pageRef.current?.scrollTo({ top: 0 })
      window.scrollTo({ top: 0 })
    }
    resetScroll()
    const frame = requestAnimationFrame(() => requestAnimationFrame(resetScroll))
    const timer = window.setTimeout(resetScroll, 80)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.history.scrollRestoration = previousRestoration
      document.documentElement.classList.remove("traditional-open")
      document.body.classList.remove("traditional-open")
    }
  }, [])

  return (
    <main ref={pageRef} className="void-page min-h-screen overflow-hidden bg-black text-slate-200">
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-5 sm:px-10">
        <span className="font-display text-[10px] tracking-[0.36em] text-violet-200/70">
          THE VOID · ARCHIVE Ø
        </span>
        <div className="flex gap-2">
          {canGoBack && (
            <button
              onClick={() => router.back()}
              className="rounded-full border border-white/15 bg-black/60 px-4 py-2 font-display text-[9px] tracking-[0.18em] text-white backdrop-blur"
            >
              ← BACK
            </button>
          )}
          <Link
            href="/#from-void"
            className="rounded-full border border-white/15 bg-black/60 px-4 py-2 font-display text-[9px] tracking-[0.18em] text-white backdrop-blur"
          >
            CLASSIC
          </Link>
          <Link
            href="/galaxy#from-void"
            className="rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 font-display text-[9px] tracking-[0.18em] text-violet-100 backdrop-blur"
          >
            RELAUNCH
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-28 text-center">
        <div className="void-stars" />
        <motion.div
          initial={{ x: "-50%", y: "-50%", scale: 6, opacity: 0, rotate: -25 }}
          animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="void-hole"
        >
          <div className="void-hole-core" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="font-display text-[10px] tracking-[0.55em] text-violet-200">
            YOU FOUND THE EDGE
          </p>
          <h1 className="mt-5 font-display text-5xl tracking-[-0.04em] text-white sm:text-8xl">
            NOTHING ESCAPES.
            <br />
            <span className="text-violet-300">THE WORK REMAINS.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl leading-7 text-slate-400">
            A recruiter-friendly archive hiding beyond the event horizon. No piloting required—just
            the systems, projects, and results.
          </p>
          <a
            href="#archive"
            className="mt-8 inline-block rounded-full border border-violet-300/30 bg-violet-400/10 px-5 py-3 font-display text-[10px] tracking-[0.22em] text-violet-100"
          >
            DESCEND INTO ARCHIVE
          </a>
        </motion.div>
      </section>

      <section id="archive" className="relative z-10 mx-auto max-w-6xl px-5 py-28">
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            ["50%", "EST. MTTR REDUCTION"],
            ["10K+", "PATIENT RECORDS"],
            ["95%", "BIOSIGHT ACCURACY"],
          ].map(([value, label]) => (
            <div key={label} className="void-stat">
              <strong className="font-display text-4xl text-white">{value}</strong>
              <span className="mt-2 text-xs tracking-[0.2em] text-violet-200/60">{label}</span>
            </div>
          ))}
        </div>

        <p className="mb-8 font-display text-xs tracking-[0.35em] text-violet-300">01 · EXPERIENCE</p>
        <div className="grid gap-5 lg:grid-cols-3">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="void-card"
            >
              <span className="font-display text-[9px] tracking-[0.24em]" style={{ color: experience.color }}>
                {experience.callsign}
              </span>
              <h2 className="mt-5 font-display text-2xl text-white">{experience.name}</h2>
              <p className="mt-2 text-sm text-violet-200">{experience.subtitle}</p>
              <p className="mt-1 text-xs text-slate-600">{experience.period}</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
                {experience.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </motion.article>
          ))}
        </div>

        <p className="mb-8 mt-28 font-display text-xs tracking-[0.35em] text-violet-300">02 · PROJECTS</p>
        <div className="space-y-5">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="void-project"
            >
              <div>
                <span className="font-display text-[9px] tracking-[0.24em]" style={{ color: project.color }}>
                  {project.callsign}
                </span>
                <h2 className="mt-3 font-display text-3xl text-white">{project.name}</h2>
                <p className="mt-2 text-slate-400">{project.subtitle}</p>
              </div>
              <div>
                <ul className="space-y-2 text-sm leading-6 text-slate-400">
                  {project.bullets?.map((bullet) => <li key={bullet}>— {bullet}</li>)}
                </ul>
                <p className="mt-5 text-xs leading-6 text-violet-300/70">{project.tags?.join(" · ")}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-28 grid gap-12 border-t border-violet-300/15 pt-16 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="font-display text-xs tracking-[0.35em] text-violet-300">03 · SYSTEMS</p>
            <h2 className="mt-4 font-display text-4xl text-white">TOOLS IN ORBIT</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="font-display text-xs tracking-[0.18em] text-violet-200">{group.label}</p>
                <p className="mt-2 leading-7 text-slate-500">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-20 text-center">
        <p className="font-display text-3xl text-white">SIGNAL STILL ACTIVE.</p>
        <a className="mt-4 inline-block text-violet-300" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
      </footer>
    </main>
  )
}
