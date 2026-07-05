import { useState } from 'react'

export default function ProjectScreen({ project, onBack }) {
  const [showCode, setShowCode] = useState(false)
  if (!project) return null

  return (
    <div className="screen">
      <div className="screen-topbar">
        <button className="back-btn" onClick={onBack}>← BACK</button>
        <span className="screen-title">{project.name}</span>
        <span className="proj-tags">
          {project.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </span>
      </div>

      <div className="proj-scroll">
        <div className="proj-grid">
          {/* LEFT: video hero + role */}
          <div className="proj-left">
            <div className="proj-video">
              <div className="video-placeholder">[ VIDEO PLACEHOLDER ]</div>
            </div>
            {project.role && (
              <div className="proj-role">
                <div className="proj-role-label">MY ROLE</div>
                <p>{project.role}</p>
              </div>
            )}
            <div className="proj-links">
              {project.itch && (
                <a className="proj-link" href={project.itch} target="_blank" rel="noreferrer">🎮 ITCH.IO</a>
              )}
              {project.github && project.github !== '#' && (
                <a className="proj-link" href={project.github} target="_blank" rel="noreferrer">⌥ GITHUB</a>
              )}
            </div>
          </div>

          {/* RIGHT: text content */}
          <div className="proj-right">
            <div className="proj-section-title">— {project.section} —</div>
            <p className="proj-body">{project.description}</p>

            {project.systems && project.systems.length > 0 && (
              <>
                <div className="proj-section-title mt">— KEY SYSTEMS I BUILT —</div>
                <div className="systems-grid">
                  {project.systems.map(sys => (
                    <div key={sys.name} className="system-card">
                      <div className="system-name">{sys.name}</div>
                      <div className="system-desc">{sys.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="proj-section-title mt">— THE JOURNEY —</div>
            <p className="proj-body">{project.journey}</p>

            {project.code && (
              <div className="under-hood">
                <button
                  className="under-hood-toggle"
                  onClick={() => setShowCode(v => !v)}
                >
                  {showCode ? '▾' : '▸'} UNDER THE HOOD
                </button>
                {showCode && (
                  <div className="under-hood-body">
                    <p className="code-caption">{project.code.caption}</p>
                    <pre className="code-block"><code>{project.code.snippet}</code></pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
