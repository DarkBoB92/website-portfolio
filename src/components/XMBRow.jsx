import { useRef } from 'react'
import { playHover } from './laser.jsx'

const icons = [
  { id: 'about',   label: 'ABOUT',   profile: true },
  { id: 'skills',  glyph: '◈', label: 'SKILLS',  nudge: '0px' },
  { id: 'cv',      label: 'CV', download: true },
  { id: 'contact', glyph: '✉', label: 'CONTACT', nudge: '2px' },
]

function ProfileGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  )
}

function DownloadGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="14" />
      <polyline points="7 9 12 14 17 9" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  )
}

export default function XMBRow({ onFire }) {
  const lastHovered = useRef(null)

  return (
    <div className="xmb-row">
      {icons.map(({ id, glyph, label, nudge, download, profile }) => (
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
            {download
              ? <DownloadGlyph />
              : profile
              ? <ProfileGlyph />
              : <span style={{ '--nudge': nudge }}>{glyph}</span>}
          </div>
          <div className="xmb-label">{label}</div>
        </div>
      ))}
    </div>
  )
}
