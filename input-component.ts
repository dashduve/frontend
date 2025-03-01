import React, { useState, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconClick,
  fullWidth = false,
  variant = 'outlined',
  className = '',
  type = 'text',
  id,
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Generate ID if not provided
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9)}`;
  
  // Determine if this is a password field
  const isPassword = type === 'password';
  
  // Handle input type for password visibility
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  // Base classes for the input container
  let containerClasses = 'relative';
  if (fullWidth) containerClasses += ' w-full';
  
  // Base classes for the input
  let inputClasses = 'block w-full focus:outline-none';
  
  // Add variant-specific classes
  if (variant === 'outlined') {
    inputClasses += ' border rounded-md';
    inputClasses += focused 
      ? ' border-blue-500 ring-2 ring-blue-100' 
      : ' border-gray-300';
    inputClasses += ' bg-transparent';
  } else if (variant === 'filled') {
    inputClasses += ' border-0 rounded-t-md';
    inputClasses += focused 
      ? ' bg-blue-50 border-b-2 border-blue-500' 
      : ' bg-gray-100 border-b border-gray-300';
  } else { // standard
    inputClasses += ' border-0 border-b-2';
    inputClasses += focused 
      ? ' border-blue-500' 
      : ' border-gray-300';
    inputClasses += ' bg-transparent';
  }
  
  // Add error state classes
  if (error) {
    inputClasses = inputClasses.replace('border-blue-500', 'border-red-500');
    inputClasses = inputClasses.replace('ring-blue-100', 'ring-red-100');
  }
  
  // Add padding based on icons
  if (leftIcon && rightIcon) {
    inputClasses += ' pl-10 pr-10';
  } else if (leftIcon) {
    inputClasses += ' pl-10';
  } else if (rightIcon || isPassword) {
    inputClasses += ' pr-10';
  } else {
    inputClasses += ' px-4';
  }
  
  // Add vertical padding
  inputClasses += ' py-2';
  
  // Add disabled state
  if (rest.disabled) {
    inputClasses += ' bg-gray-100 text-gray-500 cursor-not-allowed';
  }
  
  // Add custom classes
  inputClasses += ` ${className}`;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block mb-1 text-sm font-medium ${
            error ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <span className="material-icons text-xl">{leftIcon}</span>
          </span>
        )}
        
        <input
          id={inputId}
          type={inputType}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={ref}
          {...rest}
        />
        
        {(rightIcon || isPassword) && (
          <span 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={isPassword ? () => setShowPassword(!showPassword) : onRightIconClick}
          >
            <span className="material-icons text-xl">
              {isPassword ? (showPassword ? 'visibility_off' : 'visibility') : rightIcon}
            </span>
          </span>
        )}
      </div>
      
      {(error || helper) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

export default Input;
