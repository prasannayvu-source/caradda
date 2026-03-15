import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-navy min-h-screen text-white font-sans overflow-x-hidden">
      <LandingNavbar />
      <main className="w-full">{children}</main>
      <LandingFooter />
    </div>
  );
}
