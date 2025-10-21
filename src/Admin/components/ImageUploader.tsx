import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  onRemove,
  currentImage,
  className = ''
}) => {
  const { theme } = useAdminTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragOver
              ? 'border-orange-500 bg-orange-50'
              : theme === 'light'
              ? 'border-gray-300 bg-gray-50'
              : 'border-white/20 bg-white/[0.02]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${
              theme === 'light' ? 'bg-gray-100' : 'bg-white/10'
            }`}>
              <ImageIcon className={`w-8 h-8 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            
            <div>
              <p className={`text-lg font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Drop an image here
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                or click to browse
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
            />
            
            <label
              htmlFor="image-upload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Choose Image
            </label>

            <p className={`text-xs ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

