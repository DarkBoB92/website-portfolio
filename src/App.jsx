import { useState, useCallback, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import Boot from './components/Boot.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import AboutScreen from './components/AboutScreen.jsx'
import SkillsScreen from './components/SkillsScreen.jsx'
import ContactScreen from './components/ContactScreen.jsx'
import ProjectScreen from './components/ProjectScreen.jsx'
import Crosshair from './components/Crosshair.jsx'
import Transition from './components/Transition.jsx'
import { useLaser, playSpark } from './components/laser.jsx'
import { projects } from './data/projects.js'
import { projectForSlug, slugForProject } from './utils/slug.js'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0) // persists across navigation
  const transitionRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // The actual URL (from useLocation) and what's currently ON SCREEN are kept
  // separate on purpose. `location` can change instantly and outside our
  // control — the browser's own back/forward buttons update it directly via
  // React Router's history listener, with no warning and no way to intercept
  // it beforehand the way a click handler can. So instead of triggering the
  // fade from the thing that caused the navigation (which back/forward
  // bypasses entirely), it's triggered from the URL change itself: whenever
  // `location` no longer matches `displayedLocation`, fade out, THEN catch
  // displayedLocation up to it, THEN fade in. Every navigation path — card
  // clicks, the in-page back button, and the browser's own buttons — ends up
  // going through this one place, so all of them get the same fade.
  const [displayedLocation, setDisplayedLocation] = useState(location)
  const hasMountedRef = useRef(false)
  const transitionToken = useRef(0)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (location.pathname === displayedLocation.pathname) return

    // Tokened rather than boolean-guarded: if the user mashes the browser
    // back button rapidly, each press supersedes the last rather than
    // stacking or getting stuck on a stale mid-fade target.
    const myToken = ++transitionToken.current
    setTransitioning(true)
    transitionRef.current?.fadeIn()
    const t1 = setTimeout(() => {
      if (transitionToken.current !== myToken) return
      setDisplayedLocation(location)
      transitionRef.current?.fadeOut()
      const t2 = setTimeout(() => {
        if (transitionToken.current === myToken) setTransitioning(false)
      }, 520)
      return () => clearTimeout(t2)
    }, 380)
    return () => clearTimeout(t1)
  }, [location, displayedLocation])

  // Global laser system — mounted once here so it's available on every screen,
  // not just Home. Deliberate fires (XMB icons, project cards, carousel arrows)
  // call `fire` directly with a real travel distance from cursor to target.
  // Everything else falls through to the ambient "click anywhere" spark below.
  const mousePos = useRef({ x: -100, y: -100 })
  const { fire, LaserElements } = useLaser(mousePos)

  useEffect(() => {
    const move = (e) => { mousePos.current = { x: e.clientX, y: e.clientY } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  // Fun-factor: any click that isn't already claimed by a deliberate fire
  // (those call stopPropagation) gets a quick, quiet spark right where you clicked.
  useEffect(() => {
    const onClick = (e) => {
      playSpark()
      fire(e.clientX, e.clientY, () => {})
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [fire])

  // Click-initiated navigation just changes the URL — the effect above
  // handles the actual fade, uniformly with browser back/forward.
  const goToPath = useCallback((path) => {
    if (transitioning) return
    navigate(path)
  }, [transitioning, navigate])

  // destination is whatever XMBRow/Carousel already pass: 'about' | 'skills' |
  // 'contact' | 'cv' | a numeric project index. Kept as-is so none of those
  // components needed to change — only the mapping to a real path is new.
  const navigateTo = useCallback((destination) => {
    if (destination === 'cv') {
      const link = document.createElement('a')
      link.href = import.meta.env.BASE_URL + 'Roberto-Scialpi-CV.pdf'
      link.download = 'Roberto-Scialpi-CV.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }
    if (typeof destination === 'number') {
      const project = projects[destination]
      if (!project) return
      goToPath(`/projects/${slugForProject(project)}`)
      return
    }
    goToPath(`/${destination}`)
  }, [goToPath])

  // In-page "← BACK" button: always home, not "wherever the browser history
  // happens to say" — a deliberate choice (matches how the PS3 XMB's own
  // back button always steps up a level, not through arbitrary history).
  // The browser's own back/forward buttons are untouched and still walk
  // real history, so the two can legitimately differ — see chat for why.
  const navigateBack = useCallback(() => {
    goToPath('/')
  }, [goToPath])

  if (!booted) {
    return (
      <>
        <Crosshair />
        <Boot onDone={() => setBooted(true)} />
      </>
    )
  }

  return (
    <>
      <Crosshair />
      {LaserElements}
      <Transition ref={transitionRef} />
      <Routes location={displayedLocation}>
        <Route
          path="/"
          element={
            <HomeScreen
              onNavigate={navigateTo}
              fire={fire}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
            />
          }
        />
        <Route path="/about" element={<AboutScreen onBack={navigateBack} />} />
        <Route path="/skills" element={<SkillsScreen onBack={navigateBack} />} />
        <Route path="/contact" element={<ContactScreen onBack={navigateBack} />} />
        <Route
          path="/projects/:slug"
          element={<ProjectRoute onBack={navigateBack} fire={fire} />}
        />
        {/* Anything unrecognised (a stale/typo'd link) lands safely on
            home rather than a dead end. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function ProjectRoute({ onBack, fire }) {
  const { slug } = useParams()
  const project = projectForSlug(slug)
  if (!project) return <Navigate to="/" replace />
  return <ProjectScreen project={project} onBack={onBack} fire={fire} />
}
