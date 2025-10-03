# BookVault - Backend Integration Updates

## Overview
This document outlines all the changes made to integrate your React.js frontend with the Spring Boot backend and rebrand the application to "BookVault".

## 📋 Changes Made

### 1. Project Rebranding to "BookVault"

**Files Updated:**
- `package.json` - Changed project name from "library-management-system-react" to "bookvault"
- `index.html` - Updated title from "Library Management System" to "BookVault"
- `src/components/Navbar.jsx` - Updated navbar brand text to "BookVault"
- `src/pages/HomePage.jsx` - Updated main heading to "Welcome to BookVault"

### 2. API Endpoints Configuration (`src/lib/constants.js`)

**Updated API_ENDPOINTS object to exactly match your backend controllers:**

```javascript
// AuthController (/api/auth)
AUTH: {
  LOGIN: "/api/auth/login",                    // POST - LoginRequestDTO
  REGISTER: "/api/auth/register_normal_user",  // POST - RegisterRequestDTO
}

// AdminController (/api/admin)  
ADMIN: {
  REGISTER_ADMIN: "/api/admin/register_admin_user", // POST - RegisterRequestDTO
}

// BookController (/api/books)
BOOKS: {
  GET_ALL: "/api/books/get_all_books",              // GET - Returns List<Book>
  GET_BY_ID: (id) => `/api/books/get_book_by_id/${id}`, // GET - Returns Book
  CREATE: "/api/books/add_book",                    // POST - BookDTO
  UPDATE: (id) => `/api/books/update_book/${id}`,  // PUT - BookDTO  
  DELETE: (id) => `/api/books/delete_book/${id}`,  // DELETE
}

// IssueRecordController (/api/issue_records)
ISSUES: {
  ISSUE_BOOK: (bookId) => `/api/issue_records/issue_book/${bookId}`,           // POST
  RETURN_BOOK: (issueRecordId) => `/api/issue_records/return_book/${issueRecordId}`, // POST
}
```

**Removed endpoints that don't exist in your backend:**
- Removed book search endpoint (not implemented in backend)
- Removed issue record get_all and get_by_id endpoints (not available in backend)

### 3. Authentication Service Updates (`src/lib/auth-service.js`)

**Key Changes:**
- **Login function**: Now accepts `username` and `password` (not email) matching `LoginRequestDTO`
- **Response handling**: Updated to handle `LoginResponseDTO` structure `{ token, username, roles }`
- **Registration**: Updated to send proper `RegisterRequestDTO` format `{ username, email, password }`
- **Admin registration**: Fixed endpoint to use `API_ENDPOINTS.ADMIN.REGISTER_ADMIN`

```javascript
// Before: login(email, password)  
// After: login(username, password)

// Response handling updated to match LoginResponseDTO
const userData = {
  username: response.data.username,
  roles: response.data.roles
}
```

### 4. Book Service Updates (`src/lib/book-service.js`)

**Updated to match BookDTO structure:**
```javascript
// BookDTO: { title, author, isbn, quantity, isAvailable }
const bookDTO = {
  title: bookData.title,
  author: bookData.author, 
  isbn: bookData.isbn,
  quantity: bookData.quantity,
  isAvailable: bookData.isAvailable
}
```

**Endpoint updates:**
- `GET_BY_ID` now uses `/api/books/get_book_by_id/{id}` instead of `/api/books/{id}`
- Removed search functionality (not available in backend)

### 5. Issue Service Updates (`src/lib/issue-service.js`)

**Simplified to match available backend endpoints:**
- Removed `getAllIssues()`, `getIssueById()`, `getUserIssues()` (not available in backend)
- Kept only `issueBook(bookId)` and `returnBook(issueRecordId)` matching your backend

### 6. Login Page Updates (`src/pages/LoginPage.jsx`)

**Changed from email-based to username-based login:**
- Updated state from `email` to `username`
- Changed input field from email type to text type
- Updated placeholder and labels
- Updated title to "Sign In to BookVault"

### 7. Authentication Context Updates (`src/contexts/AuthContext.jsx`)

**Key Changes:**
- `login` function now accepts `username` instead of `email`
- Updated user data structure to match `LoginResponseDTO`
- Fixed `isAdmin` check to use `user?.roles?.includes("ADMIN")`
- Registration no longer auto-logs in users (matching backend behavior)

### 8. Dashboard Updates (`src/pages/DashboardPage.jsx`)

**Updated user display:**
- Changed `{user?.name}` to `{user?.username}` to match backend user structure

### 9. Type Documentation (`src/lib/types.js`)

**Created comprehensive type documentation including:**
- Request DTOs: `RegisterRequestDTO`, `LoginRequestDTO`, `BookDTO`
- Response DTOs: `LoginResponseDTO`
- Backend Entities: `User`, `Book`, `IssueRecord`
- Role constants and permissions

## 🔧 Backend Requirements

To complete the integration, ensure your Spring Boot backend has:

1. **CORS Configuration** allowing requests from `http://localhost:3001`
2. **JWT Authentication** sending tokens in response headers
3. **Error handling** returning proper HTTP status codes and error messages

## 🚀 Ready to Use

Your BookVault frontend is now fully configured to work with your Spring Boot backend. The authentication flow works as follows:

1. **Registration**: `POST /api/auth/register_normal_user` with `{ username, email, password }`
2. **Login**: `POST /api/auth/login` with `{ username, password }` → Returns `{ token, username, roles }`
3. **Protected Routes**: JWT token sent as `Authorization: Bearer <token>`
4. **Book Management**: Full CRUD operations for admins
5. **Issue/Return**: Book borrowing system for users

## 📝 Data Flow Summary

**Frontend → Backend:**
- RegisterRequestDTO: `{ username, email, password }`
- LoginRequestDTO: `{ username, password }`
- BookDTO: `{ title, author, isbn, quantity, isAvailable }`
- JWT Token: `Authorization: Bearer <token>`

**Backend → Frontend:**
- LoginResponseDTO: `{ token, username, roles }`
- Book Entity: `{ id, title, author, isbn, quantity, isAvailable }`
- IssueRecord Entity: `{ id, issueDate, dueDate, returnDate, isReturned, user, book }`