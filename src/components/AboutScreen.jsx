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
          <div className="avatar-large">
            <img
              src={import.meta.env.BASE_URL + 'images/profile-avatar.jpg'}
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <div className="avatar-name">ROBERTO SCIALPI</div>
          <div className="avatar-tag">GAME PROGRAMMER</div>
          <div className="avatar-location">📍 LONDON, UK</div>
        </div>
        <div className="about-right">
          <div className="about-block">
            <div className="about-block-title">— PROFILE —</div>
            <p>Game Programmer based in London, graduating with First Class Honours from the University of Greenwich in Games Design & Development, specialising in Games Programming. I design and program core gameplay mechanics and systems across genres and engines, from companion AI and puzzle logic in Unreal, to networked multiplayer in Unity, extending into XR-based training research on Meta Quest 3 for my dissertation.</p>
          </div>
          <div className="about-block">
            <div className="about-block-title">— BACKGROUND —</div>
            <p>Originally from Puglia, Italy, and in London for over a decade. Before programming, I spent more than ten years in professional kitchens as a chef, learning to lead under pressure, coordinate a team through constantly shifting conditions, and deliver consistently when timing is everything. The same instincts for systems, pacing and craft now carry into how I build games.</p>
          </div>
          <div className="about-block">
            <div className="about-block-title">— CURRENT ROLE —</div>
            <p>Research Assistant at the University of Greenwich, developing a stationary VR hazard training environment for Meta Quest 3, extending my dissertation research on XR-based skill acquisition into an applied training tool.</p>
          </div>
          <div className="about-block">
            <div className="about-block-title">— RECOGNITION —</div>
            <p>Named in the BIMA 100 Class of 2026 (Student Category) by the British Interactive Media Association, for work shaping the UK's digital industry. University projects nominated for Best Project honours at the Greenwich Shark Expo every year of study, across both individual and team work. Awarded the University of Greenwich's Making a Difference Award (2026, School of Computing and Mathematical Sciences) for support to the Games Development programme through outreach, events, and student representation.</p>
         </div>
       </div>
     </div>
   </div>
  )
}
