import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import Button from '../common/Button';

/**
 * ImageUploader Component
 * Handles image upload with drag-and-drop support and preview
 */
const ImageUploader = ({ onImageUpload, currentImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(file, reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-64 object-contain bg-gray-100 rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, GIF, WEBP (Max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
