import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const typeConfig = {
    info: {
      bgClasses: 'bg-gradient-to-r from-primary-500 to-primary-600',
      icon: InformationCircleIcon,
      borderClasses: 'border-primary-200',
    },
    success: {
      bgClasses: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: CheckCircleIcon,
      borderClasses: 'border-green-200',
    },
    warning: {
      bgClasses: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      icon: ExclamationTriangleIcon,
      borderClasses: 'border-yellow-200',
    },
    error: {
      bgClasses: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: XCircleIcon,
      borderClasses: 'border-red-200',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.icon;

  const baseClasses = `flex items-start p-4 rounded-xl shadow-soft-lg backdrop-blur-sm border text-white transition-all duration-300 animate-slide-up ${
    isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'
  }`;

  return (
    <div className={`${baseClasses} ${config.bgClasses} ${config.borderClasses}`}>
      <div className="flex-shrink-0 mr-3">
        <IconComponent className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-3 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-1 transition-colors"
        aria-label="閉じる"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}