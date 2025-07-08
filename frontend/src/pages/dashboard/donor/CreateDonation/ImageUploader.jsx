import React, { useState } from 'react';
import { PhotographIcon, XCircleIcon } from '@heroicons/react/outline';
import axios from 'axios';

// Define constants properly from environment variables
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ;

const ImageUploader = ({ onChange }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('You can only upload a maximum of 5 images');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Process files one by one instead of Promise.all to better identify issues
      const newImages = [];
      for (const file of files) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds 5MB size limit`);
        }

        console.log('Uploading to Cloudinary with preset:', UPLOAD_PRESET);
        console.log('Cloud name:', CLOUD_NAME);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('timestamp', Math.floor(Date.now() / 1000));
        
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData,
          {
            withCredentials: false,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log('Cloudinary response:', response.data);
        
        newImages.push({
          url: response.data.secure_url,
          public_id: response.data.public_id
        });
      }
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onChange(updatedImages);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Cloudinary error response:', error.response.data);
      }
      
      setError(
        error.message || 
        error.response?.data?.error?.message || 
        'Failed to upload images. Please verify your upload preset and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Food Images (Max 5)
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/5 images uploaded
        </span>
      </div>

      {/* Image preview area */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image.url} 
                alt={`Food ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white p-0.5"
                onClick={() => removeImage(index)}
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < 5 && (
        <div className="mt-2">
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors"
          >
            <div className="space-y-1 text-center">
              <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">
                  Click to upload
                </span>{' '}
                or drag and drop
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>
            <input
              id="image-upload"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
              disabled={loading || images.length >= 5}
            />
          </label>
        </div>
      )}
      
      {loading && <p className="text-sm text-gray-500">Uploading images...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;