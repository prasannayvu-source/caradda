import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`bg-navy-800 rounded-2xl border border-navy-700 p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
