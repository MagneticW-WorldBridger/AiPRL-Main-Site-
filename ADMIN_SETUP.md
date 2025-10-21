# AiprlAssist Admin Panel Setup

Complete setup guide for the AiprlAssist Blog Management Admin Panel.

## 🎯 Overview

The admin panel is integrated into your existing AiprlAssist application and provides:
- **Blog Management**: Create, edit, delete, and publish blog posts
- **Image Upload**: Drag & drop image upload with Firebase Storage
- **Theme Toggle**: Dark/Light mode switching
- **Authentication**: Secure admin login system
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd AiprlAssistBackend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start backend server**
   ```bash
   pnpm dev
   ```

### 2. Frontend Setup

1. **Install additional dependencies**
   ```bash
   cd AiprlAssist
   pnpm add firebase
   ```

2. **Configure environment**
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your Firebase config
   ```

3. **Start frontend**
   ```bash
   pnpm dev
   ```

### 3. Access Admin Panel

- **Admin Login**: `http://localhost:5173/admin`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
- **Blog Management**: `http://localhost:5173/admin/blogs`

## 🔧 Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Storage**
5. Enable **Authentication**

### 2. Get Firebase Config

1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Copy the config object

### 3. Generate Service Account

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Use the values in your backend `.env` file

### 4. Configure Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎨 Admin Panel Features

### Dashboard
- **Statistics**: Total blogs, published, drafts, this month
- **Recent Blogs**: Latest blog posts with quick actions
- **Quick Actions**: Create new blog, view analytics

### Blog Management
- **Grid/List View**: Toggle between card and list layouts
- **Search & Filter**: Find blogs by title, content, or status
- **Bulk Actions**: Publish/unpublish multiple blogs
- **Status Management**: Draft/Published status toggle

### Blog Editor
- **Rich Text Editor**: WYSIWYG content editing
- **Image Upload**: Drag & drop with preview
- **Social Links**: Twitter, LinkedIn, Facebook integration
- **Preview Mode**: See how blog will look on frontend
- **Auto-save**: Draft saving functionality

### Theme System
- **Dark Mode**: Your existing black theme
- **Light Mode**: Clean white theme
- **Persistent**: Theme preference saved across sessions
- **Smooth Transitions**: Animated theme switching

## 🔐 Authentication

### Admin Login
- **Email/Password**: Firebase Authentication
- **JWT Tokens**: Secure session management
- **Auto-logout**: Token expiration handling
- **Route Protection**: All admin routes require authentication

### Security Features
- **Rate Limiting**: API request limits
- **Input Validation**: All form data validated
- **File Upload Security**: Type and size restrictions
- **CORS Protection**: Configured for your domain

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- **Desktop**: Full sidebar and grid layouts
- **Tablet**: Collapsible sidebar
- **Mobile**: Stack layout with touch-friendly controls

## 🛠️ Customization

### Adding New Admin Features

1. **Create new page** in `src/Admin/pages/`
2. **Add route** in `App.tsx` AdminRoutes component
3. **Add menu item** in `AdminSidebar.tsx`
4. **Create API endpoints** in backend

### Styling Customization

The admin panel uses your existing design system:
- **Colors**: Orange (#fd8a0d) primary, your existing palette
- **Typography**: Space Grotesk font family
- **Components**: Reuses your card, button, and modal styles
- **Animations**: Framer Motion transitions

### Theme Customization

Edit `src/Admin/context/AdminThemeContext.tsx` to:
- Add new theme variants
- Modify color schemes
- Change transition durations

## 🚨 Troubleshooting

### Common Issues

1. **Admin panel not loading**
   - Check if backend is running on port 5000
   - Verify `.env.local` configuration
   - Check browser console for errors

2. **Authentication not working**
   - Verify Firebase Authentication is enabled
   - Check Firebase config in `.env.local`
   - Ensure admin password is set in backend `.env`

3. **Image upload fails**
   - Check Firebase Storage rules
   - Verify file size (max 5MB)
   - Ensure file type is image (JPG, PNG, WebP)

4. **Theme not switching**
   - Check if CSS variables are defined
   - Verify theme context is working
   - Clear browser cache

### Debug Mode

Enable debug mode by adding to `.env.local`:
```env
VITE_DEBUG=true
```

## 📊 Performance

### Optimizations
- **Code Splitting**: Admin code separate from main app
- **Lazy Loading**: Images and components load on demand
- **Caching**: API responses cached for better performance
- **Bundle Size**: Optimized for fast loading

### Monitoring
- **Error Tracking**: Console errors logged
- **Performance**: Load times monitored
- **API Calls**: Request/response logging

## 🔄 Updates & Maintenance

### Regular Tasks
1. **Update dependencies**: `pnpm update`
2. **Backup database**: Export Firestore data
3. **Monitor logs**: Check for errors
4. **Test features**: Verify all functionality

### Adding New Blog Fields

1. **Update backend model** in `AiprlAssistBackend/src/models/Blog.js`
2. **Update frontend interface** in `useBlogManagement.ts`
3. **Update forms** in blog editor components
4. **Update display** in blog cards and lists

## 📞 Support

If you encounter any issues:

1. **Check logs**: Backend and frontend console
2. **Verify configuration**: Environment variables
3. **Test API**: Use Postman or curl
4. **Check Firebase**: Console for errors

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ Complete blog management system
- ✅ Beautiful admin interface matching your design
- ✅ Secure authentication system
- ✅ Image upload and management
- ✅ Dark/Light theme support
- ✅ Responsive design
- ✅ Integration with your existing app

Your admin panel is now ready to manage your blog content! 🚀

