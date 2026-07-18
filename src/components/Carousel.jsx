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
// stage itself. Used only for the very first paint, before the real
// available height has been measured off the actual DOM (see wrapAvailH
// in the component below) — landscape phones especially can't be
// estimated reliably by formula since the exact chrome height depends on
// font rendering, so this is just a placeholder to avoid a flash of a
// wrongly-sized card before the measurement effect runs.
function chromeHeight(vh) {
  return vh <= 550 ? 170 : 280
}

// Portrait phones flip the whole layout: icons dock on the left edge,
// dots on the right, and the cards run VERTICALLY between them (swipe
// up/down). True when we're phone-narrow AND taller than wide.
function isPortrait(vw, vh) {
  return vw <= 640 && vh > vw
}

// Desktop vs mobile is decided by one question only: does the desktop 3D
// ring actually FIT? The ring needs ~1000px of width AND ~700px of height
// (440px stage + the header stack). Width alone used to decide this, which
// broke on landscape phones — in CSS pixels they can be 900–1200px wide,
// so they'd get the full ring crammed into a ~400px-tall screen. Any
// viewport that fails either dimension gets the strip, which sizes itself
// off measured space and works at any height. No device sniffing, and
// F12-resize behaves identically to a real phone.
function getConfig(vw, vh) {
  if (vw >= 1000 && vh >= 700) return { radius: 780, mobile: false }
  return { radius: vw * 0.62, mobile: true }
}

// Card size for the vertical (portrait) column. Width is whatever fits
// between the icon dock (left) and the dot rail (right); height is then
// capped twice: by a share of the viewport, and — the important one — by
// the MEASURED stage height, so that the ±1 neighbour cards stay fully
// inside the stage. (±1 outer edge sits at spacing 0.78h + half of the
// 0.74-scaled card = 1.15h from centre; keeping 1.15h within half the
// measured stage is what stops neighbours sliding up over the title and
// down under the status strip on shorter phones.)
function getPortraitCardSize(vw, vh, measuredAvailH) {
  const w0 = Math.min(250, vw - 132)
  let h = Math.round(w0 * CARD_RATIO)
  const capVh = Math.round(vh * 0.40)
  const capStage = measuredAvailH != null
    ? Math.floor((measuredAvailH / 2 - 12) / 1.15)
    : capVh
  h = Math.min(h, capVh, capStage)
  return { w: Math.round(h / CARD_RATIO), h }
}

// The real fix for portrait vs landscape: compute a size from *width*
// (for narrow screens) and a size from *height* (for short screens),
// then use whichever one is smaller. A landscape phone is wide but short,
// so the height-based number wins there; a portrait phone is narrow but
// tall, so the width-based number wins there. Same formula handles both
// instead of guessing per-orientation.
//
// measuredAvailH, when provided, is the carousel-wrap's actual rendered
// height (see wrapAvailH in the component) — the true remaining space
// after the topbar/hero/icons/dots/status-strip have taken theirs. This
// replaces the old fixed chromeHeight() guess, which under-cropped on
// landscape phones (their compact chrome still added up to more than the
// guess accounted for) and caused the card to overflow into the UI above
// and below it.
//
// STAGE_MARGIN mirrors the 1.15x the stage element itself adds around the
// card (see the inline `height: cardSize.h * 1.15` below) — dividing the
// measured space by it here keeps the card + its margin within budget,
// instead of the card alone fitting but the stage still overflowing.
const STAGE_MARGIN = 1.15
function getMobileCardSize(vw, vh, measuredAvailH) {
  const wFromWidth = vw <= 640 ? 240 : 290
  const hFromWidth = wFromWidth * CARD_RATIO

  const rawAvailH = measuredAvailH != null ? measuredAvailH : vh - chromeHeight(vh)
  const availH = Math.max(120, rawAvailH / STAGE_MARGIN)

  // Fits at full size — done.
  if (hFromWidth <= availH) return { w: wFromWidth, h: Math.round(hFromWidth) }

  // Height-limited. On wide-but-short (landscape) screens, ALSO relax the
  // aspect ratio: the tall 1.36 card at reduced height leaves a block of
  // dead space under the text, so let it be a bit squarer instead. The
  // interiors are proportional (thumb 44%, see main.css) so they follow.
  const ratio = vw > vh ? 1.18 : CARD_RATIO
  const h = Math.round(availH)
  const w = Math.min(Math.round(availH / ratio), wFromWidth)
  return { w, h }
}

// (getConfig moved above, next to isLandscapePhone — it now needs vh too)

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

