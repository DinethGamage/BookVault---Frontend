# BookVault Frontend 📚

A modern React.js frontend application for the BookVault Library Management System.

## 🚀 Features

- **User Authentication** - JWT-based login/logout with auto-expiration
- **Book Management** - Browse, search, and view book details
- **Borrowing System** - Borrow and return books with Issue Record tracking
- **Admin Panel** - Role-based access for book and user management
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-friendly interface
- **Real-time Feedback** - Toast notifications and loading states

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DinethGamage/BookVault---Frontend.git
   cd BookVault---Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Copy the example environment file and update it:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── BookCard.jsx    # Book display component
│   ├── Navbar.jsx      # Navigation component
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx# Theme management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── api-client.js   # Axios configuration
│   ├── auth-service.js # Authentication utilities
│   └── book-service.js # Book API calls
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login page
│   ├── DashboardPage.jsx# Main dashboard
│   ├── BooksPage.jsx   # Book listing
│   └── ...
└── styles/             # Global styles
```

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Auto-logout on token expiration
- Protected routes require authentication
- Admin routes require admin role

## 🎨 Theming

The application supports light and dark themes:
- Theme preference is saved in localStorage
- Uses Tailwind CSS dark mode classes
- Toggle available in the header

## 🔗 Backend Integration

This frontend is designed to work with a Spring Boot backend API. The backend should provide:

- **Authentication endpoints**: `/api/auth/*`
- **Book management**: `/api/books/*`
- **User management**: `/api/users/*`
- **Issue records**: `/api/issue_records/*`

Configure the backend URL in your `.env` file using the `VITE_API_BASE_URL` variable.

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.com`

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in dashboard

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues, please open an issue in this repository.

---

**Built with ❤️ using React and modern web technologies**