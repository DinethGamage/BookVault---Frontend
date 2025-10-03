# Deployment Guide

## Frontend Deployment Options

### 1. Netlify (Recommended for React apps)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository for auto-deployment

3. **Environment Variables**
   - In Netlify dashboard: Site settings → Environment variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com`

### 2. Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_BASE_URL
   ```

### 3. GitHub Pages (Static hosting)

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/LibraryManagement-Frontend",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Backend Deployment

### 1. Heroku

1. **Create Procfile**
   ```
   web: java -jar target/library-management-0.0.1-SNAPSHOT.jar
   ```

2. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### 2. Railway

1. **Connect GitHub repository**
2. **Add environment variables**
3. **Deploy automatically on push**

### 3. DigitalOcean App Platform

1. **Create new app**
2. **Connect GitHub repository**
3. **Configure build settings**

## Environment Configuration

### Production Environment Variables

**Frontend (.env.production)**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_API_TIMEOUT=15000
```

**Backend (application-prod.properties)**
```properties
spring.datasource.url=jdbc:postgresql://your-db-host:5432/library_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
```

## CORS Configuration

Make sure your backend allows your frontend domain:

```java
@CrossOrigin(origins = {"http://localhost:3000", "https://your-frontend-domain.com"})
```

## SSL/HTTPS

- Most deployment platforms provide free SSL certificates
- Update API URLs to use HTTPS in production
- Ensure secure cookie settings for authentication