import { useRef, useCallback, useEffect } from 'react'
import XMBRow from './XMBRow.jsx'
import Carousel from './Carousel.jsx'
import { useFireAt } from './laser.jsx'

export default function HomeScreen({ onNavigate, fire, carouselIndex, setCarouselIndex }) {
  const fireAt = useFireAt(fire)
  const fireActionAt = useFireAt(fire, { instant: true, cooldown: 150 })

  const handleFire = useCallback((targetEl, destination) => {
    fireAt(targetEl, () => onNavigate(destination))
  }, [fireAt, onNavigate])

  // For deliberate fires that don't navigate anywhere (e.g. carousel arrows) —
  // same laser/confirm feedback, but instant and rapid-click-friendly since
  // arrows are meant to be clicked in quick succession.
  const handleFireAction = useCallback((targetEl, action) => {
    fireActionAt(targetEl, action)
  }, [fireActionAt])

  return (
    <div className="home">
      <div className="bg-wave" />

      <div className="topbar">
        <div className="profile-chip">
          <div className="avatar">
            <img
              src={import.meta.env.BASE_URL + 'images/profile-avatar.jpg'}
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <span>ROBERTO SCIALPI</span>
        </div>
        <Clock />
      </div>

      <div className="hero">
        <h1>ROBERTO SCIALPI</h1>
        <p>GAME PROGRAMMER</p>
      </div>

      <XMBRow onFire={handleFire} />

      <div className="section-label">— PROJECTS —</div>

      <Carousel
        onFire={handleFire}
        onFireAction={handleFireAction}
        onNavigate={onNavigate}
        current={carouselIndex}
        setCurrent={setCarouselIndex}
      />

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
  return <span ref={ref} className="clock" />
}
