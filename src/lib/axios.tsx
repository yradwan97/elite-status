import axios from 'axios'
import i18next from 'i18next'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api' 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const clearCredentialsAndRedirect = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth:logout'))
  window.location.href = '/login'
}

// Request interceptor - attach accessToken from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    const language = i18next.language
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (language) {
      console.log(language)
      config.headers['Accept-Language'] = language
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      clearCredentialsAndRedirect()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request until the refresh resolves
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh-token`,
        { refreshToken }
      )

      const newAccessToken = data.accessToken
      localStorage.setItem('accessToken', newAccessToken)
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      processQueue(null, newAccessToken)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearCredentialsAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api