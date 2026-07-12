import { useState, useEffect, useRef } from 'react'

const AUTO_ADVANCE_MS = 6000

export default function ImageGallery({ images }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  // Restart the auto-advance timer — called on mount and after any manual navigation,
  // so clicking an arrow doesn't fight with an auto-advance that's about to fire.
  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (images.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length)
    }, AUTO_ADVANCE_MS)
  }

  useEffect(() => {
    restartTimer()
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  const goTo = (i) => {
    setIndex(((i % images.length) + images.length) % images.length)
    restartTimer()
  }

  const current = images[index]

  return (
    <div className="img-gallery">
      <div className="img-gallery-stage">
        {images.map((img, i) => (
          <img
            key={img.src}
            src={import.meta.env.BASE_URL + img.src}
            alt={img.caption || ''}
            className={`img-gallery-slide${i === index ? ' active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        {images.length > 1 && (
          <>
            <button
              className="img-gallery-arrow left"
              aria-label="Previous image"
              onClick={() => goTo(index - 1)}
            >‹</button>
            <button
              className="img-gallery-arrow right"
              aria-label="Next image"
              onClick={() => goTo(index + 1)}
            >›</button>
          </>
        )}
      </div>

      {current.caption && <p className="img-gallery-caption">{current.caption}</p>}

      {images.length > 1 && (
        <div className="img-gallery-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={i === index ? 'active' : ''}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
