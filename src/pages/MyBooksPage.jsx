import React, { useState, useEffect } from "react"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { IssueRecordCard } from "../components/IssueRecordCard"
import { issueService } from "../lib/issue-service"
import { useToast } from "../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BookOpen, ArrowLeft, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

function MyBooksPageContent() {
  const [issues, setIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReturning, setIsReturning] = useState(false)
  const { toast } = useToast()

  const fetchIssues = async () => {
    try {
      // Since you don't want to implement the backend endpoint,
      // we'll just show an empty array and provide manual return interface
      setIssues([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your borrowed books",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleReturn = async (issueId) => {
    setIsReturning(true)
    try {
      await issueService.returnBook(issueId)
      toast({
        title: "Success",
        description: "Book returned successfully",
      })
      fetchIssues() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setIsReturning(false)
    }
  }

  const handleManualReturn = async () => {
    const issueId = document.getElementById('issueId').value
    if (issueId) {
      await handleReturn(parseInt(issueId))
      document.getElementById('issueId').value = '' // Clear input
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid Issue Record ID",
        variant: "destructive",
      })
    }
  }

  // Calculate statistics
  const activeIssues = issues.filter(issue => !issue.isReturned)
  const returnedIssues = issues.filter(issue => issue.isReturned)
  const overdueIssues = activeIssues.filter(issue => {
    const dueDate = new Date(issue.dueDate)
    return dueDate < new Date()
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/books">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </Link>
        <h1 className="mb-2 text-3xl font-bold">My Books</h1>
        <p className="text-muted-foreground">Manage your borrowed books and view history</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currently Borrowed</p>
              <p className="text-2xl font-bold">{activeIssues.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-500">{overdueIssues.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Returned</p>
              <p className="text-2xl font-bold text-green-500">{returnedIssues.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {issues.length === 0 ? (
        /* Manual Return Interface - shown when backend endpoint not available */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Return a Book
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can return books using the Issue Record ID from your borrowing receipt.
            </p>
            
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter Issue Record ID"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="issueId"
              />
              <Button 
                onClick={handleManualReturn}
                disabled={isReturning}
              >
                {isReturning ? "Processing..." : "Return Book"}
              </Button>
            </div>
            
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">📋 How to find your Issue Record ID:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Check the success message when you borrowed the book</li>
                <li>Contact the library admin for assistance</li>
                <li>Look for the ID in your borrowing confirmation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Tabs Interface - shown when we have issue records */
        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="borrowed" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Currently Borrowed ({activeIssues.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue ({overdueIssues.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              History ({returnedIssues.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed">
            {activeIssues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't borrowed any books yet</p>
                  <Link to="/books">
                    <Button className="mt-4">Browse Books</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeIssues.map((issue) => (
                  <IssueRecordCard 
                    key={issue.id} 
                    issue={issue} 
                    onReturn={handleReturn}
                    isReturning={isReturning}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overdue">
            {overdueIssues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">No overdue books! You're all caught up.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overdueIssues.map((issue) => (
                  <IssueRecordCard 
                    key={issue.id} 
                    issue={issue} 
                    onReturn={handleReturn}
                    isReturning={isReturning}
                    isOverdue={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {returnedIssues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No return history yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {returnedIssues.map((issue) => (
                  <IssueRecordCard 
                    key={issue.id} 
                    issue={issue}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default function MyBooksPage() {
  return (
    <ProtectedRoute>
      <MyBooksPageContent />
    </ProtectedRoute>
  )
}
