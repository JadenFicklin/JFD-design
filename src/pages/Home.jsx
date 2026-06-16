import { useState } from 'react'

import { Link } from 'react-router-dom'

import FormNotice from '../components/FormNotice'

import { sendContactInquiry } from '../services/contact'

import heroImage from '../images/pexels-ivan-s-4458205.jpg'



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



const emptyForm = {

  name: '',

  email: '',

  phone: '',

  message: '',

}



function Home() {

  const [form, setForm] = useState(() => ({ ...emptyForm }))

  const [submitting, setSubmitting] = useState(false)

  const [notice, setNotice] = useState(null)



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

          'Thanks for reaching out to JFD Design. Your message was sent successfully and we will follow up soon.',

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



  return (

    <main id="top">

      <FormNotice

        open={Boolean(notice)}

        status={notice?.status}

        title={notice?.title}

        message={notice?.message}

        onClose={closeNotice}

      />



      <section className="hero">

        <img

          className="hero__image"

          src={heroImage}

          alt="Detailed architectural floor plan and residential drafting drawings"

        />

        <div className="hero__overlay" aria-hidden="true" />

        <div className="container hero__content">

          <p className="eyebrow">JFD Design</p>

          <h1>Clear, permit-ready drafting for homes you can build with confidence.</h1>

          <p className="hero__lead">

            From custom new builds to renovations and additions, we deliver accurate

            residential drawings that help homeowners, builders, and designers move

            projects forward.

          </p>

          <div className="hero__actions">

            <Link className="button button--primary" to="/#contact">

              Request a Quote

            </Link>

            <Link className="button button--hero" to="/projects">

              View Projects

            </Link>

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

              Project details

              <textarea

                name="message"

                rows="4"

                placeholder="New build, renovation, square footage, location..."

                value={form.message ?? ''}

                onChange={(event) => setForm({ ...form, message: event.target.value })}

                required

              />

            </label>

            <button className="button button--primary" type="submit" disabled={submitting}>

              {submitting ? 'Sending...' : 'Send Inquiry'}

            </button>

          </form>

        </div>

      </section>

    </main>

  )

}



export default Home

