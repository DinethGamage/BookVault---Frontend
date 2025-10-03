import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Navbar } from "./components/Navbar"
import { Toaster } from "./components/ui/toaster"
import { useToast } from "./hooks/use-toast"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminRegisterPage from "./pages/AdminRegisterPage"
import BooksPage from "./pages/BooksPage"
import BookDetailPage from "./pages/BookDetailPage"
import DashboardPage from "./pages/DashboardPage"
import MyBooksPage from "./pages/MyBooksPage"
import IssuePage from "./pages/IssuePage"
import AdminBooksPage from "./pages/admin/AdminBooksPage"
import AddBookPage from "./pages/admin/AddBookPage"
import EditBookPage from "./pages/admin/EditBookPage"

function AppContent() {
  const { toast } = useToast()

  useEffect(() => {
    // Make toast available globally for auth service
    window.showToast = toast
    
    return () => {
      delete window.showToast
    }
  }, [toast])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-books" element={<MyBooksPage />} />
        <Route path="/issue/:bookId" element={<IssuePage />} />
        <Route path="/admin/books" element={<AdminBooksPage />} />
        <Route path="/admin/books/add" element={<AddBookPage />} />
        <Route path="/admin/books/edit/:id" element={<EditBookPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
