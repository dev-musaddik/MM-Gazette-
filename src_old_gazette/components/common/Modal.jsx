import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Modal Component
 * Reusable modal with backdrop and close button
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative bg-black/90 rounded-xl border border-white/10 shadow-neon-blue ${sizes[size]} w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white text-glow">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
