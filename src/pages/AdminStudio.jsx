import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from '../services/projects'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../utils/authErrors'
import './AdminStudio.css'

const emptyDraft = {
  title: '',
  summary: '',
  description: '',
  images: [],
}

function ImageFields({ items, onChange, onRemove }) {
  return (
    <div className="admin-images">
      {items.map((item, index) => (
        <div className="admin-image-row" key={item.key}>
          <div className="admin-image-row__preview">
            {item.file ? <img src={item.preview} alt="" /> : <span>Existing image</span>}
          </div>
          <label>
            Caption
            <input
              type="text"
              value={item.caption}
              onChange={(event) => onChange(index, 'caption', event.target.value)}
              placeholder="What this drawing or photo shows"
            />
          </label>
          <label>
            Alt text
            <input
              type="text"
              value={item.alt}
              onChange={(event) => onChange(index, 'alt', event.target.value)}
              placeholder="Short image description"
            />
          </label>
          {!item.existing ? (
            <label className="admin-file-label">
              Image file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => onChange(index, 'file', event.target.files?.[0] || null)}
              />
            </label>
          ) : null}
          <button className="admin-button admin-button--danger" type="button" onClick={() => onRemove(index)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

function AdminStudio() {
  const { isAuthenticated, authLoading, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [draft, setDraft] = useState(emptyDraft)
  const [imageItems, setImageItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)

    return () => {
      document.head.removeChild(robots)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    fetchProjects()
      .then(setProjects)
      .catch((error) => setFormError(error.message))
  }, [isAuthenticated])

  const resetForm = () => {
    setDraft(emptyDraft)
    setImageItems([])
    setEditingId(null)
    setFormError('')
    setFormMessage('')
  }

  const addImageRow = () => {
    setImageItems((current) => [
      ...current,
      {
        key: `${Date.now()}-${current.length}`,
        caption: '',
        alt: '',
        file: null,
        preview: '',
        existing: false,
      },
    ])
  }

  const addImageFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((file) =>
      /^image\/(jpeg|png|webp|gif)$/.test(file.type),
    )

    if (!files.length) return

    setImageItems((current) => [
      ...current,
      ...files.map((file, index) => ({
        key: `${Date.now()}-${current.length + index}`,
        caption: '',
        alt: '',
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      })),
    ])
  }

  const updateImageRow = (index, field, value) => {
    setImageItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item

        if (field === 'file') {
          return {
            ...item,
            file: value,
            preview: value ? URL.createObjectURL(value) : '',
          }
        }

        return { ...item, [field]: value }
      }),
    )
  }

  const removeImageRow = (index) => {
    setImageItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      await login(email, password)
      setPassword('')
    } catch (error) {
      setLoginError(getAuthErrorMessage(error))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    setFormMessage('')

    try {
      const uploadItems = imageItems.filter((item) => item.file)

      if (editingId) {
        await updateProject(editingId, {
          title: draft.title,
          summary: draft.summary,
          description: draft.description,
          imageUploads: uploadItems.map((item) => ({
            file: item.file,
            caption: item.caption,
            alt: item.alt,
          })),
          existingImages: draft.images,
        })
        setFormMessage('Project updated.')
      } else {
        if (!uploadItems.length) {
          throw new Error('Add at least one image for a new project.')
        }

        await createProject({
          title: draft.title,
          summary: draft.summary,
          description: draft.description,
          imageUploads: uploadItems.map((item) => ({
            file: item.file,
            caption: item.caption,
            alt: item.alt,
          })),
        })
        setFormMessage('Project published.')
      }

      const nextProjects = await fetchProjects()
      setProjects(nextProjects)
      resetForm()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (project) => {
    setEditingId(project.id)
    setDraft({
      title: project.title,
      summary: project.summary,
      description: project.description,
      images: project.images,
    })
    setImageItems([])
    setFormError('')
    setFormMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project permanently?')) return

    try {
      await deleteProject(projectId)
      setProjects((current) => current.filter((project) => project.id !== projectId))
      if (editingId === projectId) resetForm()
    } catch (error) {
      setFormError(error.message)
    }
  }

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <p>Checking sign-in status...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <p className="eyebrow">Private studio</p>
          <h1>Sign in</h1>
          <p className="admin-login__lead">
            Use the email and password from your Firebase Authentication account.
          </p>
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {loginError ? <p className="admin-error">{loginError}</p> : null}
            <button className="admin-button admin-button--primary" type="submit" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <Link className="admin-back-link" to="/">
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">JFD Design studio</p>
          <h1>Manage projects</h1>
        </div>
        <div className="admin-header__actions">
          <Link className="admin-button" to="/projects">
            View public page
          </Link>
          <button className="admin-button admin-button--ghost" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <section className="admin-panel">
          <h2>{editingId ? 'Edit project' : 'Publish a project'}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Project title
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                required
              />
            </label>
            <label>
              Short summary
              <input
                type="text"
                value={draft.summary}
                onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                placeholder="Shown on the projects grid"
              />
            </label>
            <label>
              Main project information
              <textarea
                rows="6"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                placeholder="Overview, scope, notes, and context for this project"
              />
            </label>

            <div className="admin-form__images">
              <div className="admin-form__images-head">
                <h3>Project images</h3>
                <p className="admin-form__images-help">
                  Upload multiple images at once, or add them individually.
                </p>
              </div>

              <label className="admin-bulk-upload">
                <span className="admin-bulk-upload__title">Choose images</span>
                <span className="admin-bulk-upload__hint">
                  Select one or more files (JPEG, PNG, WebP, GIF)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(event) => {
                    addImageFiles(event.target.files)
                    event.target.value = ''
                  }}
                />
              </label>

              {imageItems.length > 0 ? (
                <p className="admin-form__images-count">
                  {imageItems.filter((item) => item.file).length} image
                  {imageItems.filter((item) => item.file).length === 1 ? '' : 's'} ready to upload
                </p>
              ) : null}

              <div className="admin-form__images-actions">
                <button className="admin-button" type="button" onClick={addImageRow}>
                  Add another image slot
                </button>
              </div>
              {editingId && draft.images.length ? (
                <div className="admin-existing-images">
                  <p>Existing images on this project:</p>
                  <ul>
                    {draft.images.map((image) => (
                      <li key={image.id}>
                        <img src={image.url} alt={image.alt || draft.title} />
                        {image.caption ? <span>{image.caption}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <ImageFields items={imageItems} onChange={updateImageRow} onRemove={removeImageRow} />
            </div>

            {formError ? <p className="admin-error">{formError}</p> : null}
            {formMessage ? <p className="admin-message">{formMessage}</p> : null}

            <div className="admin-form__actions">
              <button className="admin-button admin-button--primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Publish project'}
              </button>
              {editingId ? (
                <button className="admin-button admin-button--ghost" type="button" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <h2>Published projects</h2>
          {projects.length === 0 ? <p>No projects published yet.</p> : null}
          <div className="admin-project-list">
            {projects.map((project) => (
              <article className="admin-project-item" key={project.id}>
                {project.coverImage ? <img src={project.coverImage} alt={project.title} /> : null}
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.summary || project.description}</p>
                  <div className="admin-project-item__actions">
                    <button className="admin-button" type="button" onClick={() => startEdit(project)}>
                      Edit
                    </button>
                    <Link className="admin-button" to={`/projects/${project.id}`}>
                      View
                    </Link>
                    <button
                      className="admin-button admin-button--danger"
                      type="button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminStudio
