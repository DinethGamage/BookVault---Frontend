import apiClient from "./api-client"
import { API_ENDPOINTS } from "./constants"

export const bookService = {
  // GET /api/books/get_all_books - Returns List<Book>
  // Book entity: { id, title, author, isbn, quantity, isAvailable }
  async getAllBooks(params = {}) {
    console.log('📚 Getting all books...');
    console.log('🔑 Token exists:', !!localStorage.getItem('auth_token'));
    
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.GET_ALL, { params })
      console.log('✅ Get all books success:', response.data);
      return response.data
    } catch (error) {
      console.error('❌ Get all books failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  // GET /api/books/get_book_by_id/{id} - Returns Book entity
  async getBookById(id) {
    const response = await apiClient.get(API_ENDPOINTS.BOOKS.GET_BY_ID(id))
    return response.data
  },

  // POST /api/books/add_book - Expects BookDTO: { title, author, isbn, quantity, isAvailable }
  // Requires ADMIN role
  async createBook(bookData) {
    console.log('📚 Creating book with data:', bookData);
    console.log('🔑 Token in localStorage:', localStorage.getItem('auth_token'));
    
    const bookDTO = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      quantity: bookData.quantity,
      isAvailable: bookData.isAvailable
    }
    
    console.log('📤 Sending BookDTO:', bookDTO);
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOKS.CREATE, bookDTO)
      console.log('✅ Create book success:', response.data);
      return response.data
    } catch (error) {
      console.error('❌ Create book failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  // PUT /api/books/update_book/{id} - Expects BookDTO: { title, author, isbn, quantity, isAvailable }
  // Requires ADMIN role
  async updateBook(id, bookData) {
    const bookDTO = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      quantity: bookData.quantity,
      isAvailable: bookData.isAvailable
    }
    const response = await apiClient.put(API_ENDPOINTS.BOOKS.UPDATE(id), bookDTO)
    return response.data
  },

  // DELETE /api/books/delete_book/{id} - Requires ADMIN role
  async deleteBook(id) {
    const response = await apiClient.delete(API_ENDPOINTS.BOOKS.DELETE(id))
    return response.data
  },
}
