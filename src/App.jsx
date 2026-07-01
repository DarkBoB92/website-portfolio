import { useState, useCallback, useRef } from 'react'
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
  const transitionRef = useRef(null)

  const navigateTo = useCallback((screenId) => {
    if (transitioning) return
    if (screenId === 'cv') {
      alert('CV download — add your file path here.')
      return
    }
    setTransitioning(true)
    transitionRef.current?.fadeIn()
    setTimeout(() => {
      setCurrentScreen(screenId)
      transitionRef.current?.fadeOut()
      setTimeout(() => setTransitioning(false), 520)
    }, 380)
  }, [transitioning])

  const navigateBack = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)
    transitionRef.current?.fadeIn()
    setTimeout(() => {
      setCurrentScreen(null)
      transitionRef.current?.fadeOut()
      setTimeout(() => setTransitioning(false), 520)
    }, 380)
  }, [transitioning])

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
            <HomeScreen onNavigate={navigateTo} />
          )}
          {renderScreen()}
        </>
      )}
    </>
  )
}
