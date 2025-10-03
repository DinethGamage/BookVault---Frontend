import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { StatCard } from "../components/StatCard"
import { BookCard } from "../components/BookCard"
import { IssueRecordCard } from "../components/IssueRecordCard"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { bookService } from "../lib/book-service"
import { issueService } from "../lib/issue-service"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { useToast } from "../hooks/use-toast"
import { 
  BookOpen, 
  Library, 
  Clock, 
  TrendingUp,
  Sun,
  Moon,
  Plus,
  Settings,
  UserPlus,
  BookPlus,
  Users,
  Shield
} from "lucide-react"

function DashboardPageContent() {
  const { user, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
  })
  const [recentBooks, setRecentBooks] = useState([])
  const [currentIssues, setCurrentIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const booksData = await bookService.getAllBooks()

        setStats({
          totalBooks: booksData.length,
          borrowedBooks: 0,
          overdueBooks: 0,
        })

        setRecentBooks(booksData.slice(0, 6))
        setCurrentIssues([])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Admin Dashboard - Manage your library system" : "Your library dashboard"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          
          {isAdmin && (
            <Button asChild variant="default" size="sm">
              <Link to="/admin/books" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={Library}
          description="Books in library"
        />
        <StatCard
          title="My Borrowed Books"
          value={stats.borrowedBooks}
          icon={BookOpen}
          description="Currently borrowed"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={Clock}
          description="Need to return"
          variant={stats.overdueBooks > 0 ? "destructive" : "default"}
        />
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Quick Actions
            </CardTitle>
            <CardDescription>
              Manage books and users efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/books" className="flex items-center gap-2">
                  <BookPlus className="h-4 w-4" />
                  Add New Book
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register User
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/books" className="flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  Manage Books
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" size="lg" className="h-20">
            <Link to="/books" className="flex flex-col items-center gap-2">
              <Library className="h-6 w-6" />
              Browse Books
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-20">
            <Link to="/my-books" className="flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6" />
              My Books
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-20">
            <Link to="/books" className="flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              Borrow Book
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Books
          </CardTitle>
          <CardDescription>
            Newly added books in the library
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No books available
            </div>
          )}
        </CardContent>
      </Card>

      {currentIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              My Current Issues
            </CardTitle>
            <CardDescription>
              Books you have currently borrowed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentIssues.map((issue) => (
                <IssueRecordCard key={issue.id} issue={issue} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  )
}
