import { useState, useRef, useCallback, useEffect } from 'react'
import { projects } from '../data/projects.js'
import { playHover, playNavigate } from './laser.jsx'

const TOTAL = projects.length

function getConfig(vw) {
  if (vw >= 1000) return { radius: 720, mobile: false }
  if (vw >= 640)  return { radius: vw * 0.6, mobile: false }
  return { radius: vw * 0.62, mobile: true }
}

function getRingTransform(offset, vw) {
  const { radius, mobile } = getConfig(vw)

  if (mobile) {
    if (offset === 0)            return { t: 'translateX(-50%) translateY(-50%) scale(1)', opacity: 1, z: 30, clickable: true }
    if (Math.abs(offset) === 1)  return { t: `translateX(-50%) translateY(-50%) translateX(${offset * vw * 0.6}px) scale(0.8)`, opacity: 0.6, z: 20, clickable: true }
    return { t: `translateX(-50%) translateY(-50%) translateX(${offset * vw}px) scale(0.6)`, opacity: 0, z: 10, clickable: false }
  }

  const anglePer = 360 / TOTAL
  const angle = offset * anglePer
  const rad = angle * Math.PI / 180
  const z = Math.cos(rad) * radius - radius
  const x = Math.sin(rad) * radius
  const ry = -angle * 0.18

  const abs = Math.abs(offset)
  let opacity
  if (abs === 0) opacity = 1
  else if (abs === 1) opacity = 0.9
  else if (abs === 2) opacity = 0.45
  else if (abs === 3) opacity = 0.18
  else opacity = 0.06

  const zIndex = Math.round(1000 + z)
  const clickable = abs <= 1

  return {
    t: `translateX(-50%) translateY(-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg)`,
    opacity,
    z: zIndex,
    clickable,
  }
}

// current + setCurrent come from the parent so the position survives navigation
export default function Carousel({ onFire, onNavigate, current, setCurrent }) {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const lastHovered = useRef(null)
  const touchStartX = useRef(null)
  const touchMoved = useRef(false)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const rotate = useCallback((dir) => {
    playNavigate()
    setCurrent(c => (c + dir + TOTAL) % TOTAL)
  }, [setCurrent])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') rotate(-1)
      if (e.key === 'ArrowRight') rotate(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [rotate])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchMoved.current = false
  }
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 10) touchMoved.current = true
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 45) rotate(dx < 0 ? 1 : -1)
  }

  const mobile = getConfig(vw).mobile

  return (
    <div className="carousel-wrap">
      <div
        className="carousel-stage carousel-3d"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-ring">
          {projects.map((proj, i) => {
            const rawOffset = ((i - current) % TOTAL + TOTAL) % TOTAL
            const offset = rawOffset > TOTAL / 2 ? rawOffset - TOTAL : rawOffset
            const { t, opacity, z, clickable } = getRingTransform(offset, vw)
            const isActive = offset === 0

            return (
              <div
                key={proj.id}
                className={`mem-card${isActive ? ' active' : ''}${clickable ? ' front' : ''}`}
                style={{
                  position: 'absolute',
                  top: '42%',
                  left: '50%',
                  transform: t,
                  opacity,
                  zIndex: z,
                  pointerEvents: clickable ? 'auto' : 'none',
                  transition: 'transform 0.6s cubic-bezier(.25,.85,.35,1), opacity 0.6s ease',
                }}
                onMouseEnter={() => {
                  if (clickable && lastHovered.current !== i) {
                    playHover()
                    lastHovered.current = i
                  }
                }}
                onMouseLeave={() => { lastHovered.current = null }}
                onClick={(e) => {
                  if (!clickable) return
                  // Touch: any tap on the carousel just rotates toward that card
                  if (mobile) {
                    if (touchMoved.current) return   // was a swipe, already handled
                    if (!isActive) { rotate(offset > 0 ? 1 : -1) }
                    else { onFire(e.currentTarget, i) }
                    return
                  }
                  // Desktop: all three front cards open directly
                  onFire(e.currentTarget, i)
                }}
              >
                <div className="thumb" />
                <p className="name">{proj.name}</p>
                <p className="meta">{proj.meta}</p>
                <p className="tech">{proj.tech}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="carousel-nav">
        <div className="carousel-arrow" onClick={() => rotate(-1)}>‹</div>
        <div className="carousel-dots">
          {projects.map((_, i) => (
            <span key={i} className={i === current ? 'active' : ''} />
          ))}
        </div>
        <div className="carousel-arrow" onClick={() => rotate(1)}>›</div>
      </div>
    </div>
  )
}
