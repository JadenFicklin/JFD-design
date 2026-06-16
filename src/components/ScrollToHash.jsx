import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      if (pathname === '/projects') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const id = hash.replace('#', '')

    const scrollToTarget = () => {
      const element = document.getElementById(id)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }

      return false
    }

    if (!scrollToTarget()) {
      requestAnimationFrame(scrollToTarget)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToHash
