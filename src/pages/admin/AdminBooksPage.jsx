import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProtectedRoute } from "../../components/ProtectedRoute"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { bookService } from "../../lib/book-service"
import { useToast } from "../../hooks/use-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"

function AdminBooksPageContent() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks()
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return

    try {
      await bookService.deleteBook(id)
      toast({
        title: "Success",
        description: "Book deleted successfully",
      })
      fetchBooks()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Manage Books</h1>
          <p className="text-muted-foreground">Add, edit, and remove books from the catalog</p>
        </div>
        <Link to="/admin/books/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>
                  <Badge variant={book.isAvailable ? "default" : "destructive"}>
                    {book.isAvailable ? "Available" : "Not Available"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/books/edit/${book.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function AdminBooksPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminBooksPageContent />
    </ProtectedRoute>
  )
}
