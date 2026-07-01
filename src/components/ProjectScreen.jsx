export default function ProjectScreen({ project, onBack }) {
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

      <div className="proj-layout">
        <div className="proj-video">
          <div className="video-placeholder">[ VIDEO PLACEHOLDER ]</div>
        </div>
        <div className="proj-info">
          <div className="proj-section-title">— {project.section} —</div>
          <p>{project.description}</p>
          <div className="proj-section-title" style={{ marginTop: '20px' }}>— THE JOURNEY —</div>
          <p>{project.journey}</p>
          <div className="proj-links">
            {project.itch && (
              <a className="proj-link" href={project.itch} target="_blank" rel="noreferrer">
                🎮 ITCH.IO
              </a>
            )}
            {project.github && project.github !== '#' && (
              <a className="proj-link" href={project.github} target="_blank" rel="noreferrer">
                ⌥ GITHUB
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
