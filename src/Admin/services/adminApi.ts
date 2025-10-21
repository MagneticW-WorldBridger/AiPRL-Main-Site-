import { config } from '../utils/config';

const API_BASE_URL = config.backendUrl;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class AdminApi {
  private getAuthHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Auth methods
  async login(password: string, firebaseToken: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, firebaseToken }),
    });

    return await response.json();
  }

  async verifyToken(token: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return await response.json();
  }

  // Blog methods
  async getAllBlogs(token: string, status?: string): Promise<ApiResponse> {
    const url = status ? `${API_BASE_URL}/api/blogs/admin/all?status=${status}` : `${API_BASE_URL}/api/blogs/admin/all`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(token),
    });

    return await response.json();
  }

  async getBlogById(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
    return await response.json();
  }

  async createBlog(token: string, blogData: any): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/admin`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(blogData),
    });

    return await response.json();
  }

  async updateBlog(token: string, id: string, blogData: any): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/admin/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(blogData),
    });

    return await response.json();
  }

  async deleteBlog(token: string, id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/admin/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    return await response.json();
  }

  async searchBlogs(query: string, status?: string): Promise<ApiResponse> {
    const url = new URL(`${API_BASE_URL}/api/blogs/search`);
    url.searchParams.append('q', query);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await fetch(url.toString());
    return await response.json();
  }

  // Upload methods
  async uploadImage(token: string, file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  }

  async uploadMultipleImages(token: string, files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  }

  async deleteImage(token: string, fileName: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/upload/image/${fileName}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    return await response.json();
  }
}

export const adminApi = new AdminApi();
export default adminApi;
