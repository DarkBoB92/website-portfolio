import { useState, useCallback, useRef, useEffect } from 'react'
import Boot from './components/Boot.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import AboutScreen from './components/AboutScreen.jsx'
import SkillsScreen from './components/SkillsScreen.jsx'
import ContactScreen from './components/ContactScreen.jsx'
import ProjectScreen from './components/ProjectScreen.jsx'
import Crosshair from './components/Crosshair.jsx'
import Transition from './components/Transition.jsx'
import { projects } from './data/projects.js'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [currentScreen, setCurrentScreen] = useState(null) // null = home
  const [transitioning, setTransitioning] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0) // persists across navigation
  const transitionRef = useRef(null)

  /* Run the fade-to-black, swap the screen, fade back.
     `pushHistory` controls whether we add a browser history entry
     (true when the user opens a section, false when we're just
     reacting to the browser back button so we don't double-stack). */
  const goToScreen = useCallback((screenId, pushHistory = true) => {
    if (transitioning) return
    setTransitioning(true)
    transitionRef.current?.fadeIn()
    setTimeout(() => {
      setCurrentScreen(screenId)
      if (pushHistory) {
        if (screenId === null) {
          // returning home — replace so we don't pile up entries
          window.history.replaceState({ screen: null }, '')
        } else {
          window.history.pushState({ screen: screenId }, '')
        }
      }
      transitionRef.current?.fadeOut()
      setTimeout(() => setTransitioning(false), 520)
    }, 380)
  }, [transitioning])

  const navigateTo = useCallback((screenId) => {
    if (screenId === 'cv') {
      alert('CV download — add your file path here.')
      return
    }
    goToScreen(screenId, true)
  }, [goToScreen])

  // In-page BACK button: step the browser history back one entry.
  // This fires popstate, which does the actual transition — keeping
  // the in-page button and the browser back button perfectly in sync.
  const navigateBack = useCallback(() => {
    if (transitioning) return
    window.history.back()
  }, [transitioning])

  /* Listen for browser back/forward. When the user (or our own
     navigateBack) pops history, transition to whatever screen that
     entry represents — null means home. */
  useEffect(() => {
    const onPop = (e) => {
      const screen = e.state?.screen ?? null
      goToScreen(screen, false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [goToScreen])

  const renderScreen = () => {
    if (currentScreen === 'about') return <AboutScreen onBack={navigateBack} />
    if (currentScreen === 'skills') return <SkillsScreen onBack={navigateBack} />
    if (currentScreen === 'contact') return <ContactScreen onBack={navigateBack} />
    if (typeof currentScreen === 'number') {
      return <ProjectScreen project={projects[currentScreen]} onBack={navigateBack} />
    }
    return null
  }

  return (
    <>
      <Crosshair />
      <Transition ref={transitionRef} />
      {!booted && <Boot onDone={() => setBooted(true)} />}
      {booted && (
        <>
          {currentScreen === null && (
            <HomeScreen
              onNavigate={navigateTo}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
            />
          )}
          {renderScreen()}
        </>
      )}
    </>
  )
}
