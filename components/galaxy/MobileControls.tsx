"use client"

import type { PointerEvent } from "react"

export default function MobileControls({
  onPress,
  onRelease,
  onDock,
  canDock,
  boostLocked,
  onToggleBoost,
}: {
  onPress: (key: string) => void
  onRelease: (key: string) => void
  onDock: () => void
  canDock: boolean
  boostLocked: boolean
  onToggleBoost: () => void
}) {
  const bind = (key: string) => ({
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault()
      onPress(key)
    },
    onPointerUp: () => onRelease(key),
    onPointerLeave: () => onRelease(key),
    onPointerCancel: () => onRelease(key),
  })

  return (
    <div className="pointer-events-auto fixed bottom-5 left-4 z-50 sm:hidden">
      <div className="grid w-[160px] grid-cols-3 gap-1">
        <span />
        <button className="dpad-btn" {...bind("w")} aria-label="forward">
          ▲
        </button>
        <span />
        <button className="dpad-btn" {...bind("a")} aria-label="left">
          ◀
        </button>
        <button className="dpad-btn" {...bind("s")} aria-label="back">
          ▼
        </button>
        <button className="dpad-btn" {...bind("d")} aria-label="right">
          ▶
        </button>
      </div>
      <button
        onClick={onToggleBoost}
        className={`mt-2 w-full py-2 font-display text-[10px] tracking-[0.25em] ${
          boostLocked
            ? "border border-fuchsia-400/70 bg-fuchsia-500/25 text-fuchsia-100"
            : "border border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
        }`}
      >
        {boostLocked ? "BOOST ON" : "BOOST"}
      </button>
      {canDock && (
        <button
          onClick={onDock}
          className="mt-2 w-full border border-cyan-400/40 bg-cyan-400/10 py-2 font-display text-[10px] tracking-[0.25em] text-cyan-100"
        >
          DOCK
        </button>
      )}
    </div>
  )
}
