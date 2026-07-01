import { useRef, useCallback, useEffect } from 'react'
import XMBRow from './XMBRow.jsx'
import Carousel from './Carousel.jsx'
import { useLaser, playLaser, playConfirm } from './laser.jsx'

export default function HomeScreen({ onNavigate }) {
  const mousePos = useRef({ x: -100, y: -100 })
  const { fire, LaserElements } = useLaser(mousePos)
  const crosshairRef = useRef(null)

  useEffect(() => {
    const move = (e) => { mousePos.current = { x: e.clientX, y: e.clientY } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleFire = useCallback((targetEl, destination) => {
    const rect = targetEl.getBoundingClientRect()
    const tx = rect.left + rect.width / 2
    const ty = rect.top + rect.height / 2
    playLaser()
    fire(tx, ty, () => {
      playConfirm()
      onNavigate(destination)
    })
  }, [fire, onNavigate])

  return (
    <div className="home">
      {LaserElements}

      <div className="bg-wave" />

      <div className="topbar">
        <div className="profile-chip">
          <div className="avatar" />
          <span>ROBERTO SCIALPI</span>
        </div>
        <Clock />
      </div>

      <div className="hero">
        <h1>ROBERTO SCIALPI</h1>
        <p>GAME DEVELOPER</p>
      </div>

      <XMBRow onFire={handleFire} />

      <div className="section-label">— PROJECTS —</div>

      <Carousel onFire={handleFire} onNavigate={onNavigate} />

      <div className="status-strip">
        <span>FIRST CLASS HONOURS · BSc GAMES DESIGN &amp; DEVELOPMENT</span>
        <span className="status-dot" />
        <span>UNIVERSITY OF GREENWICH · 2026</span>
      </div>
    </div>
  )
}

function Clock() {
  const ref = useRef(null)
  useEffect(() => {
    const tick = () => {
      if (!ref.current) return
      const now = new Date()
      ref.current.textContent =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0')
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref} />
}
