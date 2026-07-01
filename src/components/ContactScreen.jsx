const links = [
  { icon: '✉', label: 'EMAIL', value: 'roberto.scialpi.92@gmail.com', href: 'mailto:roberto.scialpi.92@gmail.com' },
  { icon: 'in', label: 'LINKEDIN', value: 'linkedin.com/in/roberto-scialpi', href: 'https://www.linkedin.com/in/roberto-scialpi/' },
  { icon: '⌥', label: 'GITHUB', value: 'github.com/DarkBoB92', href: 'https://github.com/DarkBoB92' },
]

export default function ContactScreen({ onBack }) {
  return (
    <div className="screen">
      <div className="screen-topbar">
        <button className="back-btn" onClick={onBack}>← BACK</button>
        <span className="screen-title">CONTACT</span>
        <span />
      </div>
      <div className="contact-layout">
        <div className="contact-intro">READY TO CONNECT?</div>
        <div className="contact-sub">Select a channel to establish connection</div>
        <div className="contact-links">
          {links.map(({ icon, label, value, href }) => (
            <a key={label} className="contact-link" href={href} target="_blank" rel="noreferrer">
              <div className="contact-link-icon">{icon}</div>
              <div className="contact-link-info">
                <div className="contact-link-label">{label}</div>
                <div className="contact-link-value">{value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
