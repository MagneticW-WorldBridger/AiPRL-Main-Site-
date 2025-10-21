// Public Blog API Service (no authentication required)

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tag: string;
  readingTime: string;
  heroImage?: string;
  status?: 'published' | 'draft';
  createdAt?: string;
}

class BlogApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  }

  /**
   * Fetch all published blog posts for public display
   */
  async getAllPublishedBlogs(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/blogs?status=published`);

      if (!response.ok) {
        console.error('Failed to fetch blogs:', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching published blogs:', error);
      return [];
    }
  }

  /**
   * Fetch a single blog post by ID or slug
   */
  async getBlogById(id: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/blogs/${id}`);

      if (!response.ok) {
        console.error('Failed to fetch blog:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  /**
   * Search blog posts by query
   */
  async searchBlogs(query: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/blogs/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        console.error('Failed to search blogs:', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  }
}

export const blogApi = new BlogApiService();
