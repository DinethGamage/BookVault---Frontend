/**
 * BookVault - Backend Entity Types and DTOs
 * 
 * This file documents the data structures used by the Spring Boot backend
 * for type safety and reference when making API calls.
 */

// ============================
// REQUEST DTOs (Frontend → Backend)
// ============================

/**
 * RegisterRequestDTO
 * Used for both normal user and admin registration
 * @typedef {Object} RegisterRequestDTO
 * @property {string} username - User's username
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */

/**
 * LoginRequestDTO
 * Used for user authentication
 * @typedef {Object} LoginRequestDTO
 * @property {string} username - User's email address (sent as "username" field)
 * @property {string} password - User's password
 */

/**
 * BookDTO
 * Used for creating and updating books
 * @typedef {Object} BookDTO
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} isbn - Book ISBN
 * @property {number} quantity - Number of copies available
 * @property {boolean} isAvailable - Whether the book is available for borrowing
 */

// ============================
// RESPONSE DTOs (Backend → Frontend)
// ============================

/**
 * LoginResponseDTO
 * Returned after successful login
 * @typedef {Object} LoginResponseDTO
 * @property {string} token - JWT authentication token
 * @property {string} username - User's username
 * @property {string[]} roles - User's roles (e.g., ["ROLE_USER"], ["ROLE_USER", "ROLE_ADMIN"])
 */

// ============================
// BACKEND ENTITIES
// ============================

/**
 * User Entity
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} password - User's encrypted password
 * @property {string[]} roles - User's roles
 */

/**
 * Book Entity
 * @typedef {Object} Book
 * @property {number} id - Book ID
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} isbn - Book ISBN
 * @property {number} quantity - Number of copies available
 * @property {boolean} isAvailable - Whether the book is available
 */

/**
 * IssueRecord Entity
 * @typedef {Object} IssueRecord
 * @property {number} id - Issue record ID
 * @property {string} issueDate - Date when book was issued
 * @property {string} dueDate - Due date for book return
 * @property {string|null} returnDate - Date when book was returned (null if not returned)
 * @property {boolean} isReturned - Whether the book has been returned
 * @property {User} user - User who borrowed the book
 * @property {Book} book - Book that was borrowed
 */

// ============================
// AUTHENTICATION
// ============================

/**
 * JWT Token
 * Should be sent in Authorization header as "Bearer <token>"
 */

// ============================
// ROLE CONSTANTS
// ============================

export const USER_ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN"
}

export const PERMISSIONS = {
  // Admin only permissions
  REGISTER_ADMIN: "ROLE_ADMIN",
  ADD_BOOK: "ROLE_ADMIN", 
  UPDATE_BOOK: "ROLE_ADMIN",
  DELETE_BOOK: "ROLE_ADMIN",
  
  // User permissions
  ISSUE_BOOK: "ROLE_USER",
  RETURN_BOOK: "ROLE_USER",
  VIEW_BOOKS: "ROLE_USER",
}