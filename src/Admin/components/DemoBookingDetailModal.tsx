import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save,
  AlertCircle
} from 'lucide-react';
import type { DemoBooking, UpdateDemoBookingData } from '../../services/demoBookingApi';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface DemoBookingDetailModalProps {
  booking: DemoBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateDemoBookingData) => Promise<boolean>;
  loading?: boolean;
}

export const DemoBookingDetailModal: React.FC<DemoBookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const { theme } = useAdminTheme();
  const [formData, setFormData] = useState<UpdateDemoBookingData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name,
        email: booking.email,
        company: booking.company,
        phone: booking.phone || '',
        message: booking.message || '',
        status: booking.status,
        preferredDate: booking.preferredDate || '',
        preferredTime: booking.preferredTime || '',
        companySize: booking.companySize || '',
        referralSource: booking.referralSource || '',
        adminNotes: booking.adminNotes || '',
        scheduledDate: booking.scheduledDate || '',
        scheduledTime: booking.scheduledTime || ''
      });
      setIsEditing(false);
      setErrors({});
    }
  }, [booking]);

  const handleInputChange = (field: keyof UpdateDemoBookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!booking || !validateForm()) return;

    const success = await onSave(booking.id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (booking) {
      setFormData({
        name: booking.name,
        email: booking.email,
        company: booking.company,
        phone: booking.phone || '',
        message: booking.message || '',
        status: booking.status,
        preferredDate: booking.preferredDate || '',
        preferredTime: booking.preferredTime || '',
        companySize: booking.companySize || '',
        referralSource: booking.referralSource || '',
        adminNotes: booking.adminNotes || '',
        scheduledDate: booking.scheduledDate || '',
        scheduledTime: booking.scheduledTime || ''
      });
      setIsEditing(false);
      setErrors({});
    }
  };

  if (!isOpen || !booking) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-lg shadow-xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Demo Booking Details
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-orange-900/20 text-orange-300 hover:bg-orange-900/30'
                }`}
              >
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    loading ? 'cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    theme === 'light'
                      ? 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300'
                      : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-800'
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'hover:bg-gray-100 text-gray-500'
                  : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Basic Information
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Name * <span className="text-xs text-gray-500">(User provided - read only)</span>
                </label>
                <p className={`text-sm px-3 py-2 border rounded-lg ${
                  theme === 'light' ? 'text-gray-900 bg-gray-50 border-gray-200' : 'text-white bg-gray-800 border-gray-700'
                }`}>
                  {booking.name}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Email * <span className="text-xs text-gray-500">(User provided - read only)</span>
                </label>
                <p className={`text-sm px-3 py-2 border rounded-lg ${
                  theme === 'light' ? 'text-gray-900 bg-gray-50 border-gray-200' : 'text-white bg-gray-800 border-gray-700'
                }`}>
                  {booking.email}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Company * <span className="text-xs text-gray-500">(User provided - read only)</span>
                </label>
                <p className={`text-sm px-3 py-2 border rounded-lg ${
                  theme === 'light' ? 'text-gray-900 bg-gray-50 border-gray-200' : 'text-white bg-gray-800 border-gray-700'
                }`}>
                  {booking.company}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Phone <span className="text-xs text-gray-500">(User provided - read only)</span>
                </label>
                <p className={`text-sm px-3 py-2 border rounded-lg ${
                  theme === 'light' ? 'text-gray-900 bg-gray-50 border-gray-200' : 'text-white bg-gray-800 border-gray-700'
                }`}>
                  {booking.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Booking Details
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Preferred Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.preferredDate || ''}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                ) : (
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {booking.preferredDate ? formatDate(booking.preferredDate) : 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Preferred Time
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.preferredTime || ''}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                ) : (
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {booking.preferredTime || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Company Size
                </label>
                {isEditing ? (
                  <select
                    value={formData.companySize || ''}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {booking.companySize || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Referral Source
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.referralSource || ''}
                    onChange={(e) => handleInputChange('referralSource', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                ) : (
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {booking.referralSource || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Message <span className="text-xs text-gray-500">(User provided - read only)</span>
            </label>
            <p className={`text-sm px-3 py-2 border rounded-lg ${
              theme === 'light' ? 'text-gray-900 bg-gray-50 border-gray-200' : 'text-white bg-gray-800 border-gray-700'
            }`}>
              {booking.message || 'No message provided'}
            </p>
          </div>

          {/* Admin Notes */}
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Admin Notes
            </label>
            {isEditing ? (
              <textarea
                value={formData.adminNotes || ''}
                onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    : 'border-gray-600 bg-gray-800 text-white focus:border-orange-500 focus:ring-orange-500'
                }`}
                placeholder="Add admin notes..."
              />
            ) : (
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {booking.adminNotes || 'No admin notes'}
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Created
                </p>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {formatDate(booking.createdAt)}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Last Updated
                </p>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {formatDate(booking.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
