import { useRef } from 'react'
import { playHover } from './laser.jsx'

const icons = [
  { id: 'about',   glyph: '◐', label: 'ABOUT',   nudge: '1px' },
  { id: 'skills',  glyph: '◈', label: 'SKILLS',  nudge: '0px' },
  { id: 'cv',      glyph: '⬇', label: 'CV',      nudge: '1px' },
  { id: 'contact', glyph: '✉', label: 'CONTACT', nudge: '2px' },
]

export default function XMBRow({ onFire }) {
  const lastHovered = useRef(null)

  return (
    <div className="xmb-row">
      {icons.map(({ id, glyph, label, nudge }) => (
        <div
          key={id}
          className="xmb-item"
          onMouseEnter={() => {
            if (lastHovered.current !== id) { playHover(); lastHovered.current = id }
          }}
          onMouseLeave={() => { lastHovered.current = null }}
          onClick={(e) => {
            const icon = e.currentTarget.querySelector('.xmb-icon')
            onFire(icon, id)
          }}
        >
          <div className="xmb-icon">
            <span style={{ '--nudge': nudge }}>{glyph}</span>
          </div>
          <div className="xmb-label">{label}</div>
        </div>
      ))}
    </div>
  )
}
