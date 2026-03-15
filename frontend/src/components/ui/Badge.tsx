import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide';
  
  const variants = {
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error:   'bg-error/10 text-error border border-error/20',
    default: 'bg-navy-700 text-muted border border-navy-600',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
