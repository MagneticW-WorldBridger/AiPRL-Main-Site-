import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { useBlogManagement } from '../hooks/useBlogManagement';
import { ImageUploader } from '../components/ImageUploader';

export const CreateBlog: React.FC = () => {
  const { theme } = useAdminTheme();
  const { createBlog, uploadImage, loading } = useBlogManagement();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    tag: '',
    readingTime: '',
    heroImage: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      facebook: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImage(file);
      if (result) {
        setFormData(prev => ({
          ...prev,
          heroImage: result.url
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      heroImage: ''
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.tag.trim()) newErrors.tag = 'Tag is required';
    if (!formData.readingTime.trim()) newErrors.readingTime = 'Reading time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const blogData = {
        ...formData,
        date: new Date().toISOString(),
        status: 'draft' as const
      };
      
      await createBlog(blogData);
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/blogs')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Create New Blog
            </h1>
            <p className={`text-lg mt-2 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Write and publish a new blog post
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-white/20 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            Preview
          </button>
          <button
            type="submit"
            form="blog-form"
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  errors.title
                    ? 'border-red-500'
                    : theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  errors.author
                    ? 'border-red-500'
                    : theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="Author name"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Tag *
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  errors.tag
                    ? 'border-red-500'
                    : theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="e.g., Technology, Business"
              />
              {errors.tag && (
                <p className="text-red-500 text-sm mt-1">{errors.tag}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Reading Time *
              </label>
              <input
                type="text"
                name="readingTime"
                value={formData.readingTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  errors.readingTime
                    ? 'border-red-500'
                    : theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="e.g., 5 min read"
              />
              {errors.readingTime && (
                <p className="text-red-500 text-sm mt-1">{errors.readingTime}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              placeholder="Brief description of the blog post"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Hero Image
          </h2>
          <ImageUploader
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
            currentImage={formData.heroImage}
          />
        </div>

        {/* Content */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Content *
          </h2>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
              errors.content
                ? 'border-red-500'
                : theme === 'light'
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            placeholder="Write your blog content here..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Social Links */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Social Links
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Twitter
              </label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                LinkedIn
              </label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Facebook
              </label>
              <input
                type="url"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
                placeholder="https://facebook.com/username"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

