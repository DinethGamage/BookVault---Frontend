import apiClient from "./api-client"
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from "./constants"

// Utility function to decode JWT token (client-side only, no verification)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('❌ Error decoding JWT:', error)
    return null
  }
}

// Check if token is expired
function isTokenExpired(token) {
  if (!token) return true
  
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true
  
  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  const currentTime = Math.floor(Date.now() / 1000)
  const isExpired = decoded.exp < currentTime
  
  if (isExpired) {
    console.log('⏰ Token expired:', {
      expiresAt: new Date(decoded.exp * 1000),
      currentTime: new Date(),
      expiredMinutesAgo: Math.floor((currentTime - decoded.exp) / 60)
    })
  }
  
  return isExpired
}

export const authService = {
  // Login with LoginRequestDTO: { username, password }
  // Note: Backend expects email as "username" field in LoginRequestDTO
  // Returns LoginResponseDTO: { token, username, roles }
  async login(email, password) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      username: email,  // Send email as username to match backend expectation
      password,
    })

    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token)
      // Store user data from LoginResponseDTO
      const userData = {
        username: response.data.username,
        roles: response.data.roles
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
    }

    return response.data
  },

  // Register normal user with RegisterRequestDTO: { username, email, password }
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      username: userData.username,  // This will be mapped to 'name' field in User entity
      email: userData.email,
      password: userData.password
    })

    return response.data
  },

  // Register admin user with RegisterRequestDTO: { username, email, password }
  // Requires ADMIN role authentication
  async adminRegister(userData) {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.REGISTER_ADMIN, {
      username: userData.username,
      email: userData.email,
      password: userData.password
    })

    return response.data
  },

  logout() {
    console.log('🚪 Logging out user...')
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Force logout with reason (for expired tokens, etc.)
  forceLogout(reason = 'Session expired') {
    console.log('🚨 Force logout:', reason)
    this.logout()
    
    // Navigate to login page
    window.location.href = '/login'
    
    // Show notification if toast is available
    if (window.showToast) {
      window.showToast({
        title: "Session Expired",
        description: reason,
        variant: "destructive",
      })
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Check if current token is valid (not expired)
  isTokenValid() {
    const token = this.getToken()
    return token && !isTokenExpired(token)
  },

  isAuthenticated() {
    return this.isTokenValid()
  },

  // Get token info for debugging
  getTokenInfo() {
    const token = this.getToken()
    if (!token) return null
    
    const decoded = decodeJWT(token)
    if (!decoded) return null
    
    return {
      token: token.substring(0, 20) + '...',
      expired: isTokenExpired(token),
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
      currentTime: new Date(),
      subject: decoded.sub,
      roles: decoded.roles || []
    }
  },
}
