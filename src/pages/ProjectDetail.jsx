import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProject } from '../services/projects'
import ImageLightbox from '../components/ImageLightbox'

function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  useEffect(() => {
    fetchProject(id)
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setActiveImageIndex(null)
  }, [id])

  if (loading) {
    return (
      <main className="projects-page">
        <section className="section">
          <div className="container">
            <p>Loading project...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="projects-page">
        <section className="section">
          <div className="container projects-empty">
            <h2>Project not found</h2>
            <p>{error || 'This project may have been removed.'}</p>
            <Link className="button button--ghost" to="/projects">
              Back to projects
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="projects-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div>
            <p className="eyebrow">Project</p>
            <h1>{project.title}</h1>
            {project.summary ? <p className="page-hero__lead">{project.summary}</p> : null}
          </div>
          <Link className="button button--ghost" to="/projects">
            All projects
          </Link>
        </div>
      </section>

      <section className="section project-detail">
        <div className="container project-detail__content">
          {project.description ? (
            <div className="project-detail__intro">
              <h2>About this project</h2>
              <p>{project.description}</p>
            </div>
          ) : null}

          {project.images.length > 0 ? (
            <div className="project-detail__gallery">
              {project.images.map((image, index) => (
                <figure className="project-detail__figure" key={image.id}>
                  <button
                    type="button"
                    className="project-detail__image-button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Open image ${index + 1} of ${project.images.length}`}
                  >
                    <img src={image.url} alt={image.alt || project.title} loading="lazy" />
                    <span className="project-detail__zoom-hint">Click to enlarge</span>
                  </button>
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : (
            <div className="projects-empty">
              <p>No images have been added to this project yet.</p>
            </div>
          )}

          <div className="project-detail__cta">
            <h2>Interested in a similar project?</h2>
            <p>Reach out through the contact form and share your scope, timeline, and goals.</p>
            <Link className="button button--primary" to="/#contact">
              Contact JFD Design
            </Link>
          </div>
        </div>
      </section>

      <ImageLightbox
        images={project.images}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onChange={setActiveImageIndex}
        projectTitle={project.title}
      />
    </main>
  )
}

export default ProjectDetail
