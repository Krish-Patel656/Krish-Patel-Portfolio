import type { Metadata, Viewport } from "next"
import { Orbitron, Exo_2 } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700"],
})

const exo = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Krish Patel · Nebula Explorer",
  description:
    "Interactive galaxy portfolio for Krish Patel — CS @ UTD, AI systems intern at EchoStar, Eyes Now, and Nebula Labs.",
}

export const viewport: Viewport = {
  themeColor: "#030014",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo.variable}`}>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-exo), sans-serif",
          ["--font-display" as string]: "var(--font-orbitron), sans-serif",
          ["--font-sans" as string]: "var(--font-exo), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  )
}
