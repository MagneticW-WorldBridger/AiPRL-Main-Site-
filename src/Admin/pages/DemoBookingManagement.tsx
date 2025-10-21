import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit
} from 'lucide-react';
import { useDemoBookingManagement } from '../hooks/useDemoBookingManagement';
import { DemoBookingCard } from '../components/DemoBookingCard';
import { DemoBookingDetailModal } from '../components/DemoBookingDetailModal';
import { useAdminTheme } from '../hooks/useAdminTheme';
import type { DemoBooking } from '../../services/demoBookingApi';

export const DemoBookingManagement: React.FC = () => {
  const { theme } = useAdminTheme();
  const {
    bookings,
    loading,
    error,
    stats,
    fetchAllBookings,
    updateBooking,
    deleteBooking,
    searchBookings,
    fetchStats,
    bulkUpdateStatus,
    bulkDelete
  } = useDemoBookingManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<DemoBooking | null>(null);

  useEffect(() => {
    fetchAllBookings();
    fetchStats();
  }, [fetchAllBookings, fetchStats]);

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.name.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.company.toLowerCase().includes(query) ||
        (booking.phone && booking.phone.toLowerCase().includes(query)) ||
        (booking.message && booking.message.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [bookings, statusFilter, searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchBookings(searchQuery, statusFilter !== 'all' ? statusFilter : undefined);
      // The search results will be handled by the filteredBookings logic
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'scheduled' | 'completed' | 'cancelled') => {
    await updateBooking(id, { status });
  };

  const handleEdit = (booking: DemoBooking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteBooking(id);
    }
  };

  const handleBulkStatusChange = async (status: 'pending' | 'scheduled' | 'completed' | 'cancelled') => {
    if (selectedBookings.length === 0) return;
    
    const success = await bulkUpdateStatus(selectedBookings, status);
    if (success) {
      setSelectedBookings([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBookings.length} bookings?`)) {
      const success = await bulkDelete(selectedBookings);
      if (success) {
        setSelectedBookings([]);
      }
    }
  };

  const handleSelectBooking = (id: string) => {
    setSelectedBookings(prev => 
      prev.includes(id) 
        ? prev.filter(bookingId => bookingId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };


  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-black'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Demo Bookings
          </h1>
          <p className={`mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Manage and track demo booking requests
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Total Bookings
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {stats.total}
                  </p>
                </div>
                <Calendar className={`w-8 h-8 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>

            <div className={`p-6 rounded-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Pending
                  </p>
                  <p className={`text-2xl font-bold text-orange-600`}>
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className={`p-6 rounded-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Scheduled
                  </p>
                  <p className={`text-2xl font-bold text-blue-600`}>
                    {stats.scheduled}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className={`p-6 rounded-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Completed
                  </p>
                  <p className={`text-2xl font-bold text-green-600`}>
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className={`p-6 rounded-lg border mb-6 ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                      : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border rounded-lg cursor-pointer ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    viewMode === 'grid'
                      ? theme === 'light'
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-600 text-white'
                      : theme === 'light'
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    viewMode === 'table'
                      ? theme === 'light'
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-600 text-white'
                      : theme === 'light'
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Table
                </button>
              </div>

              {/* Export Button */}
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${
                  theme === 'light' ? 'text-orange-800' : 'text-orange-200'
                }`}>
                  {selectedBookings.length} booking{selectedBookings.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusChange(e.target.value as any);
                        e.target.value = '';
                      }
                    }}
                    className={`text-sm px-3 py-1 border rounded cursor-pointer ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white'
                        : 'border-gray-600 bg-gray-800 text-white'
                    }`}
                  >
                    <option value="">Change Status</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className={`px-3 py-1 text-sm font-medium rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer`}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBookings([]);
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded cursor-pointer ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className={`ml-3 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Loading bookings...
            </span>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <>
            {filteredBookings.length === 0 ? (
              <div className={`text-center py-12 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No bookings found</p>
                <p>
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No demo bookings have been submitted yet'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Select all
                    </span>
                  </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="relative">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => handleSelectBooking(booking.id)}
                          className="absolute top-4 left-4 z-10 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <DemoBookingCard
                          booking={booking}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Table View */
                  <div className={`overflow-x-auto rounded-lg border ${
                    theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
                  }`}>
                    <table className="w-full">
                      <thead className={`${
                        theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                      }`}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preferred Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${
                        theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'
                      }`}>
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className={`hover:${
                            theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                          }`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedBookings.includes(booking.id)}
                                onChange={() => handleSelectBooking(booking.id)}
                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                  {booking.name}
                                </div>
                                <div className={`text-sm ${
                                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  {booking.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {booking.company}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(booking.status)}
                                <span className={`text-sm font-medium ${
                                  booking.status === 'pending' ? 'text-orange-600' :
                                  booking.status === 'scheduled' ? 'text-blue-600' :
                                  booking.status === 'completed' ? 'text-green-600' :
                                  'text-red-600'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {booking.preferredDate 
                                  ? new Date(booking.preferredDate).toLocaleDateString()
                                  : 'Not specified'
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(booking)}
                                  className={`cursor-pointer ${
                                    theme === 'light'
                                      ? 'text-orange-600 hover:text-orange-900'
                                      : 'text-orange-400 hover:text-orange-300'
                                  }`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(booking.id)}
                                  className={`cursor-pointer ${
                                    theme === 'light'
                                      ? 'text-red-600 hover:text-red-900'
                                      : 'text-red-400 hover:text-red-300'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Detail Modal */}
        <DemoBookingDetailModal
          booking={selectedBooking}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
          onSave={async (id, data) => {
            const success = await updateBooking(id, data);
            if (success) {
              setSelectedBooking(null);
              setShowDetailModal(false);
            }
            return success;
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};
