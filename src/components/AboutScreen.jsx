export default function AboutScreen({ onBack }) {
  return (
    <div className="screen">
      <div className="screen-topbar">
        <button className="back-btn" onClick={onBack}>← BACK</button>
        <span className="screen-title">ABOUT</span>
        <span />
      </div>
      <div className="about-layout">
        <div className="about-left">
          <div className="avatar-large" />
          <div className="avatar-name">ROBERTO SCIALPI</div>
          <div className="avatar-tag">GAME DEVELOPER</div>
          <div className="avatar-location">📍 LONDON, UK</div>
        </div>
        <div className="about-right">
          <div className="about-block">
            <div className="about-block-title">— PROFILE —</div>
            <p>First Class Honours graduate in Games Design & Development from the University of Greenwich (2026). Originally from Puglia, Italy, with 12 years in London. Background as a professional chef before transitioning into games technology — bringing the same attention to craft and detail from the kitchen to the engine.</p>
          </div>
          <div className="about-block">
            <div className="about-block-title">— CURRENT ROLE —</div>
            <p>Research Assistant on a stationary VR environment project for Meta Quest 3. Building multilingual hazard training applications using a data-driven ScriptableObject system designed for construction trainees.</p>
          </div>
          <div className="about-block">
            <div className="about-block-title">— INTERESTS —</div>
            <p>AI consciousness & NPC architecture · XR simulation · EEG-based BCI research · Procedural systems · Mediterranean cooking</p>
          </div>
        </div>
      </div>
    </div>
  )
}
