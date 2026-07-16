import { useState, useRef, useCallback, useEffect } from 'react'
import { projects } from '../data/projects.js'
import { playHover, playNavigate } from './laser.jsx'

const TOTAL = projects.length
const CARD_W = 250
const CARD_H = 340
// Must match .carousel-3d / .carousel-stage perspective in main.css
const PERSPECTIVE = 1600

const CARD_RATIO = CARD_H / CARD_W  // 1.36 — mobile cards keep this same proportion

// Rough vertical budget consumed by everything above/below the carousel
// stage itself (topbar, hero, XMB row, section label, nav arrows, dots,
// status strip). Deliberately conservative — better to slightly undersize
// the card than to force scrolling on a short screen.
function chromeHeight(vh) {
  return vh <= 500 ? 190 : 280
}

// The real fix for portrait vs landscape: compute a size from *width*
// (for narrow screens) and a size from *height* (for short screens),
// then use whichever one is smaller. A landscape phone is wide but short,
// so the height-based number wins there; a portrait phone is narrow but
// tall, so the width-based number wins there. Same formula handles both
// instead of guessing per-orientation.
function getMobileCardSize(vw, vh) {
  const wFromWidth = vw <= 640 ? 240 : 290
  const hFromWidth = wFromWidth * CARD_RATIO

  const availH = Math.max(160, vh - chromeHeight(vh))
  const hFromHeight = Math.min(hFromWidth, availH)
  const wFromHeight = hFromHeight / CARD_RATIO

  if (wFromHeight < wFromWidth) return { w: Math.round(wFromHeight), h: Math.round(hFromHeight) }
  return { w: wFromWidth, h: Math.round(hFromWidth) }
}

function getConfig(vw) {
  if (vw >= 1000) return { radius: 780, mobile: false }
  return { radius: vw * 0.62, mobile: true }
}

// Real 3D geometry for a card at a given ring offset: angle, z-depth, x position.
function get3D(offset, radius) {
  const anglePer = 360 / TOTAL
  const angle = offset * anglePer
  const rad = angle * Math.PI / 180
  const z = Math.cos(rad) * radius - radius   // <= 0, cards recede as offset grows
  const x = Math.sin(rad) * radius
  const ry = -angle * 0.18
  return { angle, rad, z, x, ry }
}

