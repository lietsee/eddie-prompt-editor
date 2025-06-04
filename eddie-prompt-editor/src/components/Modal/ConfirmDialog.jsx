import React from 'react';
import { Button } from '../common/Button';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  confirmVariant = 'danger'
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-soft-lg border border-white/20 animate-slide-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-600 mb-6 leading-relaxed">{message}</p>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={confirmVariant} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}