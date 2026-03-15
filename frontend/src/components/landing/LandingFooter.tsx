import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function LandingFooter() {
  const navigate = useNavigate();
  
  const scrollTo = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-900 pt-16 pb-8 px-6 border-t border-navy-700">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 rounded-lg bg-red flex items-center justify-center font-bold text-white tracking-widest text-sm">
                CA
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">CAR ADDA</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              The complete professional management system exclusively built for car wash centers and auto detailing studios.
            </p>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white font-semibold text-base mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => navigate('/login')} className="text-muted hover:text-red transition-colors text-sm">
                  Dashboard Login
                </button>
              </li>
              <li>
                <a href="#services" onClick={(e) => scrollTo('#services', e)} className="text-muted hover:text-white transition-colors text-sm">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => scrollTo('#features', e)} className="text-muted hover:text-white transition-colors text-sm">
                  System Features
                </a>
              </li>
              <li>
                <a href="#install" onClick={(e) => scrollTo('#install', e)} className="text-muted hover:text-white transition-colors text-sm">
                  Install PWA App
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Stub Col */}
          <div>
            <h3 className="text-white font-semibold text-base mb-6">Need Support?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-muted text-sm items-start">
                <MapPin className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <span>Available nationwide.<br/>Contact us to list your shop.</span>
              </li>
              <li className="flex gap-3 text-muted text-sm items-center">
                <Phone className="w-4 h-4 text-white/50 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3 text-muted text-sm items-center">
                <Mail className="w-4 h-4 text-white/50 shrink-0" />
                <span>support@caradda.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted/60">
          <p>© {new Date().getFullYear()} CAR ADDA. All rights reserved.</p>
          <p>Powered by CAR ADDA Platform</p>
        </div>
      </div>
    </footer>
  );
}
