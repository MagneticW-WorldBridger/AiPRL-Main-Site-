// Demo Booking API Service

export interface DemoBooking {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  preferredDate?: string;
  preferredTime?: string;
  companySize?: string;
  referralSource?: string;
  adminNotes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoBookingStats {
  total: number;
  pending: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  thisMonth: number;
  thisWeek: number;
}

export interface CreateDemoBookingData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  companySize?: string;
  referralSource?: string;
}

export interface UpdateDemoBookingData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  preferredDate?: string;
  preferredTime?: string;
  companySize?: string;
  referralSource?: string;
  adminNotes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

class DemoBookingApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  }

  /**
   * Create a new demo booking (public)
   */
  async createDemoBooking(data: CreateDemoBookingData): Promise<{ success: boolean; data?: DemoBooking; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to create demo booking'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error creating demo booking:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get all demo bookings (admin only)
   */
  async getAllDemoBookings(token: string, status?: string, limit?: number): Promise<{ success: boolean; data?: DemoBooking[]; message?: string }> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch demo bookings'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching demo bookings:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get demo booking by ID (admin only)
   */
  async getDemoBookingById(id: string, token: string): Promise<{ success: boolean; data?: DemoBooking; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch demo booking'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching demo booking:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Update demo booking (admin only)
   */
  async updateDemoBooking(id: string, data: UpdateDemoBookingData, token: string): Promise<{ success: boolean; data?: DemoBooking; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to update demo booking'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error updating demo booking:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Delete demo booking (admin only)
   */
  async deleteDemoBooking(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to delete demo booking'
        };
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('Error deleting demo booking:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get demo bookings by status (admin only)
   */
  async getDemoBookingsByStatus(status: string, token: string): Promise<{ success: boolean; data?: DemoBooking[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/status/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch demo bookings by status'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching demo bookings by status:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Search demo bookings (admin only)
   */
  async searchDemoBookings(query: string, token: string, status?: string): Promise<{ success: boolean; data?: DemoBooking[]; message?: string }> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (status) params.append('status', status);

      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to search demo bookings'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error searching demo bookings:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get demo booking statistics (admin only)
   */
  async getDemoBookingStats(token: string): Promise<{ success: boolean; data?: DemoBookingStats; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch demo booking statistics'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching demo booking statistics:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get recent demo bookings (admin only)
   */
  async getRecentDemoBookings(token: string, limit: number = 5): Promise<{ success: boolean; data?: DemoBooking[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-bookings/admin/recent?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch recent demo bookings'
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching recent demo bookings:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }
}

export const demoBookingApi = new DemoBookingApiService();

