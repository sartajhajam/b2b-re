import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  // Added transform and scale animations
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none tracking-wide transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer';

  const variants = {
    primary: 'bg-accent text-primary hover:bg-[#D4AF37] hover:shadow-lg focus:ring-accent shadow-md',
    secondary: 'bg-primary text-surface hover:bg-slate-800 hover:shadow-lg focus:ring-primary',
    outline: 'border border-border text-text-main hover:border-accent hover:text-primary bg-transparent focus:ring-accent hover:bg-gray-50',
    ghost: 'text-text-muted hover:text-primary hover:bg-gray-100',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
