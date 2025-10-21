import { useState, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from './useAdminAuth';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  tag: string;
  heroImage?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export const useBlogManagement = () => {
  const { token } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    if (!token) {
      setError('No authentication token available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllBlogs = useCallback(async (status?: string) => {
    return handleApiCall(async () => {
      const response = await adminApi.getAllBlogs(token!, status);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch blogs');
      }
      return response.data as BlogPost[];
    });
  }, [token]);

  const getBlogById = useCallback(async (id: string) => {
    return handleApiCall(async () => {
      const response = await adminApi.getBlogById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch blog');
      }
      return response.data as BlogPost;
    });
  }, []);

  const createBlog = useCallback(async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    return handleApiCall(async () => {
      const response = await adminApi.createBlog(token!, blogData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create blog');
      }
      return response.data as BlogPost;
    });
  }, [token]);

  const updateBlog = useCallback(async (id: string, blogData: Partial<BlogPost>) => {
    return handleApiCall(async () => {
      const response = await adminApi.updateBlog(token!, id, blogData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update blog');
      }
      return response.data as BlogPost;
    });
  }, [token]);

  const deleteBlog = useCallback(async (id: string) => {
    return handleApiCall(async () => {
      const response = await adminApi.deleteBlog(token!, id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete blog');
      }
      return true;
    });
  }, [token]);

  const searchBlogs = useCallback(async (query: string, status?: string) => {
    return handleApiCall(async () => {
      const response = await adminApi.searchBlogs(query, status);
      if (!response.success) {
        throw new Error(response.message || 'Failed to search blogs');
      }
      return response.data as BlogPost[];
    });
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    return handleApiCall(async () => {
      const response = await adminApi.uploadImage(token!, file);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload image');
      }
      return response.data;
    });
  }, [token]);

  const uploadMultipleImages = useCallback(async (files: File[]) => {
    return handleApiCall(async () => {
      const response = await adminApi.uploadMultipleImages(token!, files);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload images');
      }
      return response.data;
    });
  }, [token]);

  const deleteImage = useCallback(async (fileName: string) => {
    return handleApiCall(async () => {
      const response = await adminApi.deleteImage(token!, fileName);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete image');
      }
      return true;
    });
  }, [token]);

  // Alias methods for compatibility
  const fetchBlogs = getAllBlogs;
  const getBlog = getBlogById;

  return {
    loading,
    error,
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    searchBlogs,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    // Alias methods for compatibility
    fetchBlogs,
    getBlog,
  };
};
