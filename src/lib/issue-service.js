import apiClient from "./api-client"
import { API_ENDPOINTS } from "./constants"

export const issueService = {
  // POST /api/issue_records/issue_book/{bookId} - Issue a book to logged-in user
  // Returns IssueRecord: { id, issueDate, dueDate, returnDate, isReturned, user, book }
  async issueBook(bookId) {
    try {
      console.log('📚 Issuing book with ID:', bookId)
      const response = await apiClient.post(API_ENDPOINTS.ISSUES.ISSUE_BOOK(bookId))
      console.log('✅ Book issued successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to issue book:', error.response?.data || error.message)
      throw error
    }
  },

  // POST /api/issue_records/return_book/{issueRecordId} - Return a book
  // Returns IssueRecord: { id, issueDate, dueDate, returnDate, isReturned, user, book }
  async returnBook(issueRecordId) {
    try {
      console.log('📚 Returning book with Issue Record ID:', issueRecordId)
      const response = await apiClient.post(API_ENDPOINTS.ISSUES.RETURN_BOOK(issueRecordId))
      console.log('✅ Book returned successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to return book:', error.response?.data || error.message)
      throw error
    }
  },
}
