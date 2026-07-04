import { skills, projects } from '../data/projects.js'

const PIP_MAX = 10

/* Which projects use a given skill — derived from project tech/tags */
function projectsUsing(matchKeywords) {
  return projects.filter(proj => {
    const haystack = (proj.tech + ' ' + proj.tags.join(' ')).toUpperCase()
    return matchKeywords.some(kw => haystack.includes(kw.toUpperCase()))
  })
}

/* Original abstract glyphs — not brand logos, just evocative shapes */
function SkillIcon({ type }) {
  const common = {
    width: 34, height: 34, viewBox: '0 0 34 34',
    fill: 'none', stroke: '#5be0c9', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  switch (type) {
    case 'cube':
      return (
        <svg {...common}>
          <path d="M17 4 L29 11 L29 23 L17 30 L5 23 L5 11 Z" />
          <path d="M17 4 L17 17 M17 17 L29 11 M17 17 L5 11" opacity="0.6" />
        </svg>
      )
    case 'engine':
      return (
        <svg {...common}>
          <path d="M17 3 L31 12 L26 28 L8 28 L3 12 Z" />
          <path d="M17 3 L17 28 M3 12 L26 28 M31 12 L8 28" opacity="0.4" />
        </svg>
      )
    case 'brackets':
      return (
        <svg {...common}>
          <path d="M12 7 L6 17 L12 27" />
          <path d="M22 7 L28 17 L22 27" />
          <path d="M19 10 L15 24" opacity="0.6" />
        </svg>
      )
    case 'shader':
      return (
        <svg {...common}>
          <circle cx="17" cy="17" r="11" />
          <path d="M17 6 A11 11 0 0 1 17 28 Z" fill="#5be0c9" stroke="none" opacity="0.35" />
          <circle cx="17" cy="17" r="11" />
        </svg>
      )
    default:
      return <svg {...common}><circle cx="17" cy="17" r="10" /></svg>
  }
}

function SkillRow({ item }) {
  const used = projectsUsing(item.match)
  return (
    <div className="skill-row">
      <div className="skill-icon"><SkillIcon type={item.icon} /></div>
      <div className="skill-body">
        <div className="skill-row-head">
          <span className="skill-name">{item.name}</span>
          <div className="skill-pips">
            {Array.from({ length: PIP_MAX }).map((_, i) => (
              <span key={i} className={`pip${i < item.pips ? ' filled' : ''}`} />
            ))}
          </div>
        </div>
        {used.length > 0 && (
          <div className="skill-usedin">
            <span className="usedin-label">USED IN</span>
            <span className="usedin-list">{used.map(p => p.name).join(' · ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SkillsScreen({ onBack }) {
  return (
    <div className="screen">
      <div className="screen-topbar">
        <button className="back-btn" onClick={onBack}>← BACK</button>
        <span className="screen-title">SKILLS</span>
        <span />
      </div>
      <div className="skills-layout">
        {skills.map(group => (
          <div key={group.group} className="skill-group">
            <div className="skill-group-title">{group.group}</div>
            {group.items.map(item => (
              <SkillRow key={item.name} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
