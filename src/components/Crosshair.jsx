import { useEffect, useRef, useState } from 'react'

export default function Crosshair() {
  const ref = useRef(null)
  // Native video controls (the scrub bar, play/pause) draw the browser's own
  // cursor, which our crosshair can't replace or hide — so we step aside and
  // let the real cursor take over whenever the pointer is over a <video controls>,
  // and whenever the page is fullscreen (fullscreen video controls need a real,
  // visible cursor to be usable — our crosshair also can't render inside the
  // browser's fullscreen layer at all, since it lives outside that element).
  const [nativeCursor, setNativeCursor] = useState(false)

  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const controlledVideo = (target) => {
      const el = target.closest?.('video')
      return el && el.controls ? el : null
    }

    const onOver = (e) => {
      if (controlledVideo(e.target)) setNativeCursor(true)
    }
    const onOut = (e) => {
      if (controlledVideo(e.target) && !controlledVideo(e.relatedTarget)) {
        setNativeCursor(false)
      }
    }
    const onFullscreenChange = () => setNativeCursor(!!document.fullscreenElement)

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('native-cursor', nativeCursor)
  }, [nativeCursor])

  if (nativeCursor) return null

  return (
    <div ref={ref} className="crosshair">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="7" stroke="#5be0c9" strokeWidth="1.5" fill="none" opacity="0.9" />
        <line x1="18" y1="0" x2="18" y2="10" stroke="#5be0c9" strokeWidth="1.5" opacity="0.8" />
        <line x1="18" y1="26" x2="18" y2="36" stroke="#5be0c9" strokeWidth="1.5" opacity="0.8" />
        <line x1="0" y1="18" x2="10" y2="18" stroke="#5be0c9" strokeWidth="1.5" opacity="0.8" />
        <line x1="26" y1="18" x2="36" y2="18" stroke="#5be0c9" strokeWidth="1.5" opacity="0.8" />
        <circle cx="18" cy="18" r="1.5" fill="#5be0c9" />
      </svg>
    </div>
  )
}
