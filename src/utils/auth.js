import { getStorage, safeJsonParse } from './storage'

const AUTH_KEY = 'g3_auth_v1'

export function getAuth() {
  const storage = getStorage()
  if (!storage) return null
  return safeJsonParse(storage.getItem(AUTH_KEY), null)
}

export function setAuth(auth) {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(AUTH_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  const storage = getStorage()
  if (!storage) return
  storage.removeItem(AUTH_KEY)
}

