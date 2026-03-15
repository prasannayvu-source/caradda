import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-red text-white font-semibold hover:bg-red-600 focus-visible:ring-red",
    secondary: "bg-navy-700 border border-navy-600 text-white hover:bg-navy-600 hover:border-navy-500 focus-visible:ring-navy-600",
    outline: "bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 focus-visible:ring-white/50",
    ghost: "bg-transparent text-muted rounded-lg hover:bg-navy-700 hover:text-white focus-visible:ring-navy-700",
    destructive: "bg-red/10 border border-red/30 text-red font-semibold hover:bg-red hover:text-white hover:border-red focus-visible:ring-red",
  };

  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg font-bold",
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : children}
    </button>
  );
}