function getRingTransform(offset, vw, vh) {
  const { radius, mobile } = getConfig(vw)

  if (mobile) {
    const { w: cardW } = getMobileCardSize(vw, vh)
    if (offset === 0)            return { t: 'translateX(-50%) translateY(-50%) scale(1)', opacity: 1, z: 30, clickable: true }
    if (Math.abs(offset) === 1)  return { t: `translateX(-50%) translateY(-50%) translateX(${offset * cardW * 0.86}px) scale(0.8)`, opacity: 0.6, z: 20, clickable: true }
    // Comfortably off the visible strip regardless of viewport width — exact
    // distance barely matters since these are also display:none'd below.
    return { t: `translateX(-50%) translateY(-50%) translateX(${offset * (vw + cardW)}px) scale(0.6)`, opacity: 0, z: 10, clickable: false }
  }

  const { z, x, ry } = get3D(offset, radius)

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

// The centre + immediate left/right cards render fine visually, but their
// real hit-boxes (translateZ + rotateY inside a preserve-3d/will-change
// context) don't reliably line up with where they're painted — only the
// untransformed centre card (translateZ(0), rotateY(0)) hit-tests correctly.
// So on desktop we make the 3D cards purely visual (pointer-events: none)
// and lay flat, non-transformed "catcher" plates over the three front slots,
// positioned with the same perspective-projection math the browser itself
// uses to draw the 3D transform, so they land exactly on the visible card.
function getCatcherStyle(offset, vw) {
  const { radius } = getConfig(vw)
  const { z, x } = get3D(offset, radius)
  const scale = PERSPECTIVE / (PERSPECTIVE - z)   // perspective divide
  const screenX = x * scale

  return {
    position: 'absolute',
    top: '42%',
    left: '50%',
    width: CARD_W,
    height: CARD_H,
    transform: `translate(-50%, -50%) translateX(${screenX}px) scale(${scale})`,
    zIndex: 2000 - Math.abs(offset), // centre catcher on top
    pointerEvents: 'auto',
    cursor: 'none',
  }
}

// current + setCurrent come from the parent so the position survives navigation
export default function Carousel({ onFire, onFireAction, onNavigate, current, setCurrent }) {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  const [hoveredOffset, setHoveredOffset] = useState(null)
  const lastHovered = useRef(null)
  const touchStartX = useRef(null)
  const touchMoved = useRef(false)
  const wheelAcc = useRef(0)
  const wheelLastStep = useRef(0)

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    // Some mobile browsers fire orientationchange BEFORE the new
    // innerWidth/innerHeight are available, so read now and again shortly
    // after to catch the settled values either way.
    const onOrientation = () => { onResize(); setTimeout(onResize, 300) }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onOrientation)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onOrientation)
    }
  }, [])

  const rotate = useCallback((dir, opts = {}) => {
    if (!opts.silent) playNavigate()
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
  const mobileSize = mobile ? getMobileCardSize(vw, vh) : null

  // Wheel navigation: scroll down (or trackpad-right) = next, scroll up = previous.
  //
  // Delta accumulator rather than a time-lock, so speed scales with intent:
  // each ~WHEEL_STEP px of accumulated scroll fires one card step (≈ one mouse
  // notch), floored at WHEEL_MIN_INTERVAL ms between steps. Resetting the bucket
  // after each step defuses trackpad inertia — the decaying tail of tiny deltas
  // can't refill it, so a flick settles after at most one extra card instead of
  // spinning the whole ring.
  const WHEEL_STEP = 100
  const WHEEL_MIN_INTERVAL = 90
  const onWheel = (e) => {
    const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    // deltaMode: 0 = pixels, 1 = lines (Firefox), 2 = pages — normalise to px
    const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 300 : 1
    const delta = raw * unit
    if (delta === 0) return
    // Direction change discards leftover momentum from the previous gesture
    if (Math.sign(delta) !== Math.sign(wheelAcc.current)) wheelAcc.current = 0
    wheelAcc.current += delta
    const now = performance.now()
    if (Math.abs(wheelAcc.current) >= WHEEL_STEP && now - wheelLastStep.current >= WHEEL_MIN_INTERVAL) {
      wheelLastStep.current = now
      rotate(wheelAcc.current > 0 ? 1 : -1)
      wheelAcc.current = 0
    }
  }

  return (
    <div className="carousel-wrap" onWheel={onWheel}>
      <div
        className="carousel-stage carousel-3d"
        style={mobileSize ? { height: `${Math.round(mobileSize.h * 1.15)}px` } : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-ring">
          {projects.map((proj, i) => {
            const rawOffset = ((i - current) % TOTAL + TOTAL) % TOTAL
            const offset = rawOffset > TOTAL / 2 ? rawOffset - TOTAL : rawOffset
            const { t, opacity, z, clickable } = getRingTransform(offset, vw, vh)
            const isActive = offset === 0
            const isHovered = !mobile && hoveredOffset === offset
            // Belt-and-braces: overflow:hidden can fail to clip 3D-transformed
            // descendants on some mobile browsers (a known rendering quirk,
            // especially visible during pinch-zoom). Rather than depend on
            // that clipping, fully remove cards that aren't meant to be seen.
            const isHidden = mobile && !clickable

            return (
              <div
                key={proj.id}
                className="mem-slot"
                style={{
                  position: 'absolute',
                  top: mobile ? '50%' : '42%',
                  left: '50%',
                  width: mobileSize ? `${mobileSize.w}px` : undefined,
                  height: mobileSize ? `${mobileSize.h}px` : undefined,
                  transform: t,
                  opacity,
                  zIndex: isHovered ? z + 500 : z,
                  display: isHidden ? 'none' : undefined,
                  // Desktop: catchers below handle all interaction, cards are purely visual.
                  // Mobile: flat 2D transforms hit-test fine natively, keep it simple.
                  pointerEvents: mobile && clickable ? 'auto' : 'none',
                  // Slow, gentle glide for ring rotation only — the hover pop lives
                  // on the inner .mem-card with its own faster transition.
                  transition: 'transform 0.55s cubic-bezier(.22,.8,.3,1), opacity 0.6s ease',
                }}
                onMouseEnter={() => {
                  if (clickable && lastHovered.current !== i) {
                    playHover()
                    lastHovered.current = i
                  }
                }}
                onMouseLeave={() => { lastHovered.current = null }}
                onClick={(e) => {
                  // Only reachable on mobile now (desktop cards are pointer-events:none)
                  if (!clickable || !mobile) return
                  if (touchMoved.current) return   // was a swipe, already handled
                  e.stopPropagation()
                  if (!isActive) { rotate(offset > 0 ? 1 : -1) }
                  else { onFire(e.currentTarget.querySelector('.mem-card'), i) }
                }}
              >
                <div className={`mem-card${isActive ? ' active' : ''}${clickable ? ' front' : ''}${isHovered ? ' hovered' : ''}`}>
                  <div className="thumb">
                  {proj.thumbnailVideo ? (
                    <video
                      className="thumb-img"
                      src={import.meta.env.BASE_URL + proj.thumbnailVideo}
                      poster={proj.thumbnail ? import.meta.env.BASE_URL + proj.thumbnail : undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    />
                  ) : proj.thumbnail ? (
                    <img
                      className="thumb-img"
                      src={import.meta.env.BASE_URL + proj.thumbnail}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                </div>
                  <p className="name">{proj.name}</p>
                  <p className="meta">{proj.meta}</p>
                  <p className="tech">{proj.tech}</p>
                </div>
              </div>
            )
          })}
        </div>

        {!mobile && (
          <div className="carousel-catchers">
            {[-1, 0, 1].map(offset => {
              const i = ((current + offset) % TOTAL + TOTAL) % TOTAL
              return (
                <div
                  key={offset}
                  style={getCatcherStyle(offset, vw)}
                  onMouseEnter={() => {
                    if (lastHovered.current !== i) {
                      playHover()
                      lastHovered.current = i
                    }
                    setHoveredOffset(offset)
                  }}
                  onMouseLeave={() => {
                    lastHovered.current = null
                    setHoveredOffset(curr => (curr === offset ? null : curr))
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onFire(e.currentTarget, i)
                  }}
                />
              )
            })}
          </div>
        )}

        <div
          className="carousel-arrow side-left"
          onClick={(e) => {
            e.stopPropagation()
            onFireAction(e.currentTarget, () => rotate(-1, { silent: true }))
          }}
        >‹</div>
        <div
          className="carousel-arrow side-right"
          onClick={(e) => {
            e.stopPropagation()
            onFireAction(e.currentTarget, () => rotate(1, { silent: true }))
          }}
        >›</div>
      </div>

      <div className="carousel-nav">
        <div className="carousel-dots">
          {projects.map((_, i) => (
            <span key={i} className={i === current ? 'active' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