function getRingTransform(offset, vw, vh, portrait, measuredAvailH) {
  const { radius, mobile } = getConfig(vw, vh)

  // Vertical column for portrait phones: active card centred, neighbours
  // peek above/below (scaled + faded), second neighbours barely-there for
  // depth. They slide UNDER the hero / status strip, which sit on a
  // higher layer, so the title always stays readable.
  if (portrait) {
    const { h: cardH } = getPortraitCardSize(vw, vh, measuredAvailH)
    if (offset === 0) {
      return { t: 'translateX(-50%) translateY(-50%) scale(1)', opacity: 1, z: 30, clickable: true }
    }
    if (Math.abs(offset) === 1) {
      return { t: `translateX(-50%) translateY(-50%) translateY(${offset * cardH * 0.78}px) scale(0.74)`, opacity: 0.5, z: 20, clickable: true }
    }
    if (Math.abs(offset) === 2) {
      return { t: `translateX(-50%) translateY(-50%) translateY(${offset * cardH * 1.42}px) scale(0.6)`, opacity: 0.12, z: 10, clickable: false }
    }
    return { t: `translateX(-50%) translateY(-50%) translateY(${offset * vh}px) scale(0.5)`, opacity: 0, z: 5, clickable: false }
  }

  if (mobile) {
    const { w: cardW } = getMobileCardSize(vw, vh, measuredAvailH)
    // Any landscape strip spreads: cards there are height-limited (small),
    // so a fixed 0.86-card spacing left them huddled mid-screen with empty
    // gutters — a width threshold missed smaller phones entirely (640-823px
    // landscape). Orientation is the right signal: wide-and-short means
    // there's horizontal room to use. Portrait-ish strips (tablets held
    // upright) keep the tight overlapped look.
    const spread = vw > vh
    const s1 = spread ? Math.min(cardW * 1.7, vw * 0.30) : cardW * 0.86
    if (offset === 0)            return { t: 'translateX(-50%) translateY(-50%) scale(1)', opacity: 1, z: 30, clickable: true }
    if (Math.abs(offset) === 1)  return { t: `translateX(-50%) translateY(-50%) translateX(${Math.sign(offset) * s1}px) scale(0.8)`, opacity: 0.6, z: 20, clickable: true }
    // Spread strips also get faded ±2 depth cards straddling the screen
    // edges, echoing the desktop ring. (Distance is FROM CENTRE — a previous
    // version multiplied by the raw offset of ±2, landing them offscreen.)
    if (Math.abs(offset) === 2 && spread) {
      const s2 = Math.min(s1 + cardW * 0.8, vw / 2 + cardW * 0.2)
      return { t: `translateX(-50%) translateY(-50%) translateX(${Math.sign(offset) * s2}px) scale(0.62)`, opacity: 0.25, z: 12, clickable: false }
    }
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
function getCatcherStyle(offset, vw, vh) {
  const { radius } = getConfig(vw, vh)
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

// One persistent element per card: a video paints its MID-POINT frame as
// the resting state, and the same element plays when the card is the
// spotlight — active on mobile, active or hovered on desktop. Applies
// identically to the desktop ring and both mobile modes.
//
// Mid-point, not first frame: these videos open with a fade-in, so frame
// one is a black square. The middle is representative gameplay. Playback
// still starts from 0 so the designed fade-in intro is preserved, and
// pausing re-seeks to the middle so the resting state is always the same
// frame. Image-only projects (no video) just show their thumbnail.
function CardThumb({ proj, playing }) {
  const videoRef = useRef(null)

  const seekToMiddle = (v) => {
    if (v && v.duration && isFinite(v.duration)) {
      try { v.currentTime = v.duration / 2 } catch { /* not seekable yet */ }
    }
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      // From the top, so the fade-in intro plays as designed
      try { v.currentTime = 0 } catch { /* not seekable yet */ }
      const p = v.play()
      if (p && p.catch) p.catch(() => {})   // autoplay rejection isn't fatal
    } else {
      v.pause()
      seekToMiddle(v)
    }
  }, [playing])

  if (proj.thumbnailVideo) {
    return (
      <video
        ref={videoRef}
        className="thumb-img"
        src={import.meta.env.BASE_URL + proj.thumbnailVideo}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => { if (!playing) seekToMiddle(e.currentTarget) }}
      />
    )
  }
  if (proj.thumbnail) {
    return (
      <img
        className="thumb-img"
        src={import.meta.env.BASE_URL + proj.thumbnail}
        alt=""
        loading="lazy"
      />
    )
  }
  return null
}

