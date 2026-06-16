import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  }
}

function isConfigReady(config) {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.databaseURL &&
      config.projectId &&
      config.appId,
  )
}

const firebaseConfig = getFirebaseConfig()

export const firebaseApp = isConfigReady(firebaseConfig) ? initializeApp(firebaseConfig) : null

export function getFirebaseAuth() {
  if (!firebaseApp) {
    throw new Error('Firebase is not configured.')
  }

  return getAuth(firebaseApp)
}

export function getFirebaseDatabase() {
  if (!firebaseApp) {
    throw new Error('Firebase is not configured.')
  }

  return getDatabase(firebaseApp)
}

export async function initFirebaseAnalytics() {
  if (!firebaseApp) {
    console.warn('Firebase is not configured. Add VITE_FIREBASE_* values to .env')
    return null
  }

  if (!(await isSupported())) {
    return null
  }

  return getAnalytics(firebaseApp)
}

export async function initFirebase() {
  return initFirebaseAnalytics()
}
