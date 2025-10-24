import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminDashboard } from '../pages/AdminDashboard';
import { BlogManagement } from '../pages/BlogManagement';
import { CreateBlog } from '../pages/CreateBlog';
import { EditBlog } from '../pages/EditBlog';
import { MediaManagement } from '../pages/MediaManagement';
import { Analytics } from '../pages/Analytics';
import { UserManagement } from '../pages/UserManagement';
import { Settings } from '../pages/Settings';
import { DemoBookingManagement } from '../pages/DemoBookingManagement';
import { AdminLayout } from './AdminLayout';

export const AdminRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation(); // This hook makes the component re-render on URL changes

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ minHeight: '100vh', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center text-white" style={{ color: '#ffffff', textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" style={{ width: '48px', height: '48px', borderRadius: '9999px', borderBottomWidth: '2px', borderBottomColor: '#f97316', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff' }}>Loading Admin Panel...</p>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated, render admin pages based on current path
  const currentPath = location.pathname; // Use React Router's location instead of window.location

  // Direct path-based rendering instead of nested Routes
  if (currentPath === '/admin' || currentPath === '/admin/') {
    window.history.replaceState(null, '', '/admin/dashboard');
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/dashboard')) {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  if (currentPath === '/admin/blogs/new') {
    return (
      <AdminLayout>
        <CreateBlog />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/blogs/') && currentPath !== '/admin/blogs/new') {
    return (
      <AdminLayout>
        <EditBlog />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/blogs')) {
    return (
      <AdminLayout>
        <BlogManagement />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/media')) {
    return (
      <AdminLayout>
        <MediaManagement />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/analytics')) {
    return (
      <AdminLayout>
        <Analytics />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/users')) {
    return (
      <AdminLayout>
        <UserManagement />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/demo-bookings')) {
    return (
      <AdminLayout>
        <DemoBookingManagement />
      </AdminLayout>
    );
  }

  if (currentPath.startsWith('/admin/settings')) {
    return (
      <AdminLayout>
        <Settings />
      </AdminLayout>
    );
  }

  // Default: redirect to dashboard
  window.history.replaceState(null, '', '/admin/dashboard');
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

