import { useEffect } from 'react'

export default function Boot({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="boot">
      <div className="boot-logo">ROBERTO SCIALPI</div>
      <div className="boot-sub">G A M E &nbsp; D E V E L O P E R</div>
      <div className="boot-bar-frame">
        <div className="boot-bar-fill" />
      </div>
      <div className="boot-label">LOADING SAVE DATA</div>
    </div>
  )
}
