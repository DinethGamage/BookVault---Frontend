import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useAuth } from "../contexts/AuthContext"
import { BookOpen, Edit, Trash2 } from "lucide-react"

export const BookCard = ({ book }) => {
  const { isAdmin } = useAuth()

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
          <Badge variant={book.isAvailable ? "default" : "destructive"}>
            {book.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ISBN:</span>
            <span className="font-mono">{book.isbn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity:</span>
            <span>{book.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span>{book.isAvailable ? "Available" : "Not Available"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link to={`/books/${book.id}`} className="w-full">
          <Button className="w-full gap-2" variant="outline">
            <BookOpen className="h-4 w-4" />
            View Details
          </Button>
        </Link>
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex w-full gap-2">
            <Link to={`/admin/books/edit/${book.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={() => {
                // TODO: Implement delete functionality
                console.log('Delete book:', book.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
