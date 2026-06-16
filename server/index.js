import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { createId, getUploadsDir, readProjects, writeProjects } from './storage.js'
import { isMailConfigured, sendContactEmail } from './mail.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3001
const uploadsDir = getUploadsDir()

await fs.mkdir(uploadsDir, { recursive: true })

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${createId()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error('Only image uploads are allowed.'))
  },
})

function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Authentication required.' })
    return
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' })
  }
}

function parseImageMeta(rawValue) {
  if (!rawValue) return []

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

app.post('/api/contact', async (req, res) => {
  if (!isMailConfigured()) {
    res.status(503).json({
      error: 'Contact form email is not configured on the server yet.',
    })
    return
  }

  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim()
  const message = String(req.body?.message || '').trim()

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and project details are required.' })
    return
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' })
    return
  }

  if (name.length > 120 || email.length > 254 || message.length > 5000) {
    res.status(400).json({ error: 'One or more fields are too long.' })
    return
  }

  try {
    await sendContactEmail({ name, email, message })
    res.json({ ok: true })
  } catch (error) {
    console.error('Contact form email failed:', error)
    res.status(500).json({ error: 'Unable to send your inquiry right now. Please try again shortly.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' })
    return
  }

  const validUser =
    username === process.env.ADMIN_USERNAME &&
    bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH || '')

  if (!validUser) {
    res.status(401).json({ error: 'Invalid credentials.' })
    return
  }

  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  })

  res.json({ token })
})

app.get('/api/projects', async (_req, res) => {
  const projects = await readProjects()
  res.json(projects)
})

app.get('/api/projects/:id', async (req, res) => {
  const projects = await readProjects()
  const project = projects.find((item) => item.id === req.params.id)

  if (!project) {
    res.status(404).json({ error: 'Project not found.' })
    return
  }

  res.json(project)
})

app.post('/api/projects', authRequired, upload.array('images', 12), async (req, res) => {
  try {
    const { title, summary, description } = req.body
    const imageMeta = parseImageMeta(req.body.imageMeta)

    if (!title?.trim()) {
      res.status(400).json({ error: 'Project title is required.' })
      return
    }

    const images = (req.files || []).map((file, index) => {
      const meta = imageMeta[index] || {}
      return {
        id: createId(),
        url: `/uploads/${file.filename}`,
        caption: meta.caption?.trim() || '',
        alt: meta.alt?.trim() || title.trim(),
      }
    })

    const project = {
      id: createId(),
      title: title.trim(),
      summary: summary?.trim() || '',
      description: description?.trim() || '',
      images,
      coverImage: images[0]?.url || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const projects = await readProjects()
    projects.unshift(project)
    await writeProjects(projects)

    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create project.' })
  }
})

app.put('/api/projects/:id', authRequired, upload.array('images', 12), async (req, res) => {
  try {
    const projects = await readProjects()
    const index = projects.findIndex((item) => item.id === req.params.id)

    if (index === -1) {
      res.status(404).json({ error: 'Project not found.' })
      return
    }

    const current = projects[index]
    const imageMeta = parseImageMeta(req.body.imageMeta)
    const newImages = (req.files || []).map((file, fileIndex) => {
      const meta = imageMeta[fileIndex] || {}
      return {
        id: createId(),
        url: `/uploads/${file.filename}`,
        caption: meta.caption?.trim() || '',
        alt: meta.alt?.trim() || req.body.title?.trim() || current.title,
      }
    })

    const updated = {
      ...current,
      title: req.body.title?.trim() || current.title,
      summary: req.body.summary?.trim() ?? current.summary,
      description: req.body.description?.trim() ?? current.description,
      images: [...current.images, ...newImages],
      coverImage: current.coverImage || newImages[0]?.url || current.images[0]?.url || '',
      updatedAt: new Date().toISOString(),
    }

    projects[index] = updated
    await writeProjects(projects)
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update project.' })
  }
})

app.delete('/api/projects/:id', authRequired, async (req, res) => {
  const projects = await readProjects()
  const index = projects.findIndex((item) => item.id === req.params.id)

  if (index === -1) {
    res.status(404).json({ error: 'Project not found.' })
    return
  }

  const [removed] = projects.splice(index, 1)

  await Promise.all(
    removed.images.map(async (image) => {
      const filename = path.basename(image.url)
      try {
        await fs.unlink(path.join(uploadsDir, filename))
      } catch {
        // Ignore missing files.
      }
    }),
  )

  await writeProjects(projects)
  res.status(204).end()
})

app.use((error, _req, res, _next) => {
  res.status(400).json({ error: error.message || 'Request failed.' })
})

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`)
})
