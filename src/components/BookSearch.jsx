import React, { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "lucide-react"

export const BookSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
