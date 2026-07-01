import { forwardRef, useImperativeHandle, useRef } from 'react'

const Transition = forwardRef((props, ref) => {
  const el = useRef(null)

  useImperativeHandle(ref, () => ({
    fadeIn() {
      if (!el.current) return
      el.current.style.transition = 'opacity 0.35s ease'
      el.current.style.opacity = '1'
      el.current.style.pointerEvents = 'all'
    },
    fadeOut() {
      if (!el.current) return
      setTimeout(() => {
        el.current.style.transition = 'opacity 0.5s ease'
        el.current.style.opacity = '0'
        setTimeout(() => {
          if (el.current) el.current.style.pointerEvents = 'none'
        }, 520)
      }, 40)
    },
  }))

  return <div ref={el} className="transition-overlay" />
})

Transition.displayName = 'Transition'
export default Transition
