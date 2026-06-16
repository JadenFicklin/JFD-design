import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { PiArrowBendDownRightFill } from 'react-icons/pi'

import FormNotice from '../components/FormNotice'
import { sendContactInquiry } from '../services/contact'
import { fetchProjects } from '../services/projects'
import heroImage from '../images/pexels-ivan-s-4458205.jpg'
import heroStepMeasurements from '../images/Measurements.jpg'
import heroStepPlans from '../images/drawn plans.jpg'
import heroStepBuilt from '../images/Project final.jpeg'

const heroProcessSteps = [
  {
    image: heroStepMeasurements,
    label: 'Site Measurements',
    alt: 'Hand-drawn site measurements and field notes',
  },
  {
    image: heroStepPlans,
    label: 'Plans & 3D Design',
    alt: 'Residential floor plans and Chief Architect design renderings',
  },
  {
    image: heroStepBuilt,
    label: 'Built Project',
    alt: 'Completed residential construction project',
  },
]

const contractorBenefits = [
  {
    title: 'Construction Experience',
    text: 'Approximately five years of residential construction and remodeling experience.',
  },
  {
    title: 'Contractor-Friendly Plans',
    text: 'Plans created with practical construction methods in mind.',
  },
  {
    title: 'Fast Turnaround',
    text: 'Helping projects stay on schedule.',
  },
  {
    title: 'Reliable Communication',
    text: 'Responsive and dependable throughout the project.',
  },
  {
    title: 'Chief Architect Expertise',
    text: 'Professional drafting, design, and visualization capabilities.',
  },
  {
    title: 'Long-Term Partner Mindset',
    text: 'Focused on building relationships with contractors who need dependable drafting support.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Project Review & Consultation',
    text: 'Meet over Zoom to discuss project goals, scope, timeline, and requirements. We review any available measurements, sketches, photos, inspiration images, or existing plans to establish a clear direction before drafting begins.',
  },
  {
    number: '02',
    title: 'Design & Drafting',
    text: 'Using the information gathered, I develop floor plans, layouts, elevations, and construction drawings tailored to your project. The focus is practical, buildable plans with a fast turnaround to help keep projects on schedule.',
  },
  {
    number: '03',
    title: 'Review & Revisions',
    text: 'We review the plans together over Zoom and discuss any requested changes. Feedback is incorporated efficiently to ensure the design aligns with your goals and project requirements.',
  },
  {
    number: '04',
    title: 'Final Plans & Ongoing Support',
    text: 'Receive finalized drawings ready for the next phase of your project. If additional revisions or adjustments are needed, ongoing support is available to help keep the project moving forward.',
  },
]

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

const PORTFOLIO_PREVIEW_LIMIT = 6

