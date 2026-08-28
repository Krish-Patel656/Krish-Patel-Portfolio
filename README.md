# Krish Patel · Nebula Explorer

An interactive space-exploration portfolio. You fly a ship through a 3D galaxy; each planet is a real piece of Krish's resume (EchoStar, Eyes Now, Nebula Labs, SafeWay, BioSight, MapScrib.ai).

Built with Next.js, React Three Fiber, Framer Motion, and React Flow.

## How to run

From this folder (`Krish-Portfolio`):

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

- **WASD** or **arrow keys** — fly
- **Shift** — boost
- **Click a planet** (or a name in the sector list / radar) — autopilot + dock
- **E** or **Enter** — dock when you are in range
- **Esc** — undock
- **Mission Logs** — readable archive of the same content (for recruiters who want to scroll)

Production:

```bash
npm run build
npm start
```

## Stack

- Next.js 16 + React 19 + Tailwind CSS 4
- `@react-three/fiber` + `@react-three/drei` + bloom (3D galaxy, ship, planets)
- Framer Motion (intro, docking panels)
- `@xyflow/react` (skill constellation at the Constellation planet)

The previous static site lives in `Old_Code/`.