// current + setCurrent come from the parent so the position survives navigation
export default function Carousel({ onFire, onFireAction, onNavigate, current, setCurrent }) {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  const [hoveredOffset, setHoveredOffset] = useState(null)
  const lastHovered = useRef(null)
  const touchStart = useRef(null)          // { x, y } of the initial touch
  const touchMoved = useRef(false)
  const wheelAcc = useRef(0)
  const wheelLastStep = useRef(0)
  const wrapRef = useRef(null)
  // The real, rendered height of .carousel-wrap — i.e. whatever's left
  // over after the topbar/hero/icons/section-label/status-strip have
  // taken their share of the flex column. null until first measured.
  const [wrapAvailH, setWrapAvailH] = useState(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect?.height
      if (h) setWrapAvailH(h)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') rotate(-1)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') rotate(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [rotate])

  const portrait = isPortrait(vw, vh)
  const mobile = getConfig(vw, vh).mobile
  const cardSize = portrait ? getPortraitCardSize(vw, vh, wrapAvailH)
                 : mobile   ? getMobileCardSize(vw, vh, wrapAvailH)
                 : null

  // Swipes drive the carousel: horizontal on desktop/landscape, VERTICAL
  // on portrait phones (swipe up = next, like flicking through a rail).
  // Page scrolling / pull-to-refresh can't hijack the gesture because the
  // home screen sets touch-action: none (see main.css).
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    touchMoved.current = false
  }
  const onTouchMove = (e) => {
    if (!touchStart.current) return
    const dx = e.touches[0].clientX - touchStart.current.x
    const dy = e.touches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) touchMoved.current = true
  }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (portrait) {
      if (Math.abs(dy) > 45) rotate(dy < 0 ? 1 : -1)
    } else {
      if (Math.abs(dx) > 45) rotate(dx < 0 ? 1 : -1)
    }
  }

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

  // Arrows are hidden on phones via CSS (swipe handles navigation there),
  // so no need to compute their position on mobile.
  const arrowGap = (portrait && !mobile) ? Math.round(cardSize.h / 2) + 26 : null
  const arrowPrevStyle = portrait
    ? { left: '50%', right: 'auto', top: `calc(50% - ${arrowGap}px)`, bottom: 'auto' }
    : undefined
  const arrowNextStyle = portrait
    ? { left: '50%', right: 'auto', top: `calc(50% + ${arrowGap}px)`, bottom: 'auto' }
    : undefined

  return (
    <div className="carousel-wrap" ref={wrapRef} onWheel={onWheel}>
      <div
        className="carousel-stage carousel-3d"
        style={
          portrait ? { height: '100%' }
          : cardSize ? { height: `${Math.round(cardSize.h * 1.15)}px` }
          : undefined
        }
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-ring">
          {projects.map((proj, i) => {
            const rawOffset = ((i - current) % TOTAL + TOTAL) % TOTAL
            const offset = rawOffset > TOTAL / 2 ? rawOffset - TOTAL : rawOffset
            const { t, opacity, z, clickable } = getRingTransform(offset, vw, vh, portrait, wrapAvailH)
            const isActive = offset === 0
            const isHovered = !mobile && hoveredOffset === offset
            // Belt-and-braces: overflow:hidden can fail to clip 3D-transformed
            // descendants on some mobile browsers (a known rendering quirk,
            // especially visible during pinch-zoom). Rather than depend on
            // that clipping, fully remove cards that aren't meant to be seen.
            // Portrait keeps the ±2 "depth" cards visible (very faint), so
            // only |offset| >= 3 is culled there.
            const spreadStrip = mobile && !portrait && vw > vh
            const isHidden = (portrait || spreadStrip) ? Math.abs(offset) >= 3 : (mobile && !clickable)

            return (
              <div
                key={proj.id}
                className="mem-slot"
                style={{
                  position: 'absolute',
                  top: mobile ? '50%' : '42%',
                  left: '50%',
                  width: cardSize ? `${cardSize.w}px` : undefined,
                  height: cardSize ? `${cardSize.h}px` : undefined,
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
                    <CardThumb proj={proj} playing={isActive || isHovered} />
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
                  style={getCatcherStyle(offset, vw, vh)}
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
          style={arrowPrevStyle}
          onClick={(e) => {
            e.stopPropagation()
            onFireAction(e.currentTarget, () => rotate(-1, { silent: true }))
          }}
        >‹</div>
        <div
          className="carousel-arrow side-right"
          style={arrowNextStyle}
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
