/**
 * Input Component
 * Reusable form input with label and error message
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-primary-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 transition text-white placeholder-gray-500 ${
          error
            ? 'border-red-500 focus:ring-red-500/20'
            : 'border-white/10 focus:ring-primary-500/20 focus:border-primary-500'
        } ${disabled ? 'bg-white/5 cursor-not-allowed opacity-50' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
