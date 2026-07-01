import { useEffect, useRef } from 'react'

export default function Crosshair() {
  const ref = useRef(null)

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
