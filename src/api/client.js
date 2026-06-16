const TOKEN_KEY = 'jfd_session'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(path, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = 'Request failed.'
    try {
      const data = await response.json()
      message = data.error || message
    } catch {
      // Ignore parse errors.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export function fetchProjects() {
  return request('/api/projects')
}

export function fetchProject(id) {
  return request(`/api/projects/${id}`)
}

export function createProject(formData) {
  return request('/api/projects', {
    method: 'POST',
    body: formData,
  })
}

export function updateProject(id, formData) {
  return request(`/api/projects/${id}`, {
    method: 'PUT',
    body: formData,
  })
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, {
    method: 'DELETE',
  })
}
