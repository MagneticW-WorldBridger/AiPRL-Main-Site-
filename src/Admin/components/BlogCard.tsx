import React from 'react';
import { Calendar, Clock, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { BlogPost } from '../hooks/useBlogManagement';

interface BlogCardProps {
  blog: BlogPost;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  const { theme } = useAdminTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-lg ${
      theme === 'light'
        ? 'border-gray-200 bg-white hover:border-gray-300'
        : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
    }`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          blog.status === 'published'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {blog.status === 'published' ? (
            <Eye className="w-3 h-3 mr-1" />
          ) : (
            <EyeOff className="w-3 h-3 mr-1" />
          )}
          {blog.status}
        </span>
      </div>

      {/* Hero Image */}
      {blog.heroImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.heroImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        {/* Tag */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-500 mb-3">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          {blog.tag}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className={`text-sm mb-4 line-clamp-3 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime}
            </span>
          </div>
          <span>{blog.author}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(blog.id)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'light'
                  ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
              title="Edit blog"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(blog.id)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'light'
                  ? 'hover:bg-red-100 text-red-600 hover:text-red-900'
                  : 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
              }`}
              title="Delete blog"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onToggleStatus(blog.id, blog.status)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 ${
              blog.status === 'published'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

