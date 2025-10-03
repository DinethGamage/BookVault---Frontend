import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../lib/auth-service"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authService.getCurrentUser()
      const isTokenValid = authService.isTokenValid()
      
      if (currentUser && isTokenValid) {
        setUser(currentUser)
        console.log('✅ Valid session found for user:', currentUser.username)
      } else if (currentUser && !isTokenValid) {
        console.log('🚨 Token expired for user:', currentUser.username)
        authService.logout() // Clean up expired session
        setUser(null)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    }

    initializeAuth()
  }, []) // Empty dependency array - only run on mount

  // Set up periodic token validation when user is logged in
  useEffect(() => {
    if (!user) return // Don't set up interval if no user

    const interval = setInterval(() => {
      if (!authService.isTokenValid()) {
        console.log('🚨 Token expired during session, logging out')
        authService.forceLogout('Your session has expired. Please log in again.')
        setUser(null) // Clear user state
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [user]) // This effect depends on user, but won't cause infinite loop since we only clear user, not set it

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    
    // Set user from LoginResponseDTO data
    const userData = {
      username: data.username,
      roles: data.roles
    }
    
    setUser(userData)
    return data
  }

  const register = async (userData) => {
    const data = await authService.register(userData)
    // Registration doesn't automatically log in user, just returns success
    return data
  }

  const adminRegister = async (userData) => {
    const data = await authService.adminRegister(userData)
    // Admin registration doesn't automatically log in user, just returns success
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    adminRegister,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes("ROLE_ADMIN") || false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
