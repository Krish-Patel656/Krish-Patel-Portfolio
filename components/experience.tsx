export default function Experience() {
  const experiences = [
    {
      role: "Senior Frontend Developer",
      company: "Tech Company Inc.",
      period: "2022 - Present",
      description: "Leading frontend development with React and Next.js",
    },
    {
      role: "Full Stack Developer",
      company: "Startup XYZ",
      period: "2020 - 2022",
      description: "Built scalable web applications from scratch",
    },
    {
      role: "Junior Developer",
      company: "Digital Agency",
      period: "2019 - 2020",
      description: "Learned best practices and shipped multiple projects",
    },
  ]

  return (
    <section id="experience" className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 slide-in-up">
          Experience
        </h2>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border-l-4 border-blue-600 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                <span className="text-sm text-blue-600 font-semibold">{exp.period}</span>
              </div>
              <p className="text-blue-600 font-semibold mb-3">{exp.company}</p>
              <p className="text-gray-600">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
