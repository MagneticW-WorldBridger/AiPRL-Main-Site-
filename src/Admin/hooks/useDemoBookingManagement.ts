import { useState, useCallback } from 'react';
import { demoBookingApi } from '../../services/demoBookingApi';
import type { DemoBooking, DemoBookingStats, UpdateDemoBookingData } from '../../services/demoBookingApi';
import { useAdminAuth } from './useAdminAuth';

export const useDemoBookingManagement = () => {
  const { token } = useAdminAuth();
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DemoBookingStats | null>(null);

  // Fetch all demo bookings
  const fetchAllBookings = useCallback(async (status?: string, limit?: number) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await demoBookingApi.getAllDemoBookings(token, status, limit);
      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch demo booking by ID
  const fetchBookingById = useCallback(async (id: string): Promise<DemoBooking | null> => {
    if (!token) return null;
    
    try {
      const result = await demoBookingApi.getDemoBookingById(id, token);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch {
      setError('Failed to fetch booking details');
      return null;
    }
  }, [token]);

  // Update demo booking
  const updateBooking = useCallback(async (id: string, data: UpdateDemoBookingData): Promise<boolean> => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await demoBookingApi.updateDemoBooking(id, data, token);
      if (result.success) {
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking.id === id ? { ...booking, ...data, updatedAt: new Date().toISOString() } : booking
        ));
        return true;
      } else {
        setError(result.message || 'Failed to update booking');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Delete demo booking
  const deleteBooking = useCallback(async (id: string): Promise<boolean> => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await demoBookingApi.deleteDemoBooking(id, token);
      if (result.success) {
        // Remove from local state
        setBookings(prev => prev.filter(booking => booking.id !== id));
        return true;
      } else {
        setError(result.message || 'Failed to delete booking');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Search demo bookings
  const searchBookings = useCallback(async (query: string, status?: string): Promise<DemoBooking[]> => {
    if (!token) return [];
    
    try {
      const result = await demoBookingApi.searchDemoBookings(query, token, status);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch {
      setError('Search failed');
      return [];
    }
  }, [token]);

  // Get bookings by status
  const fetchBookingsByStatus = useCallback(async (status: string): Promise<DemoBooking[]> => {
    if (!token) return [];
    
    try {
      const result = await demoBookingApi.getDemoBookingsByStatus(status, token);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch {
      setError('Failed to fetch bookings by status');
      return [];
    }
  }, [token]);

  // Get demo booking statistics
  const fetchStats = useCallback(async () => {
    if (!token) return;
    
    try {
      const result = await demoBookingApi.getDemoBookingStats(token);
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch {
      setError('Failed to fetch statistics');
    }
  }, [token]);

  // Get recent bookings
  const fetchRecentBookings = useCallback(async (limit: number = 5): Promise<DemoBooking[]> => {
    if (!token) return [];
    
    try {
      const result = await demoBookingApi.getRecentDemoBookings(token, limit);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch {
      setError('Failed to fetch recent bookings');
      return [];
    }
  }, [token]);

  // Bulk update status
  const bulkUpdateStatus = useCallback(async (ids: string[], status: 'pending' | 'scheduled' | 'completed' | 'cancelled'): Promise<boolean> => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const promises = ids.map(id => demoBookingApi.updateDemoBooking(id, { status }, token));
      const results = await Promise.all(promises);
      
      const successCount = results.filter(result => result.success).length;
      
      if (successCount === ids.length) {
        // Update local state
        setBookings(prev => prev.map(booking => 
          ids.includes(booking.id) ? { ...booking, status, updatedAt: new Date().toISOString() } : booking
        ));
        return true;
      } else {
        setError(`Updated ${successCount} of ${ids.length} bookings`);
        return false;
      }
    } catch {
      setError('Bulk update failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Bulk delete
  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const promises = ids.map(id => demoBookingApi.deleteDemoBooking(id, token));
      const results = await Promise.all(promises);
      
      const successCount = results.filter(result => result.success).length;
      
      if (successCount === ids.length) {
        // Remove from local state
        setBookings(prev => prev.filter(booking => !ids.includes(booking.id)));
        return true;
      } else {
        setError(`Deleted ${successCount} of ${ids.length} bookings`);
        return false;
      }
    } catch {
      setError('Bulk delete failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    bookings,
    loading,
    error,
    stats,
    fetchAllBookings,
    fetchBookingById,
    updateBooking,
    deleteBooking,
    searchBookings,
    fetchBookingsByStatus,
    fetchStats,
    fetchRecentBookings,
    bulkUpdateStatus,
    bulkDelete,
    setError
  };
};
