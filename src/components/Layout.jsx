import { Link, Outlet } from 'react-router-dom'
import { ADMIN_PATH } from '../config/admin'
import ScrollToHash from './ScrollToHash'

function Layout() {
  return (
    <div className="site">
      <ScrollToHash />
      <header className="header">
        <div className="container header__inner">
          <Link className="logo" to="/#top">
            <span className="logo__mark" aria-hidden="true">
              JFD
            </span>
            <span>
              <strong>Design</strong>
            </span>
          </Link>
          <nav className="nav" aria-label="Main navigation">
            <Link to="/#why">Why JFD Design</Link>
            <Link to="/#portfolio">Portfolio</Link>
            <Link to="/#process">Process</Link>
            <Link to="/#contact" className="nav__cta">
              <span className="nav__cta-label nav__cta-label--long">Let's Connect</span>
              <span className="nav__cta-label nav__cta-label--short">Connect</span>
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Link className="logo footer__logo" to="/#top">
              <span className="logo__mark" aria-hidden="true">
                JFD
              </span>
              <span>
                <strong>Design</strong>
              </span>
            </Link>
            <p>
              Residential drafting and design partner for contractors, builders, and homeowners.
              Practical plans backed by real construction experience.
            </p>
          </div>
          <div className="footer__links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/#why">Why JFD Design</Link>
              </li>
              <li>
                <Link to="/#portfolio">Portfolio</Link>
              </li>
              <li>
                <Link to="/#process">Process</Link>
              </li>
              <li>
                <Link to="/#contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>&copy; {new Date().getFullYear()} JFD Design by Jaden Ficklin. All rights reserved.</p>
          <Link className="footer__studio-link" to={ADMIN_PATH}>
            Studio
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Layout
