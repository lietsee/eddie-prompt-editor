import React from 'react';

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-200 to-primary-300 text-primary-900 hover:from-primary-300 hover:to-primary-400 focus:ring-primary-500 disabled:from-primary-100 disabled:to-primary-200 disabled:text-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-primary-300',
    secondary: 'bg-white text-secondary-700 border border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300 focus:ring-secondary-500 disabled:bg-secondary-100 disabled:text-secondary-400 shadow-md hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-200 to-red-300 text-red-900 hover:from-red-300 hover:to-red-400 focus:ring-red-500 disabled:from-red-100 disabled:to-red-200 disabled:text-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-red-300',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 focus:ring-secondary-500 disabled:text-secondary-400',
    accent: 'bg-gradient-to-r from-accent-200 to-accent-300 text-accent-900 hover:from-accent-300 hover:to-accent-400 focus:ring-accent-500 disabled:from-accent-100 disabled:to-accent-200 disabled:text-accent-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-accent-300',
  };
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm gap-1.5',
    medium: 'px-4 py-2.5 text-base gap-2',
    large: 'px-6 py-3 text-lg gap-2.5',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`;
  
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && iconPosition === 'left' && (
          <Icon className={`${size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={`${size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />
        )}
      </div>
    </button>
  );
}