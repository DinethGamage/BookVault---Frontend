import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { bookService } from "../lib/book-service"
import { issueService } from "../lib/issue-service"
import { useToast } from "../hooks/use-toast"
import { ArrowLeft, Calendar, BookOpen, CheckCircle, Copy, X } from "lucide-react"

function IssuePageContent() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueRecord, setIssueRecord] = useState(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(bookId)
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
  }, [bookId])

  const handleIssue = async () => {
    setIsSubmitting(true)
    try {
      const issueData = await issueService.issueBook(bookId)
      setIssueRecord(issueData)
      setShowSuccessDialog(true)
      
      toast({
        title: "Success",
        description: `Book borrowed successfully! Issue Record ID: ${issueData.id}`,
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to borrow book. Please check if the book is available.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyIssueId = () => {
    if (issueRecord?.id) {
      navigator.clipboard.writeText(issueRecord.id.toString())
      toast({
        title: "Copied!",
        description: "Issue Record ID copied to clipboard",
      })
    }
  }

  const handleDialogClose = () => {
    setShowSuccessDialog(false)
    navigate("/my-books")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!book) return null

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate(`/books/${bookId}`)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Book Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Borrow Book</CardTitle>
          <CardDescription>Confirm your book borrowing request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="mb-2 flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN:</span>
                <span className="font-mono">{book.isbn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity Available:</span>
                <span>{book.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{book.isAvailable ? "Available" : "Not Available"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Borrowing Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-semibold">{dueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Period:</span>
                <span>14 days</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              By borrowing this book, you agree to return it by the due date. Late returns may result in restrictions on
              future borrowing.
            </p>
          </div>

          <Button
            onClick={handleIssue}
            disabled={isSubmitting || !book.isAvailable || book.quantity <= 0}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Processing..." : 
             (!book.isAvailable || book.quantity <= 0) ? "Book Not Available" : 
             "Confirm Borrowing"}
          </Button>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Book Borrowed Successfully!
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDialogClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Your book has been borrowed. Please save the Issue Record ID for returning the book.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    📋 Issue Record ID
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {issueRecord?.id}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyIssueId}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• <strong>Save this ID</strong> - You'll need it to return the book</p>
                <p>• <strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p>• <strong>Return:</strong> Go to "My Books" and use this ID</p>
              </div>

              <Button onClick={handleDialogClose} className="w-full">
                Go to My Books
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function IssuePage() {
  return (
    <ProtectedRoute>
      <IssuePageContent />
    </ProtectedRoute>
  )
}
