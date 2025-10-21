import React, { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Trash2, Download, Eye } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { useBlogManagement } from '../hooks/useBlogManagement';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export const MediaManagement: React.FC = () => {
  const { theme } = useAdminTheme();
  const { uploadImage } = useBlogManagement();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockMedia: MediaItem[] = [
      {
        id: '1',
        name: 'hero-image-1.jpg',
        url: '/api/placeholder/400/300',
        size: 1024000,
        type: 'image/jpeg',
        uploadedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'blog-banner.png',
        url: '/api/placeholder/600/400',
        size: 2048000,
        type: 'image/png',
        uploadedAt: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        name: 'profile-pic.webp',
        url: '/api/placeholder/300/300',
        size: 512000,
        type: 'image/webp',
        uploadedAt: '2024-01-13T09:20:00Z'
      }
    ];
    setMediaItems(mockMedia);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadImage(file);
        if (result) {
          const newItem: MediaItem = {
            id: Date.now().toString(),
            name: file.name,
            url: result.url,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          };
          setMediaItems(prev => [newItem, ...prev]);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      setMediaItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Media Library
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Manage your media files and assets
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
            isUploading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}>
            <Upload className="w-4 h-4 mr-2 inline" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Search and Controls */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
            
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                    : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white'
                  : theme === 'light'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-white/10'
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
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-white/10'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {filteredItems.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            No media files found
          </h3>
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Upload your first media file to get started
          </p>
        </div>
      ) : (
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group rounded-xl border transition-colors duration-200 ${
                    selectedItems.includes(item.id)
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : theme === 'light'
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-square rounded-t-xl overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-3">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {item.name}
                    </p>
                    <p className={`text-xs ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => window.open(item.url, '_blank')}
                        className={`p-1 rounded ${
                          theme === 'light'
                            ? 'bg-white/90 text-gray-700 hover:bg-white'
                            : 'bg-black/90 text-white hover:bg-black'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`p-1 rounded ${
                          theme === 'light'
                            ? 'bg-white/90 text-red-700 hover:bg-white'
                            : 'bg-black/90 text-red-400 hover:bg-black'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-4 p-3 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <div className="flex-1 font-medium text-sm text-gray-500">Name</div>
                <div className="w-24 font-medium text-sm text-gray-500">Size</div>
                <div className="w-32 font-medium text-sm text-gray-500">Type</div>
                <div className="w-40 font-medium text-sm text-gray-500">Uploaded</div>
                <div className="w-20 font-medium text-sm text-gray-500">Actions</div>
              </div>
              
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
                    selectedItems.includes(item.id)
                      ? 'bg-orange-500/10 border border-orange-500/20'
                      : theme === 'light'
                      ? 'hover:bg-gray-50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {item.name}
                    </p>
                  </div>
                  
                  <div className="w-24 text-sm text-gray-500">
                    {formatFileSize(item.size)}
                  </div>
                  
                  <div className="w-32 text-sm text-gray-500">
                    {item.type.split('/')[1].toUpperCase()}
                  </div>
                  
                  <div className="w-40 text-sm text-gray-500">
                    {formatDate(item.uploadedAt)}
                  </div>
                  
                  <div className="w-20 flex space-x-2">
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className={`p-1 rounded transition-colors duration-200 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        theme === 'light'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

