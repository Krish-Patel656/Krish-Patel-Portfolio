"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { PROFILE, SECTORS, SKILL_GROUPS } from "@/lib/content"

const experiences = SECTORS.filter((sector) => sector.type === "experience")
const projects = SECTORS.filter((sector) => sector.type === "project")
const education = SECTORS.find((sector) => sector.type === "education")

function SectionHeading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-display text-xs tracking-[0.3em] text-cyan-300">{index}</span>
      <h2 className="font-display text-2xl tracking-[0.08em] text-white sm:text-3xl">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/35 to-transparent" />
    </div>
  )
}

export default function TraditionalPortfolio() {
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
    <main
      ref={pageRef}
      onScroll={(event) => {
        const page = event.currentTarget
        const top = page.scrollTop
        const range = Math.max(1, page.scrollHeight - page.clientHeight)
        page.style.setProperty("--parallax-slow", `${top * -0.07}px`)
        page.style.setProperty("--parallax-fast", `${top * -0.14}px`)
        page.style.setProperty("--scroll-progress", `${(top / range) * 100}%`)
      }}
      className="traditional-page min-h-screen bg-[#06060a] text-slate-200"
    >
      <div className="traditional-scroll-progress" />
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#06060a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/traditional" className="font-display text-sm tracking-[0.18em] text-white">
            KRISH<span className="text-cyan-300">.</span>PATEL
          </Link>
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button
                onClick={() => router.back()}
                className="rounded-full border border-white/15 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-slate-300 hover:border-white/40 hover:text-white"
              >
                ← BACK
              </button>
            )}
            <a href="#work" className="hidden px-3 py-2 text-xs text-slate-400 hover:text-white sm:block">
              Work
            </a>
            <a href="#projects" className="hidden px-3 py-2 text-xs text-slate-400 hover:text-white sm:block">
              Projects
            </a>
            <Link
              href="/"
              className="rounded-full border border-cyan-300/35 bg-cyan-300/5 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-cyan-200 transition hover:bg-cyan-300/15"
            >
              ENTER GALAXY
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[82vh] max-w-6xl items-center gap-12 overflow-hidden px-5 py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="traditional-orb traditional-orb-one traditional-parallax-slow" />
        <div className="traditional-orb traditional-orb-two traditional-parallax-fast" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="traditional-parallax-slow relative z-10"
        >
          <p className="mb-5 font-display text-xs tracking-[0.3em] text-cyan-300">
            AI ENGINEER · SOFTWARE BUILDER · UTD CS
          </p>
          <h1 className="font-display text-5xl leading-[0.96] tracking-[-0.04em] text-white sm:text-7xl">
            I BUILD SYSTEMS
            <br />
            THAT REMOVE
            <br />
            <span className="text-outline">THE GRIND.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">{PROFILE.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="rounded-full bg-cyan-300 px-5 py-3 font-display text-[11px] tracking-[0.16em] text-slate-950 transition hover:bg-white"
            >
              START A CONVERSATION
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-3 font-display text-[11px] tracking-[0.16em] text-white hover:border-white/40"
            >
              GITHUB ↗
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="traditional-parallax-fast relative mx-auto aspect-square w-full max-w-[420px]"
        >
          <div className="absolute inset-[6%] z-0 rounded-full border border-cyan-300/20" />
          <div className="absolute inset-[17%] z-0 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-violet-300/30" />
          <div className="absolute inset-[29%] z-10 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-600 shadow-[0_0_100px_rgba(34,211,238,0.3)]" />
          <div className="absolute inset-[34%] z-20 flex flex-col items-center justify-center rounded-full bg-[#06060a] px-2 text-center shadow-[0_0_28px_rgba(0,0,0,0.8)]">
            <strong className="whitespace-nowrap font-display text-lg text-white sm:text-xl">AI × SWE</strong>
            <span className="mt-2 whitespace-nowrap rounded-full bg-black px-2 py-1 text-[8px] uppercase tracking-[0.16em] text-cyan-100">
              BUILD / AUTOMATE
            </span>
          </div>
          {[`${PROFILE.gpa} GPA`, "K8s", "CV", "APIs"].map((label, index) => (
            <span
              key={label}
              className="absolute z-30 rounded-full border border-white/15 bg-black/85 px-3 py-1 font-display text-[10px] tracking-wider text-white shadow-lg"
              style={{
                left: `${12 + (index % 2) * 68}%`,
                top: `${18 + index * 20}%`,
              }}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </section>

      <div className="traditional-marquee" aria-hidden="true">
        <div>
          PYTHON · TYPESCRIPT · PYTORCH · KUBERNETES · NEXT.JS · FASTAPI · COMPUTER VISION · AWS ·
          PYTHON · TYPESCRIPT · PYTORCH · KUBERNETES · NEXT.JS · FASTAPI · COMPUTER VISION · AWS ·
        </div>
      </div>

      <section id="work" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading index="01">EXPERIENCE</SectionHeading>
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="group grid gap-5 border-t border-white/10 py-8 transition hover:border-cyan-300/40 md:grid-cols-[0.8fr_1.3fr]"
            >
              <div>
                <p className="font-display text-xl text-white group-hover:text-cyan-200">{experience.name}</p>
                <p className="mt-1 text-sm text-slate-500">{experience.period}</p>
                <p className="text-sm text-slate-500">{experience.location}</p>
              </div>
              <div>
                <h3 className="text-lg text-slate-100">{experience.subtitle}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
                  {experience.bullets?.map((bullet) => <li key={bullet}>— {bullet}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="projects" className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <SectionHeading index="02">SELECTED PROJECTS</SectionHeading>
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="traditional-card relative overflow-hidden rounded-3xl border border-white/10 p-6"
              >
                <span className="font-display text-[10px] tracking-[0.24em]" style={{ color: project.color }}>
                  {project.callsign}
                </span>
                <h3 className="mt-5 font-display text-2xl text-white">{project.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{project.subtitle}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
                  {project.bullets?.map((bullet) => <li key={bullet}>• {bullet}</li>)}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <span key={tag} className="text-xs text-slate-500">
                      #{tag.replace(/\s/g, "")}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-16 px-5 py-24 lg:grid-cols-2">
        <div>
          <SectionHeading index="03">SKILLS</SectionHeading>
          <div className="space-y-6">
            {SKILL_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="font-display text-xs tracking-[0.2em] text-cyan-300">{group.label}</p>
                <p className="mt-2 leading-7 text-slate-400">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading index="04">EDUCATION</SectionHeading>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-orange-400/10 to-transparent p-7">
            <p className="font-display text-2xl text-white">{PROFILE.school}</p>
            <p className="mt-2 text-orange-200">{education?.subtitle}</p>
            <p className="mt-1 text-sm text-slate-500">{education?.period} · GPA {PROFILE.gpa}</p>
            <ul className="mt-6 space-y-2 text-sm leading-6 text-slate-300">
              {education?.bullets?.slice(1).map((bullet) => <li key={bullet}>— {bullet}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-16 text-center">
        <p className="font-display text-3xl text-white">LET&apos;S BUILD SOMETHING USEFUL.</p>
        <a className="mt-4 inline-block text-cyan-300 hover:text-white" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
        <div className="mt-8 flex justify-center gap-5 text-sm text-slate-500">
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <Link href="/">Galaxy mode</Link>
        </div>
      </footer>
    </main>
  )
}
