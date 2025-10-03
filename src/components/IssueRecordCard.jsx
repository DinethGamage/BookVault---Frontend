import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Calendar, BookOpen } from "lucide-react"

export const IssueRecordCard = ({ issue, onReturn, isReturning = false, isOverdue: forceOverdue = false }) => {
  const isOverdue = forceOverdue || (!issue.isReturned && new Date(issue.dueDate) < new Date())
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString()

  return (
    <Card className={isOverdue ? "border-destructive" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{issue.book?.title || "Unknown Book"}</CardTitle>
          <Badge variant={issue.isReturned ? "secondary" : isOverdue ? "destructive" : "default"}>
            {issue.isReturned ? "Returned" : isOverdue ? "Overdue" : "Active"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Issue Record ID: {issue.id}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>by {issue.book?.author || "Unknown Author"}</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Issue Date:</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(issue.issueDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : ''}`}>
              <Calendar className="h-3 w-3" />
              {formatDate(issue.dueDate)}
            </span>
          </div>
          {issue.returnDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Return Date:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(issue.returnDate)}
              </span>
            </div>
          )}
          {isOverdue && !issue.isReturned && (
            <div className="text-xs text-destructive font-medium">
              ⚠️ This book is overdue. Please return it as soon as possible.
            </div>
          )}
        </div>
        {!issue.isReturned && onReturn && (
          <Button 
            onClick={() => onReturn(issue.id)} 
            className="w-full" 
            variant={isOverdue ? "destructive" : "outline"}
            disabled={isReturning}
          >
            {isReturning ? "Returning..." : isOverdue ? "Return Overdue Book" : "Return Book"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
