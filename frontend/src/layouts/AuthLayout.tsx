import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[30rem] bg-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[20rem] bg-navy-700/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fadeInUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-red flex items-center justify-center font-extrabold text-white text-sm tracking-wider shadow-lg shadow-red/25 group-hover:shadow-red/40 transition-shadow">
              CA
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">CAR ADDA</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-navy-800 rounded-2xl border border-navy-700 p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-muted text-sm leading-relaxed">{subtitle}</p>}
          </div>

          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-muted/60 text-xs mt-6">
          CAR ADDA © {new Date().getFullYear()} — Professional Car Wash Management
        </p>
      </div>
    </div>
  );
}
