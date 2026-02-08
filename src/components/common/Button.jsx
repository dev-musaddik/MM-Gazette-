import PropTypes from 'prop-types';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Enhanced Button Component with Artistic Effects - Bilingual
 * Reusable button with multiple variants, sizes, and artistic animations
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const { t } = useLanguage();
  
  const baseStyles = 'font-sans font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group';

  const variants = {
    primary: 'bg-primary-500 text-black font-bold hover:bg-white transition-all duration-300 shadow-neon-blue uppercase tracking-wider',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-black transition-colors uppercase tracking-wider',
    ghost: 'text-gray-400 hover:text-primary-500 hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-glow';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {/* Shimmer effect overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{t('loading')}</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* Artistic corner decorations */}
      {variant === 'primary' && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 bg-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
