import { useState, useRef, useCallback, useEffect } from 'react'
import { projects } from '../data/projects.js'
import { playHover, playNavigate, playLaser, playConfirm } from './laser.jsx'

const RADIUS = 380
const TOTAL = projects.length

function getTransform(offset) {
  const angle = (offset / TOTAL) * 360
  const rad = angle * Math.PI / 180
  const x = Math.sin(rad) * RADIUS
  const z = Math.cos(rad) * RADIUS
  const normalizedZ = (z + RADIUS) / (2 * RADIUS)
  const scale = 0.5 + 0.5 * normalizedZ

  let finalX = x
  if (Math.abs(offset) === 2) finalX = offset < 0 ? -480 : 480

  let opacity
  if (Math.abs(offset) <= 1) opacity = 1.0
  else if (Math.abs(offset) === 2) opacity = 0.45
  else if (Math.abs(offset) === 3) opacity = 0.18
  else opacity = 0.08

  return { x: finalX, z, scale, opacity, normalizedZ }
}

export default function Carousel({ onFire, onNavigate }) {
  const [current, setCurrent] = useState(0)
  const lastHovered = useRef(null)

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

  return (
    <div className="carousel-wrap">
      <div className="carousel-stage">
        <div className="carousel-track">
          {projects.map((proj, i) => {
            const rawOffset = ((i - current) % TOTAL + TOTAL) % TOTAL
            const offset = rawOffset > TOTAL / 2 ? rawOffset - TOTAL : rawOffset
            const { x, z, scale, opacity } = getTransform(offset)
            const isFront = Math.abs(offset) <= 1
            const isActive = offset === 0

            return (
              <div
                key={proj.id}
                className={`mem-card${isActive ? ' active' : ''}${isFront ? ' front' : ''}`}
                style={{
                  transform: `translateX(-50%) translateY(-50%) translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                  opacity,
                  zIndex: Math.round(z + RADIUS + 10),
                  pointerEvents: isFront ? 'auto' : 'none',
                  top: '40%',
                }}
                onMouseEnter={() => {
                  if (isFront && lastHovered.current !== i) {
                    playHover()
                    lastHovered.current = i
                  }
                }}
                onMouseLeave={() => { lastHovered.current = null }}
                onClick={(e) => {
                  if (!isFront) return
                  const el = e.currentTarget
                  onFire(el, i)
                }}
              >
                <div data-card-id={i} className="thumb" />
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
