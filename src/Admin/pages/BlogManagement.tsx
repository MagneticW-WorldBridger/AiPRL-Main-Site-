import React, { useEffect, useState } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { useBlogManagement, type BlogPost } from '../hooks/useBlogManagement';
import { BlogCard } from '../components/BlogCard';

export const BlogManagement: React.FC = () => {
  const { theme } = useAdminTheme();
  const { getAllBlogs, deleteBlog, updateBlog, loading, error } = useBlogManagement();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getAllBlogs(statusFilter || undefined);
      if (data) {
        setBlogs(data);
      }
    };

    fetchBlogs();
  }, [getAllBlogs, statusFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const success = await deleteBlog(id);
      if (success) {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const success = await updateBlog(id, { status: newStatus });
    if (success) {
      setBlogs(prev => prev.map(blog => 
        blog.id === id ? { ...blog, status: newStatus as 'draft' | 'published' } : blog
      ));
    }
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page
    window.location.href = `/admin/blogs/${id}`;
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Blog Management
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Manage your blog posts and content
          </p>
        </div>
        <a
          href="/admin/blogs/new"
          className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${
            theme === 'light'
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Blog
        </a>
      </div>

      {/* Filters and Search */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 bg-black/40 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 bg-black/40 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              }`}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white'
                  : theme === 'light'
                  ? 'text-gray-400 hover:text-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : theme === 'light'
                  ? 'text-gray-400 hover:text-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className={`mt-4 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Loading blogs...
          </p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'light' ? 'bg-gray-100' : 'bg-white/10'
          }`}>
            <Search className={`w-8 h-8 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            No blogs found
          </h3>
          <p className={`text-sm mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

