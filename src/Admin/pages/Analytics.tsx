import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalBlogs: number;
  viewsGrowth: number;
  usersGrowth: number;
  blogsGrowth: number;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    growth: number;
  }>;
  monthlyViews: Array<{
    month: string;
    views: number;
  }>;
}

export const Analytics: React.FC = () => {
  const { theme } = useAdminTheme();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockData: AnalyticsData = {
      totalViews: 125430,
      totalUsers: 2840,
      totalBlogs: 156,
      viewsGrowth: 12.5,
      usersGrowth: 8.3,
      blogsGrowth: 15.2,
      topPosts: [
        { id: '1', title: 'Getting Started with AI', views: 15420, growth: 25.3 },
        { id: '2', title: 'Advanced React Patterns', views: 12890, growth: 18.7 },
        { id: '3', title: 'Building Scalable APIs', views: 11200, growth: 22.1 },
        { id: '4', title: 'Modern CSS Techniques', views: 9850, growth: 14.5 },
        { id: '5', title: 'Database Optimization', views: 8760, growth: 9.8 }
      ],
      monthlyViews: [
        { month: 'Jan', views: 8500 },
        { month: 'Feb', views: 9200 },
        { month: 'Mar', views: 10800 },
        { month: 'Apr', views: 12500 },
        { month: 'May', views: 14200 },
        { month: 'Jun', views: 15800 }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Failed to load analytics data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Analytics Dashboard
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Track your blog performance and user engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={`px-4 py-2 border rounded-xl transition-colors duration-200 ${
              theme === 'light'
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Total Views
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {formatNumber(analyticsData.totalViews)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Eye className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getGrowthIcon(analyticsData.viewsGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(analyticsData.viewsGrowth)}`}>
              {analyticsData.viewsGrowth}%
            </span>
            <span className={`ml-1 text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              vs last period
            </span>
          </div>
        </div>

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
                Total Users
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {formatNumber(analyticsData.totalUsers)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getGrowthIcon(analyticsData.usersGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(analyticsData.usersGrowth)}`}>
              {analyticsData.usersGrowth}%
            </span>
            <span className={`ml-1 text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              vs last period
            </span>
          </div>
        </div>

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
                Total Blogs
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {analyticsData.totalBlogs}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <BarChart3 className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getGrowthIcon(analyticsData.blogsGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(analyticsData.blogsGrowth)}`}>
              {analyticsData.blogsGrowth}%
            </span>
            <span className={`ml-1 text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              vs last period
            </span>
          </div>
        </div>

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
                Avg. Views/Post
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {formatNumber(Math.round(analyticsData.totalViews / analyticsData.totalBlogs))}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Per blog post
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Views Chart */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h3 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Monthly Views
          </h3>
          <div className="space-y-4">
            {analyticsData.monthlyViews.map((item, index) => (
              <div key={item.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-500">
                  {item.month}
                </div>
                <div className="flex-1">
                  <div className={`h-2 rounded-full ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
                  }`}>
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.views / Math.max(...analyticsData.monthlyViews.map(m => m.views))) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm font-medium text-right">
                  {formatNumber(item.views)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h3 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {analyticsData.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index < 3 
                    ? 'bg-orange-500 text-white' 
                    : theme === 'light'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {post.title}
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {formatNumber(post.views)} views
                  </p>
                </div>
                <div className="flex items-center">
                  {getGrowthIcon(post.growth)}
                  <span className={`ml-1 text-sm font-medium ${getGrowthColor(post.growth)}`}>
                    {post.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'New blog post published', time: '2 hours ago', type: 'publish' },
            { action: 'Blog post updated', time: '5 hours ago', type: 'update' },
            { action: 'New user registered', time: '1 day ago', type: 'user' },
            { action: 'Blog post published', time: '2 days ago', type: 'publish' },
            { action: 'Media file uploaded', time: '3 days ago', type: 'media' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'publish' ? 'bg-green-500' :
                activity.type === 'update' ? 'bg-blue-500' :
                activity.type === 'user' ? 'bg-purple-500' :
                'bg-orange-500'
              }`} />
              <div className="flex-1">
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {activity.action}
                </p>
                <p className={`text-xs ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

