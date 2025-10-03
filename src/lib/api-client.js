import axios from "axios"
import { API_BASE_URL, TOKEN_KEY } from "./constants"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token and check expiration
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (token) {
      // Dynamically import to avoid circular dependency
      const { authService } = await import('./auth-service.js')
      
      // Check if token is expired before making request
      if (!authService.isTokenValid()) {
        console.log('🚨 Token expired before request, forcing logout')
        authService.forceLogout('Your session has expired. Please log in again.')
        return Promise.reject(new Error('Token expired'))
      }
      
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized response received')
      
      // Dynamically import to avoid circular dependency
      const { authService } = await import('./auth-service.js')
      
      authService.forceLogout('Your session has expired. Please log in again.')
    }
    
    return Promise.reject(error)
  },
)

export default apiClient
