import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../services/projects'

function Projects() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="projects-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1>Residential drafting and design projects</h1>
            <p className="page-hero__lead">
              Floor plans, remodels, additions, and custom homes. See the quality and clarity
              contractors and builders can expect on their next project.
            </p>
          </div>
          <Link className="button button--primary" to="/#contact">
            Let's Connect
          </Link>
        </div>
      </section>

      <section className="section projects-section">
        <div className="container">
          {loading ? <p>Loading projects...</p> : null}
          {error ? <div className="projects-empty"><p>{error}</p></div> : null}

          {!loading && !error && projects.length === 0 ? (
            <div className="projects-empty">
              <h2>No projects posted yet</h2>
              <p>New portfolio work will appear here once it is published.</p>
              <Link className="button button--ghost" to="/#contact">
                Contact JFD Design
              </Link>
            </div>
          ) : null}

          {!loading && !error && projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project) => (
                <Link className="project-card project-card--link" key={project.id} to={`/projects/${project.id}`}>
                  {project.coverImage ? (
                    <div className="project-card__visual">
                      <img src={project.coverImage} alt={project.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="project-card__visual project-card__visual--empty" aria-hidden="true" />
                  )}
                  <div className="project-card__body">
                    <h2>{project.title}</h2>
                    <p>{project.summary || project.description}</p>
                    <span className="project-card__link-text">View project</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default Projects
