let ctx: AudioContext | null = null
let humGain: GainNode | null = null
let muted = false
let started = false

function getCtx() {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

export function isMuted() {
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  if (humGain) humGain.gain.value = muted || !started ? 0 : 0.028
}

export async function initAudio() {
  const audio = getCtx()
  if (!audio || started) return
  if (audio.state === "suspended") await audio.resume()
  started = true

  const filter = audio.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 180
  humGain = audio.createGain()
  humGain.gain.value = muted ? 0 : 0.028
  filter.connect(humGain)
  humGain.connect(audio.destination)

  const o1 = audio.createOscillator()
  o1.type = "sine"
  o1.frequency.value = 52
  const o2 = audio.createOscillator()
  o2.type = "triangle"
  o2.frequency.value = 78
  o1.connect(filter)
  o2.connect(filter)
  o1.start()
  o2.start()
}

export function playWhoosh() {
  const audio = getCtx()
  if (!audio || muted) return
  const now = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  const filter = audio.createBiquadFilter()
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(140, now)
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.28)
  filter.type = "lowpass"
  filter.frequency.value = 900
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + 0.34)
}

export function playBeep() {
  const audio = getCtx()
  if (!audio || muted) return
  const now = audio.currentTime
  ;[880, 1320].forEach((freq, i) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = "sine"
    osc.frequency.value = freq
    const t = now + i * 0.07
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.07, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.14)
  })
}
