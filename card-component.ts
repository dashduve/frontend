import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  headerAction,
  className = '',
  noPadding = false,
  bordered = true,
  hoverable = false,
  onClick,
}) => {
  // Base classes
  let cardClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Add shadow
  cardClasses += ' shadow-md';
  
  // Add border if needed
  if (bordered) {
    cardClasses += ' border border-gray-200';
  }
  
  // Add hover effect if needed
  if (hoverable) {
    cardClasses += ' transition-transform duration-200 hover:shadow-lg hover:-translate-y-1';
  }
  
  // Add cursor pointer if onClick provided
  if (onClick) {
    cardClasses += ' cursor-pointer';
  }
  
  // Add custom classes
  cardClasses += ` ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Card Header */}
      {(title || subtitle || icon || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            {icon && (
              <span className="material-icons text-gray-500 mr-3">{icon}</span>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="ml-4">{headerAction}</div>
          )}
        </div>
      )}
      
      {/* Card Content */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
