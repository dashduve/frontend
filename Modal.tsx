import React, { ReactNode, useEffect, useRef } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Determinar el ancho basado en el tamaño
  const getWidth = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-4xl';
      case 'md':
      default: return 'max-w-2xl';
    }
  };

  // Cerrar el modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className={`relative ${getWidth()} mx-auto my-6 w-full`} ref={modalRef}>
        <div className="relative flex flex-col rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between rounded-t border-b border-gray-200 p-5">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              onClick={onClose}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">{children}</div>
          
          {/* Footer */}
          {footer ? (
            <div className="flex flex-shrink-0 flex-wrap items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-4">
              {footer}
            </div>
          ) : (
            <div className="flex flex-shrink-0 flex-wrap items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-4">
              <Button onClick={onClose} variant="secondary">Cerrar</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;