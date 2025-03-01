import React, { ReactNode, useState, useEffect } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  description?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  onClose?: () => void;
}

const variantClasses = {
  info: {
    container: 'bg-blue-50 border-blue-300 text-blue-800',
    icon: 'text-blue-400',
  },
  success: {
    container: 'bg-green-50 border-green-300 text-green-800',
    icon: 'text-green-400',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    icon: 'text-yellow-400',
  },
  error: {
    container: 'bg-red-50 border-red-300 text-red-800',
    icon: 'text-red-400',
  },
};

const defaultIcons = {
  info: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
  ),
  success: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
    </svg>
  ),
};

const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  description,
  icon,
  dismissible = true,
  autoClose = false,
  autoCloseTime = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const variantClass = variantClasses[variant];
  const iconToShow = icon || defaultIcons[variant];

  useEffect(() => {
    if (autoClose) {
      const timeout = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timeout);
    }
  }, [autoClose, autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`mb-4 flex w-full rounded-lg border p-4 ${variantClass.container}`} role="alert">
      <div className={`mr-3 inline-flex flex-shrink-0 items-center justify-center ${variantClass.icon}`}>
        {iconToShow}
      </div>
      <div className="ml-3 text-sm font-medium">
        <div className="font-medium">{message}</div>
        {description && <div className="mt-1">{description}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          className={`-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 hover:bg-gray-100 ${variantClass.icon}`}
          aria-label="Close"
          onClick={handleClose}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;