import './App.css'

const services = [
  {
    title: 'New Home Plans',
    description:
      'Complete floor plans, elevations, and construction drawings tailored to your lot and lifestyle.',
  },
  {
    title: 'Renovations & Additions',
    description:
      'Accurate as-built documentation and permit-ready drawings for remodels, extensions, and garage conversions.',
  },
  {
    title: 'Permit Submissions',
    description:
      'Code-compliant drawings formatted for local building departments, including revisions when needed.',
  },
]

const steps = [
  { number: '01', title: 'Consultation', text: 'We review your project goals, site conditions, and timeline.' },
  { number: '02', title: 'Drafting', text: 'Detailed plans are prepared with clear dimensions and notes.' },
  { number: '03', title: 'Review', text: 'You receive drafts for feedback before final permit-ready files.' },
]

function App() {
  return (
    <div className="site">
      <header className="header">
        <div className="container header__inner">
          <a className="logo" href="#top">
            <span className="logo__mark" aria-hidden="true">JFD</span>
            <span>
              JFD <strong>Design</strong>
            </span>
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a href="#contact" className="nav__cta">
              Get a Quote
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <p className="eyebrow">JFD Design</p>
              <h1>Clear, permit-ready drafting for homes you can build with confidence.</h1>
              <p className="hero__lead">
                From custom new builds to renovations and additions, we deliver accurate
                residential drawings that help homeowners, builders, and designers move
                projects forward.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#contact">
                  Request a Quote
                </a>
                <a className="button button--ghost" href="#services">
                  View Services
                </a>
              </div>
            </div>

            <div className="hero__panel" aria-hidden="true">
              <div className="blueprint">
                <div className="blueprint__grid" />
                <div className="blueprint__room blueprint__room--living" />
                <div className="blueprint__room blueprint__room--kitchen" />
                <div className="blueprint__room blueprint__room--bed" />
                <div className="blueprint__dimension blueprint__dimension--h" />
                <div className="blueprint__dimension blueprint__dimension--v" />
              </div>
              <p className="hero__panel-caption">JFD Design floor plan drafting</p>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section__header">
              <p className="eyebrow">What we do</p>
              <h2>Services built around your residential project</h2>
            </div>
            <div className="cards">
              {services.map((service) => (
                <article className="card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--muted" id="process">
          <div className="container">
            <div className="section__header">
              <p className="eyebrow">How it works</p>
              <h2>A straightforward drafting process</h2>
            </div>
            <div className="steps">
              {steps.map((step) => (
                <article className="step" key={step.number}>
                  <span className="step__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container about">
            <div>
              <p className="eyebrow">About</p>
              <h2>Design with attention to detail</h2>
              <p>
                JFD Design specializes in residential construction documents that are easy to read,
                dimensionally accurate, and prepared with permitting in mind. Whether you are
                planning a single-family home, a duplex, or a backyard suite, our drawings
                help reduce delays and keep your project on track.
              </p>
            </div>
            <ul className="about__list">
              <li>Site plans, floor plans, and roof plans</li>
              <li>Elevations, sections, and construction details</li>
              <li>Revisions and coordination with your designer or builder</li>
              <li>Digital deliverables in PDF and CAD-friendly formats</li>
            </ul>
          </div>
        </section>

        <section className="section section--contact" id="contact">
          <div className="container contact">
            <div className="contact__copy">
              <p className="eyebrow">Contact</p>
              <h2>Ready to start your project with JFD Design?</h2>
              <p>
                Tell us about your lot, project scope, and target timeline. We will follow up
                with a quote and next steps.
              </p>
            </div>
            <form className="contact__form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" />
              </label>
              <label>
                Project details
                <textarea
                  name="message"
                  rows="4"
                  placeholder="New build, renovation, square footage, location..."
                />
              </label>
              <button className="button button--primary" type="submit">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>&copy; {new Date().getFullYear()} JFD Design. All rights reserved.</p>
          <p>Professional residential design and drafting.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
