import { useRef, useCallback } from 'react'

let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

export function playHover() {
  const c = getCtx()
  const o = c.createOscillator(), g = c.createGain()
  o.connect(g); g.connect(c.destination)
  o.type = 'sine'
  o.frequency.setValueAtTime(880, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(1100, c.currentTime + 0.08)
  g.gain.setValueAtTime(0.08, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1)
  o.start(); o.stop(c.currentTime + 0.1)
}

export function playNavigate() {
  const c = getCtx()
  ;[0, 0.05].forEach((t, i) => {
    const o = c.createOscillator(), g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.type = 'sine'; o.frequency.value = i === 0 ? 660 : 880
    g.gain.setValueAtTime(0.1, c.currentTime + t)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.12)
    o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.12)
  })
}

export function playLaser() {
  const c = getCtx()
  const o = c.createOscillator(), g = c.createGain()
  o.connect(g); g.connect(c.destination)
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(1800, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.25)
  g.gain.setValueAtTime(0.18, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28)
  o.start(); o.stop(c.currentTime + 0.28)
}

export function playConfirm() {
  const c = getCtx()
  ;[0, 0.08, 0.16].forEach((t, i) => {
    const o = c.createOscillator(), g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.type = 'sine'; o.frequency.value = [523, 659, 784][i]
    g.gain.setValueAtTime(0.12, c.currentTime + t)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.18)
    o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.18)
  })
}

export function useLaser(mousePos) {
  const lineRef = useRef(null)
  const impactRef = useRef(null)

  const fire = useCallback((targetX, targetY, onDone) => {
    const line = lineRef.current
    const impact = impactRef.current
    if (!line || !impact) return

    const dx = targetX - mousePos.current.x
    const dy = targetY - mousePos.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    line.style.left = mousePos.current.x + 'px'
    line.style.top = mousePos.current.y + 'px'
    line.style.width = dist + 'px'
    line.style.transform = `rotate(${angle}deg)`
    line.style.transition = 'none'
    line.style.opacity = '1'

    impact.style.left = targetX + 'px'
    impact.style.top = targetY + 'px'
    impact.style.transform = 'translate(-50%,-50%) scale(0)'
    impact.style.transition = 'none'
    impact.style.opacity = '1'

    requestAnimationFrame(() => {
      line.style.transition = 'opacity 0.2s ease 0.1s'
      line.style.opacity = '0'
      impact.style.transition = 'transform 0.15s ease, opacity 0.2s ease 0.15s'
      impact.style.transform = 'translate(-50%,-50%) scale(1.5)'
      impact.style.opacity = '0'
    })

    setTimeout(onDone, 320)
  }, [mousePos])

  const LaserElements = (
    <>
      <div ref={lineRef} className="laser-line" />
      <div ref={impactRef} className="laser-impact" />
    </>
  )

  return { fire, LaserElements }
}
