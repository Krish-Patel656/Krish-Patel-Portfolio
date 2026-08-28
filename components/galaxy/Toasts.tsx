"use client"

import { AnimatePresence, motion } from "framer-motion"

export type ToastItem = { id: string; message: string }

export default function Toasts({ items }: { items: ToastItem[] }) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[95] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="panel-glass px-4 py-2 text-center font-display text-[11px] tracking-[0.18em] text-cyan-100"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
