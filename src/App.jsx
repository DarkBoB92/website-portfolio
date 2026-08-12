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

  /* Run the fade-to-black, swap the ROUTE at the midpoint (invisible,
     same beat as the old screen-swap), fade back. React Router owns
     history now — no more manual pushState/replaceState/popstate
     bookkeeping, which also means real URLs, working browser back/
     forward, and shareable direct links, none of which the old
     state-only version could do. */
  const goToPath = useCallback((path) => {
    if (transitioning) return
    setTransitioning(true)
    transitionRef.current?.fadeIn()
    setTimeout(() => {
      navigate(path)
      transitionRef.current?.fadeOut()
      setTimeout(() => setTransitioning(false), 520)
    }, 380)
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
      <Routes location={location}>
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
