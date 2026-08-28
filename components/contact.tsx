export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-r from-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white slide-in-up">
          Get In Touch
        </h2>
        <p className="text-center text-blue-100 mb-12 fade-in max-w-2xl mx-auto">
          I'm always open to new opportunities and collaborations. Feel free to reach out!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Email</h3>
            <a
              href="mailto:your.email@example.com"
              className="text-blue-300 hover:text-blue-200 text-lg transition-colors duration-300"
            >
              your.email@example.com
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Follow Me</h3>
            <div className="flex gap-4">
              {[
                { name: "GitHub", url: "https://github.com" },
                { name: "LinkedIn", url: "https://linkedin.com" },
                { name: "Twitter", url: "https://twitter.com" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500/30 text-blue-200 rounded-lg hover:bg-blue-500/50 transition-all duration-300 hover:scale-110 font-semibold"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