function Home() {
  const [form, setForm] = useState(() => ({ ...emptyForm }))
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  const closeNotice = () => setNotice(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)

    try {
      await sendContactInquiry(form)
      setForm({ ...emptyForm })
      setNotice({
        status: 'success',
        title: 'Inquiry sent',
        message:
          'Thanks for reaching out. Your message was sent successfully and I will follow up soon.',
      })
    } catch (error) {
      setNotice({
        status: 'error',
        title: 'Unable to send inquiry',
        message: error.message || 'Something went wrong. Please try again in a moment.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const previewProjects = projects.slice(0, PORTFOLIO_PREVIEW_LIMIT)

  return (
    <main id="top">
      <FormNotice
        open={Boolean(notice)}
        status={notice?.status}
        title={notice?.title}
        message={notice?.message}
        onClose={closeNotice}
      />

      <section className="hero" aria-labelledby="hero-heading">
        <img
          className="hero__image"
          src={heroImage}
          alt="Detailed architectural floor plan and residential drafting drawings"
        />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="eyebrow">JFD Design</p>
            <h1 id="hero-heading">
              Residential Drafting &amp; Design for Contractors and Homeowners
            </h1>
            <p className="hero__lead">
              Practical, buildable plans backed by real construction experience, helping
              residential projects move from concept to construction faster.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/#contact">
                Let's Connect
              </Link>
              <Link className="button button--hero" to="/#portfolio">
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="hero__process" aria-label="From site measurements to built project">
            <ol className="hero-process">
              {heroProcessSteps.map((step, index) => (
                <li
                  key={step.label}
                  className={`hero-process__step hero-process__step--${index + 1}`}
                >
                  <figure className={`hero-process__card hero-process__card--${index + 1}`}>
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading="eager"
                      decoding="sync"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />
                  </figure>
                </li>
              ))}
            </ol>
            <div className="hero-process__arrows" aria-hidden="true">
              <span className="hero-process__arrow hero-process__arrow--1">
                <PiArrowBendDownRightFill className="hero-process__arrow-icon" aria-hidden="true" />
              </span>
              <span className="hero-process__arrow hero-process__arrow--2">
                <PiArrowBendDownRightFill className="hero-process__arrow-icon" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <div className="section__header">
            <p className="eyebrow">Why Contractors Choose JFD Design</p>
            <h2>A drafting partner who understands the job site</h2>
            <p className="section__lead">
              Most drafting professionals understand drawings. I understand both the drawings and
              how projects are actually built, so your plans are practical, accurate, and
              ready for the field.
            </p>
          </div>
          <div className="benefits-grid">
            {contractorBenefits.map((item) => (
              <article className="benefit-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted" id="portfolio">
        <div className="container">
          <div className="section__header">
            <p className="eyebrow">Portfolio</p>
            <h2>Recent residential drafting and design work</h2>
            <p className="section__lead">
              Floor plans, remodels, additions, custom homes, and Chief Architect renderings.
              See the quality and clarity you can expect on your next project.
            </p>
          </div>

          {previewProjects.length > 0 ? (
            <div className="portfolio-grid portfolio-grid--preview">
              {previewProjects.map((project) => (
                <Link
                  className="portfolio-item portfolio-item--link"
                  key={project.id}
                  to={`/projects/${project.id}`}
                >
                  {project.coverImage ? (
                    <div className="portfolio-item__visual">
                      <img src={project.coverImage} alt={project.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="portfolio-item__blueprint" aria-hidden="true" />
                  )}
                  <div className="portfolio-item__body">
                    <h3>{project.title}</h3>
                    <p>{project.summary || project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="portfolio-empty">
              <p>Portfolio projects will appear here as they are published.</p>
            </div>
          )}

          <div className="portfolio__footer">
            <Link className="button button--ghost" to="/projects">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <div className="section__header">
            <p className="eyebrow">Process</p>
            <h2>Simple, predictable, and efficient</h2>
            <p className="section__lead">
              A straightforward process designed to minimize delays, maintain clear communication,
              and keep your project moving forward.
            </p>
          </div>
          <div className="steps steps--four">
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

      <section className="section section--contact" id="contact">
        <div className="container contact">
          <div className="contact__copy">
            <p className="eyebrow">Contact</p>
            <h2>Looking for a Reliable Drafting Partner?</h2>
            <p>
              I work with contractors, builders, and homeowners to create practical, buildable
              plans that help projects move forward efficiently.
            </p>
            <p>
              Whether you need support on a single project or you&apos;re looking for a long-term
              drafting resource, I&apos;d be happy to learn more about your project, answer
              questions, and discuss how I can help.
            </p>
            <p>
              Tell me about your project and I&apos;ll follow up to discuss next steps and determine
              if we&apos;re a good fit to work together.
            </p>
          </div>
          <form className="contact__form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name ?? ''}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email ?? ''}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                placeholder="(555) 123-4567"
                value={form.phone ?? ''}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                autoComplete="tel"
              />
            </label>
            <label>
              Project Details
              <textarea
                name="message"
                rows="4"
                placeholder="Project type, scope, location, timeline, and any details you'd like to share..."
                value={form.message ?? ''}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                required
              />
            </label>
            <button className="button button--primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : "Let's Connect"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Home
