import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { bookService } from "../lib/book-service"
import { useToast } from "../hooks/use-toast"
import { ArrowLeft, BookOpen } from "lucide-react"

function BookDetailPageContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
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
        navigate("/books")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/books")} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Books
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="mb-2 text-3xl">{book.title}</CardTitle>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>
            <Badge variant={book.isAvailable && book.quantity > 0 ? "default" : "destructive"} className="text-sm">
              {book.isAvailable && book.quantity > 0 ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Book Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ISBN:</dt>
                  <dd className="font-mono">{book.isbn}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd>{book.isAvailable ? "Available" : "Not Available"}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Availability</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Quantity:</dt>
                  <dd className="font-semibold">{book.quantity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Available:</dt>
                  <dd>{book.isAvailable && book.quantity > 0 ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>

          {book.description && (
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{book.description}</p>
            </div>
          )}

          {book.isAvailable && book.quantity > 0 && (
            <Link to={`/issue/${book.id}`}>
              <Button className="w-full gap-2" size="lg">
                <BookOpen className="h-5 w-5" />
                Borrow This Book
              </Button>
            </Link>
          )}

          {(!book.isAvailable || book.quantity <= 0) && (
            <Button disabled className="w-full gap-2" size="lg">
              <BookOpen className="h-5 w-5" />
              Book Not Available
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookDetailPage() {
  return (
    <ProtectedRoute>
      <BookDetailPageContent />
    </ProtectedRoute>
  )
}
