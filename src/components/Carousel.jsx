import { useState, useRef, useCallback, useEffect } from 'react'
import { projects } from '../data/projects.js'
import { playHover, playNavigate } from './laser.jsx'

const TOTAL = projects.length
const PERSPECTIVE = 1100

/* Layout constants scale with viewport width so cards never fly off
   small screens. Desktop (>=1000px) keeps the exact original look. */
function getLayoutConstants(vw) {
  if (vw >= 1000) return { radius: 380, side2: 480, mobile: false }
  if (vw >= 640)  return { radius: vw * 0.36, side2: vw * 0.46, mobile: false }
  return { radius: vw * 0.62, side2: vw, mobile: true }
}

function getTransform(offset, vw) {
  const { radius, side2, mobile } = getLayoutConstants(vw)

  const angle = (offset / TOTAL) * 360
  const rad = angle * Math.PI / 180
  const z = Math.cos(rad) * radius
  const rawX = Math.sin(rad) * radius
  const perspScale = PERSPECTIVE / (PERSPECTIVE - z)
  let finalX = rawX * perspScale

  const normalizedZ = (z + radius) / (2 * radius)
  let scale = 0.5 + 0.5 * normalizedZ
  let opacity
  let clickable = Math.abs(offset) <= 1

  if (mobile) {
    /* Phone: one big centred card, neighbours peeking at the edges */
    if (offset === 0)            { finalX = 0;              scale = 1;    opacity = 1 }
    else if (Math.abs(offset) === 1) { finalX = offset * vw * 0.62; scale = 0.8; opacity = 0.6 }
    else                         { finalX = offset * vw;    scale = 0.6;  opacity = 0; clickable = false }
  } else {
    if (Math.abs(offset) === 2) finalX = offset < 0 ? -side2 : side2
    if (Math.abs(offset) <= 1)      opacity = 1.0
    else if (Math.abs(offset) === 2) opacity = 0.45
    else if (Math.abs(offset) === 3) opacity = 0.18
    else                             opacity = 0.0
  }

  const zIndex = Math.round(normalizedZ * 100) + 10
  return { finalX, scale, opacity, zIndex, clickable }
}

export default function Carousel({ onFire, onNavigate }) {
  const [current, setCurrent] = useState(0)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const lastHovered = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const rotate = useCallback((dir) => {
    playNavigate()
    setCurrent(c => (c + dir + TOTAL) % TOTAL)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') rotate(-1)
      if (e.key === 'ArrowRight') rotate(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [rotate])

  /* Touch swipe: left/right anywhere on the stage rotates the ring */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 45) rotate(dx < 0 ? 1 : -1)
  }

  return (
    <div className="carousel-wrap">
      <div
        className="carousel-stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-track-2d">
          {projects.map((proj, i) => {
            const rawOffset = ((i - current) % TOTAL + TOTAL) % TOTAL
            const offset = rawOffset > TOTAL / 2 ? rawOffset - TOTAL : rawOffset
            const { finalX, scale, opacity, zIndex, clickable } = getTransform(offset, vw)
            const isActive = offset === 0

            return (
              <div
                key={proj.id}
                className={`mem-card${isActive ? ' active' : ''}${clickable ? ' front' : ''}`}
                style={{
                  position: 'absolute',
                  top: '46%',
                  left: '50%',
                  transform: `translateX(-50%) translateY(-50%) translateX(${finalX}px) scale(${scale})`,
                  opacity,
                  zIndex,
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
                  /* Off-centre card on mobile: first tap brings it to front */
                  if (getLayoutConstants(vw).mobile && !isActive) {
                    rotate(offset > 0 ? 1 : -1)
                    return
                  }
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
