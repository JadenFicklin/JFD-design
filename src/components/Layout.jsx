import { Link, NavLink, Outlet } from 'react-router-dom'
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
            <NavLink to="/projects">Projects</NavLink>
            <Link to="/#services">Services</Link>
            <Link to="/#process">Process</Link>
            <Link to="/#about">About</Link>
            <Link to="/#contact" className="nav__cta">
              <span className="nav__cta-label nav__cta-label--long">Get a Quote</span>
              <span className="nav__cta-label nav__cta-label--short">Quote</span>
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="container footer__inner">
          <p>&copy; {new Date().getFullYear()} JFD Design. All rights reserved.</p>
          <p>
            Professional residential design and drafting.{' '}
            <Link className="footer__studio-link" to={ADMIN_PATH}>
              Studio
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
