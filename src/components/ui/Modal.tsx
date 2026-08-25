import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, footer, className }: ModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn("relative w-full max-w-lg rounded-2xl bg-surface dark:bg-surface-dark p-6 shadow-xl", className)}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-text-muted dark:text-text-darkMuted"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        {(title || description) && (
          <div className="mb-6">
            {title && <h2 className="text-xl font-bold text-text dark:text-text-dark">{title}</h2>}
            {description && <p className="mt-1 text-sm text-text-muted dark:text-text-darkMuted">{description}</p>}
          </div>
        )}
        
        <div>{children}</div>
        
        {footer && (
          <div className="mt-6 flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
