"use client"

import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense } from "react"
import Scene from "./Scene"

export default function GalaxyCanvas({
  paused,
  nearestId,
  onNearest,
  autopilotId,
  onAutopilotArrive,
  extraKeys,
  onPilotTo,
  boostLocked,
  warping,
  revealedIds,
  onReveal,
  blackHoleActive,
  onBlackHole,
}: {
  paused: boolean
  nearestId: string | null
  onNearest: (id: string | null) => void
  autopilotId: string | null
  onAutopilotArrive: () => void
  extraKeys: Record<string, boolean>
  onPilotTo: (id: string) => void
  boostLocked: boolean
  warping: boolean
  revealedIds: Set<string>
  onReveal: (id: string) => void
  blackHoleActive: boolean
  onBlackHole: () => void
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 18, 20], fov: 50, near: 0.1, far: 220 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#050018")
        }}
      >
        <Suspense fallback={null}>
          <Scene
            paused={paused}
            nearestId={nearestId}
            onNearest={onNearest}
            autopilotId={autopilotId}
            onAutopilotArrive={onAutopilotArrive}
            extraKeys={extraKeys}
            onPilotTo={onPilotTo}
            boostLocked={boostLocked}
            warping={warping}
            revealedIds={revealedIds}
            onReveal={onReveal}
            blackHoleActive={blackHoleActive}
            onBlackHole={onBlackHole}
          />
          <EffectComposer enableNormalPass={false}>
            <Bloom intensity={1.15} luminanceThreshold={0.16} luminanceSmoothing={0.85} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
