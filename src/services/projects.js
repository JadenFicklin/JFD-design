import { get, ref, remove, set, update } from 'firebase/database'
import { getFirebaseDatabase } from '../firebase'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function imagesToArray(images) {
  if (!images) return []
  if (Array.isArray(images)) return images
  return Object.values(images)
}

function normalizeProject(id, data) {
  const images = imagesToArray(data.images)
  return {
    id,
    title: data.title || '',
    summary: data.summary || '',
    description: data.description || '',
    images,
    coverImage: data.coverImage || images[0]?.url || '',
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`))
    reader.readAsDataURL(file)
  })
}

function compressImage(file, maxWidth = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = Math.min(1, maxWidth / image.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))

      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error(`Unable to process ${file.name}.`))
        return
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      resolve(canvas.toDataURL(outputType, quality))
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Unable to process ${file.name}.`))
    }

    image.src = objectUrl
  })
}

async function prepareImageDataUrl(file) {
  if (file.size > MAX_IMAGE_BYTES) {
    return compressImage(file)
  }

  return readFileAsDataUrl(file)
}

async function prepareImage(file, meta) {
  const url = await prepareImageDataUrl(file)

  return {
    id: createId(),
    url,
    caption: meta.caption?.trim() || '',
    alt: meta.alt?.trim() || '',
  }
}

function imagesToMap(images) {
  return Object.fromEntries(images.map((image) => [image.id, image]))
}

export async function fetchProjects() {
  const snapshot = await get(ref(getFirebaseDatabase(), 'projects'))

  if (!snapshot.exists()) {
    return []
  }

  return Object.entries(snapshot.val())
    .map(([id, project]) => normalizeProject(id, project))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function fetchProject(id) {
  const snapshot = await get(ref(getFirebaseDatabase(), `projects/${id}`))

  if (!snapshot.exists()) {
    throw new Error('Project not found.')
  }

  return normalizeProject(id, snapshot.val())
}

export async function createProject({ title, summary, description, imageUploads }) {
  const projectId = createId()
  const images = await Promise.all(
    imageUploads.map(({ file, caption, alt }) =>
      prepareImage(file, { caption, alt: alt || title }),
    ),
  )

  const timestamp = new Date().toISOString()
  const project = {
    title: title.trim(),
    summary: summary?.trim() || '',
    description: description?.trim() || '',
    images: imagesToMap(images),
    coverImage: images[0]?.url || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await set(ref(getFirebaseDatabase(), `projects/${projectId}`), project)
  return normalizeProject(projectId, project)
}

export async function updateProject(id, { title, summary, description, imageUploads, existingImages }) {
  const current = await fetchProject(id)
  const newImages = await Promise.all(
    imageUploads.map(({ file, caption, alt }) =>
      prepareImage(file, { caption, alt: alt || title || current.title }),
    ),
  )

  const mergedImages = [...(existingImages || current.images), ...newImages]
  const timestamp = new Date().toISOString()

  await update(ref(getFirebaseDatabase(), `projects/${id}`), {
    title: title.trim(),
    summary: summary?.trim() || '',
    description: description?.trim() || '',
    images: imagesToMap(mergedImages),
    coverImage: current.coverImage || mergedImages[0]?.url || '',
    updatedAt: timestamp,
  })

  return fetchProject(id)
}

export async function deleteProject(id) {
  await remove(ref(getFirebaseDatabase(), `projects/${id}`))
}
