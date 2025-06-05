import axios from 'axios'

// Use relative path on client, env var on server
const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.RADIO_BACKEND_PATH
    : "/api" // Use relative path on client

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // TODO: Get JWT token from where it's stored (e.g., localStorage, context)
    // Assuming it's in localStorage for now
    const token = typeof window !== "undefined" ? localStorage.getItem('authToken') : null
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
