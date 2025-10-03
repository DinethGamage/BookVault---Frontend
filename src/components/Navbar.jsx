import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Button } from "./ui/button"
import { 
  BookOpen, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Library, 
  BookMarked, 
  Sun, 
  Moon,
  Plus,
  Settings,
  UserPlus,
  BookPlus
} from "lucide-react"

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookVault</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/books">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Library className="h-4 w-4" />
                    Books
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/my-books">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BookMarked className="h-4 w-4" />
                    My Books
                  </Button>
                </Link>

                {/* Admin-only buttons */}
                {isAdmin && (
                  <>
                    <Link to="/admin/books">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Manage Books
                      </Button>
                    </Link>
                    <Link to="/admin/books/add">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <BookPlus className="h-4 w-4" />
                        Add Book
                      </Button>
                    </Link>
                    <Link to="/admin/register">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add Admin
                      </Button>
                    </Link>
                  </>
                )}

                {/* Theme Toggle */}
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark
                    </>
                  )}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
