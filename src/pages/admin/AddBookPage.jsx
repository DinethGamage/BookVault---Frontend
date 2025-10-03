import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ProtectedRoute } from "../../components/ProtectedRoute"
import { BookForm } from "../../components/BookForm"
import { Button } from "../../components/ui/button"
import { bookService } from "../../lib/book-service"
import { useToast } from "../../hooks/use-toast"
import { ArrowLeft } from "lucide-react"

function AddBookPageContent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (bookData) => {
    setIsLoading(true)
    try {
      await bookService.createBook(bookData)
      toast({
        title: "Success",
        description: "Book added successfully",
      })
      navigate("/admin/books")
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add book",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/admin/books")} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Books
      </Button>

      <BookForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default function AddBookPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AddBookPageContent />
    </ProtectedRoute>
  )
}
