export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

// API Endpoints matching exact backend controllers
export const API_ENDPOINTS = {
  // AuthController (/api/auth)
  AUTH: {
    LOGIN: "/api/auth/login", // POST - expects LoginRequestDTO { username, password }
    REGISTER: "/api/auth/register_normal_user", // POST - expects RegisterRequestDTO { username, email, password }
  },
  
  // AdminController (/api/admin)
  ADMIN: {
    REGISTER_ADMIN: "/api/admin/register_admin_user", // POST - expects RegisterRequestDTO, requires ADMIN role
  },
  
  // BookController (/api/books)
  BOOKS: {
    GET_ALL: "/api/books/get_all_books", // GET - returns List<Book>
    GET_BY_ID: (id) => `/api/books/get_book_by_id/${id}`, // GET - returns Book
    CREATE: "/api/books/add_book", // POST - expects BookDTO { title, author, isbn, quantity, isAvailable }, requires ADMIN role
    UPDATE: (id) => `/api/books/update_book/${id}`, // PUT - expects BookDTO, requires ADMIN role
    DELETE: (id) => `/api/books/delete_book/${id}`, // DELETE - requires ADMIN role
  },
  
  // IssueRecordController (/api/issue_records)
  ISSUES: {
    ISSUE_BOOK: (bookId) => `/api/issue_records/issue_book/${bookId}`, // POST - returns IssueRecord
    RETURN_BOOK: (issueRecordId) => `/api/issue_records/return_book/${issueRecordId}`, // POST - returns IssueRecord
  },
}

export const TOKEN_KEY = "auth_token"
export const USER_KEY = "user_data"
