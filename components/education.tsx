import { GraduationCap } from "lucide-react"

const educationData = [
  {
    degree: "Master of Science in Computer Science",
    school: "University Name",
    year: "2020",
    details: "Specialized in Full-Stack Web Development",
  },
  {
    degree: "Bachelor of Science in Information Technology",
    school: "University Name",
    year: "2018",
    details: "Focus on Web Technologies and Software Engineering",
  },
]

export default function Education() {
  return (
    <section id="education" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 slide-in-up">
          Education
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap size={28} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                  <p className="text-blue-600 font-semibold text-sm">{edu.school}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {edu.year}
                </span>
              </div>
              <p className="text-gray-600">{edu.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
