export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 slide-in-up">
          About Me
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-l-4 border-blue-600">
          <p className="text-gray-700 text-lg leading-relaxed mb-6 slide-in-up">
            I'm a passionate developer with 5+ years of experience building web applications. I specialize in creating beautiful, intuitive interfaces and robust backend systems.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed fade-in">
            My journey in tech started with a curiosity about how things work. Today, I'm dedicated to crafting solutions that make a real impact for users and businesses alike. I believe in clean code, great UX, and continuous learning.
          </p>
        </div>
      </div>
    </section>
  )
}
