import React from 'react';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  Users, 
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import type { DemoBooking } from '../../services/demoBookingApi';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface DemoBookingCardProps {
  booking: DemoBooking;
  onEdit: (booking: DemoBooking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'scheduled' | 'completed' | 'cancelled') => void;
}

export const DemoBookingCard: React.FC<DemoBookingCardProps> = ({
  booking,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const { theme } = useAdminTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${
      theme === 'light' 
        ? 'bg-white border-gray-200 hover:border-gray-300' 
        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {booking.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {booking.company}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(booking)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                : 'hover:bg-gray-800 text-gray-400 hover:text-white'
            }`}
            title="Edit booking"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(booking.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'light'
                ? 'hover:bg-red-100 text-red-600 hover:text-red-700'
                : 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
            }`}
            title="Delete booking"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Mail className={`w-4 h-4 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <span className={`text-sm ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {booking.email}
          </span>
        </div>
        
        {booking.phone && (
          <div className="flex items-center gap-3">
            <Phone className={`w-4 h-4 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {booking.phone}
            </span>
          </div>
        )}
        
        {booking.companySize && (
          <div className="flex items-center gap-3">
            <Users className={`w-4 h-4 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {booking.companySize} employees
            </span>
          </div>
        )}
        
        {booking.referralSource && (
          <div className="flex items-center gap-3">
            <ExternalLink className={`w-4 h-4 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {booking.referralSource}
            </span>
          </div>
        )}
      </div>

      {/* Preferred Date & Time */}
      {(booking.preferredDate || booking.preferredTime) && (
        <div className="flex items-center gap-3 mb-4">
          <Calendar className={`w-4 h-4 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <div className="flex items-center gap-4">
            {booking.preferredDate && (
              <span className={`text-sm ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {formatDateOnly(booking.preferredDate)}
              </span>
            )}
            {booking.preferredTime && (
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {booking.preferredTime}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message */}
      {booking.message && (
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <MessageSquare className={`w-4 h-4 mt-0.5 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {booking.message}
            </p>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      {booking.adminNotes && (
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-4 h-4 mt-0.5 rounded-full ${
              theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'
            }`} />
            <div>
              <p className={`text-xs font-medium mb-1 ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-300'
              }`}>
                Admin Notes:
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {booking.adminNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Created: {formatDate(booking.createdAt)}
          </span>
          {booking.updatedAt !== booking.createdAt && (
            <span className={`text-xs ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Updated: {formatDate(booking.updatedAt)}
            </span>
          )}
        </div>
        
        {/* Status Change Dropdown */}
        <select
          value={booking.status}
          onChange={(e) => onStatusChange(booking.id, e.target.value as any)}
          className={`text-xs px-2 py-1 rounded border cursor-pointer ${
            theme === 'light'
              ? 'bg-white border-gray-300 text-gray-700'
              : 'bg-gray-800 border-gray-600 text-gray-300'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};
