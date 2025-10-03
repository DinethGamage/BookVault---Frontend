import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ProtectedRoute } from "../../components/ProtectedRoute"
import { BookForm } from "../../components/BookForm"
import { Button } from "../../components/ui/button"
import { bookService } from "../../lib/book-service"
import { useToast } from "../../hooks/use-toast"
import { ArrowLeft } from "lucide-react"

function EditBookPageContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id)
        setBook(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch book details",
          variant: "destructive",
        })
        navigate("/admin/books")
      } finally {
        setIsFetching(false)
      }
    }

    fetchBook()
  }, [id])

  const handleSubmit = async (bookData) => {
    setIsLoading(true)
    try {
      await bookService.updateBook(id, bookData)
      toast({
        title: "Success",
        description: "Book updated successfully",
      })
      navigate("/admin/books")
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update book",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/admin/books")} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Books
      </Button>

      <BookForm initialData={book} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default function EditBookPage() {
  return (
    <ProtectedRoute requireAdmin>
      <EditBookPageContent />
    </ProtectedRoute>
  )
}
