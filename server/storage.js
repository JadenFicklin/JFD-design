import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const dataFile = path.join(dataDir, 'projects.json')

export async function readProjects() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    const projects = JSON.parse(raw)
    return Array.isArray(projects) ? projects : []
  } catch {
    return []
  }
}

export async function writeProjects(projects) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2))
}

export function getUploadsDir() {
  return path.join(__dirname, 'uploads')
}

export function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
