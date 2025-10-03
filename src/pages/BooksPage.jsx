import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { BookCard } from "../components/BookCard"
import { BookSearch } from "../components/BookSearch"
import { Button } from "../components/ui/button"
import { bookService } from "../lib/book-service"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../hooks/use-toast"
import { Plus, Settings } from "lucide-react"

function BooksPageContent() {
  const { isAdmin } = useAuth()
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBooks = async (searchQuery = "") => {
    setIsLoading(true)
    try {
      const data = searchQuery ? await bookService.searchBooks(searchQuery) : await bookService.getAllBooks()
      setBooks(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Book Catalog</h1>
          <p className="text-muted-foreground">Browse and search our collection</p>
        </div>
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex gap-3">
            <Link to="/admin/books/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            </Link>
            <Link to="/admin/books">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mb-8">
        <BookSearch onSearch={fetchBooks} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : books.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No books found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BooksPage() {
  return (
    <ProtectedRoute>
      <BooksPageContent />
    </ProtectedRoute>
  )
}
