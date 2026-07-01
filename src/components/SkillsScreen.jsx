import { useEffect, useRef } from 'react'
import { skills } from '../data/projects.js'

export default function SkillsScreen({ onBack }) {
  const barsRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (!barsRef.current) return
      barsRef.current.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.pct
      })
    }, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen">
      <div className="screen-topbar">
        <button className="back-btn" onClick={onBack}>← BACK</button>
        <span className="screen-title">SKILLS</span>
        <span />
      </div>
      <div className="skills-layout" ref={barsRef}>
        {skills.map(group => (
          <div key={group.group} className="skill-group">
            <div className="skill-group-title">{group.group}</div>
            {group.items.map(item => (
              <div key={item.name} className="skill-bar-row">
                <span>{item.name}</span>
                <div className="skill-bar">
                  <div className="skill-fill" data-pct={`${item.pct}%`} style={{ width: 0 }} />
                </div>
                <span className="skill-pct">{item.pct}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
