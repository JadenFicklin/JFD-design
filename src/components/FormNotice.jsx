import { useEffect } from 'react'

function FormNotice({ open, status, title, message, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const isSuccess = status === 'success'

  return (
    <div
      className="form-notice"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="form-notice-title"
      aria-describedby="form-notice-message"
      onClick={onClose}
    >
      <div className="form-notice__panel" onClick={(event) => event.stopPropagation()}>
        <p className="form-notice__eyebrow">JFD Design</p>
        <div className={`form-notice__icon${isSuccess ? ' form-notice__icon--success' : ' form-notice__icon--error'}`}>
          {isSuccess ? '✓' : '!'}
        </div>
        <h2 id="form-notice-title">{title}</h2>
        <p id="form-notice-message">{message}</p>
        <button className="button button--primary form-notice__button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default FormNotice
