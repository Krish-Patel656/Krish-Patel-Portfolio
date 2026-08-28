export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 fade-in">
          Hi, I'm Krish Patel
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-4 slide-in-up">
          Full-stack developer passionate about building beautiful, responsive web experiences
        </p>
        <p className="text-base md:text-lg text-gray-600 mb-12 fade-in max-w-2xl mx-auto leading-relaxed">
          I create modern web applications with cutting-edge technologies. Currently focused on React, Next.js, and cloud solutions. Let's build something amazing together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-in-up">
          <a
            href="#projects"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            View Projects →
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            Contact Me ↗
          </a>
        </div>
      </div>
    </section>
  )
}
