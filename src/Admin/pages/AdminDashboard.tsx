import React, { useEffect, useState } from 'react';
import { FileText, Eye, EyeOff, TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { useBlogManagement } from '../hooks/useBlogManagement';
import type { BlogPost } from '../hooks/useBlogManagement';
import { useDemoBookingManagement } from '../hooks/useDemoBookingManagement';

export const AdminDashboard: React.FC = () => {
  const { theme } = useAdminTheme();
  const { getAllBlogs, loading } = useBlogManagement();
  const { fetchStats, fetchRecentBookings } = useDemoBookingManagement();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    thisMonth: 0,
  });
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getAllBlogs();
      if (data) {
        setBlogs(data);
        
        // Calculate stats
        const total = data.length;
        const published = data.filter(blog => blog.status === 'published').length;
        const drafts = data.filter(blog => blog.status === 'draft').length;
        
        // Count blogs created this month
        const thisMonth = data.filter(blog => {
          const blogDate = new Date(blog.createdAt);
          const now = new Date();
          return blogDate.getMonth() === now.getMonth() && 
                 blogDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({ total, published, drafts, thisMonth });
      }
    };

    const fetchBookingData = async () => {
      try {
        await fetchStats();
        const recentData = await fetchRecentBookings(5);
        
        if (recentData && recentData.length > 0) {
          setRecentBookings(recentData);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBlogs();
    fetchBookingData();
  }, [getAllBlogs, fetchStats, fetchRecentBookings]);

  const recentBlogs = blogs.slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-white border-gray-200'
        : 'bg-white/[0.03] border-white/10'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Dashboard
        </h1>
        <p className={`text-lg mt-2 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Welcome to your blog management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Blogs"
          value={stats.total}
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={<Eye className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Drafts"
          value={stats.drafts}
          icon={<EyeOff className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="This Month"
          value={stats.thisMonth}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Demo Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={bookingStats.total}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Pending"
          value={bookingStats.pending}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Scheduled"
          value={bookingStats.scheduled}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={bookingStats.completed}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
      </div>

      {/* Recent Blogs */}
      <div className={`rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className={`text-xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Recent Blogs
          </h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className={`mt-2 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Loading blogs...
              </p>
            </div>
          ) : recentBlogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`text-lg ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                No blogs yet
              </p>
              <p className={`text-sm mt-2 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Create your first blog post to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                    theme === 'light'
                      ? 'hover:bg-gray-50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {blog.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {blog.author}
                      </span>
                      <span className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Demo Bookings */}
      <div className={`rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className={`text-xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Recent Demo Bookings
          </h2>
        </div>
        
        <div className="p-6">
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`text-lg ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                No demo bookings yet
              </p>
              <p className={`text-sm mt-2 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Demo bookings will appear here when customers submit them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                    theme === 'light'
                      ? 'hover:bg-gray-50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {booking.name}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {booking.company} • {booking.email}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                      {booking.preferredDate && (
                        <span className={`text-xs ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Preferred: {new Date(booking.preferredDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

