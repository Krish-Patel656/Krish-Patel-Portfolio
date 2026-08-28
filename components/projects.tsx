export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack Next.js application with real-time inventory management and payment integration.",
      tags: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    },
    {
      title: "Task Management App",
      description: "Collaborative task manager with real-time updates and team workspace support.",
      tags: ["React", "Firebase", "TailwindCSS"],
    },
    {
      title: "AI Content Generator",
      description: "SaaS platform for generating AI-powered content with custom templates.",
      tags: ["Next.js", "OpenAI API", "Vercel"],
    },
  ]

  return (
    <section id="projects" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 slide-in-up">
          Projects
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
