import axios from 'axios'

const API_BASE_URL = process.env.RADIO_BACKEND_PATH

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
    const token = localStorage.getItem('authToken')
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
