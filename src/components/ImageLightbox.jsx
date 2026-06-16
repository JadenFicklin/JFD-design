import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function NavButton({ direction, onClick, label }) {
  return (
    <button
      className={`lightbox__nav lightbox__nav--${direction}`}
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {direction === 'prev' ? (
          <path d="M14.5 5.5 9 12l5.5 6.5" />
        ) : (
          <path d="M9.5 5.5 15 12l-5.5 6.5" />
        )}
      </svg>
    </button>
  )
}

function ImageLightbox({ images, activeIndex, onClose, onChange, projectTitle }) {
  const current = images[activeIndex]
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const goPrevious = useCallback(() => {
    onChange((activeIndex - 1 + images.length) % images.length)
  }, [activeIndex, images.length, onChange])

  const goNext = useCallback(() => {
    onChange((activeIndex + 1) % images.length)
  }, [activeIndex, images.length, onChange])

  const changeZoom = useCallback((nextZoom) => {
    setZoom((currentZoom) => {
      const target = typeof nextZoom === 'function' ? nextZoom(currentZoom) : nextZoom
      const clamped = clamp(Number(target.toFixed(2)), MIN_ZOOM, MAX_ZOOM)

      if (clamped <= MIN_ZOOM) {
        setPan({ x: 0, y: 0 })
      }

      return clamped
    })
  }, [])

  useEffect(() => {
    resetView()
  }, [activeIndex, resetView])

  useEffect(() => {
    if (activeIndex === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrevious()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === '+' || event.key === '=') changeZoom((value) => value + ZOOM_STEP)
      if (event.key === '-') changeZoom((value) => value - ZOOM_STEP)
      if (event.key === '0') resetView()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, changeZoom, goNext, goPrevious, onClose, resetView])

  const handleWheel = (event) => {
    event.preventDefault()
    const direction = event.deltaY > 0 ? -1 : 1
    changeZoom((value) => value + direction * ZOOM_STEP)
  }

  const handlePointerDown = (event) => {
    if (zoom <= 1) return

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      pointerId: event.pointerId,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY

    setPan({
      x: dragRef.current.originX + deltaX,
      y: dragRef.current.originY + deltaY,
    })
  }

  const handlePointerUp = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return

    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetView()
      return
    }

    changeZoom(2)
  }

  if (activeIndex === null || !current) return null

  const zoomPercent = Math.round(zoom * 100)

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} image gallery`}
      onClick={onClose}
    >
      <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox__toolbar">
          <p className="lightbox__counter">
            {activeIndex + 1} / {images.length}
          </p>

          <div className="lightbox__zoom-controls">
            <button
              className="lightbox__tool-button"
              type="button"
              onClick={() => changeZoom(zoom - ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="lightbox__zoom-label">{zoomPercent}%</span>
            <button
              className="lightbox__tool-button"
              type="button"
              onClick={() => changeZoom(zoom + ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              className="lightbox__tool-button lightbox__tool-button--text"
              type="button"
              onClick={resetView}
              disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
            >
              Reset
            </button>
          </div>

          <button className="lightbox__close" type="button" onClick={onClose} aria-label="Close gallery">
            Close
          </button>
        </div>

        <div className="lightbox__stage">
          {images.length > 1 ? (
            <NavButton direction="prev" onClick={goPrevious} label="Previous image" />
          ) : null}

          <figure className="lightbox__figure">
            <div
              ref={viewportRef}
              className={`lightbox__viewport${zoom > 1 ? ' lightbox__viewport--zoomed' : ''}`}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src={current.url}
                alt={current.alt || projectTitle}
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              />
            </div>
            {current.caption ? <figcaption>{current.caption}</figcaption> : null}
          </figure>

          {images.length > 1 ? (
            <NavButton direction="next" onClick={goNext} label="Next image" />
          ) : null}
        </div>

        <div className="lightbox__footer">
          <p className="lightbox__hint">
            Scroll or use + / − to zoom. Double-click to zoom in or reset. Drag to pan when zoomed.
          </p>

          {images.length > 1 ? (
            <div className="lightbox__thumbs" aria-label="Gallery thumbnails">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`lightbox__thumb${index === activeIndex ? ' lightbox__thumb--active' : ''}`}
                  onClick={() => onChange(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                >
                  <img src={image.url} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
