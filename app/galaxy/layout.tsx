import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nebula Explorer · Krish Patel",
  description: "Pilot an interactive 3D galaxy through Krish Patel's projects and experience.",
}

export default function GalaxyLayout({ children }: { children: React.ReactNode }) {
  return children
}
