import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToInstall = () => {
    document.querySelector('#install')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-20 bg-navy">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(250,204,21,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-fadeInUp">
          <Badge variant="default" className="mb-6 bg-navy-800 border-navy-700 text-gold px-3 py-1">
            ✨ Professional Car Wash & Detailing Management
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Run Your Business From <span className="text-red">One Smart App</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            Generate bills, track customers, manage inventory, and view daily profits instantly. Built exclusively for Indian car washes and detailing studios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fadeInUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto text-base">
              Login to Dashboard
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToInstall} className="w-full sm:w-auto text-base">
              Install App ↓
            </Button>
          </div>
        </div>
        
        <div className="hidden lg:flex justify-center relative animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
           {/* Placeholder for dashboard mockup illustration */}
           <div className="w-[500px] h-[600px] bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden relative rotate-2">
             <div className="absolute top-0 w-full h-12 bg-navy-900 border-b border-navy-700 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-gold-500/20 border border-gold-500/50" />
               <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50" />
             </div>
             <div className="p-6 pt-16 grid grid-cols-2 gap-4">
               <div className="h-24 bg-navy-700/50 rounded-xl" />
               <div className="h-24 bg-navy-700/50 rounded-xl" />
               <div className="col-span-2 h-48 bg-navy-700/30 rounded-xl" />
               <div className="col-span-2 h-32 bg-navy-700/30 rounded-xl" />
             </div>
           </div>
           
           <div className="absolute -bottom-10 -left-10 w-64 h-80 bg-navy-900 rounded-3xl border border-navy-700 shadow-xl overflow-hidden -rotate-6 z-10 hidden xl:block">
             <div className="h-full w-full p-4 flex flex-col gap-3">
               <div className="h-8 w-32 bg-red/20 rounded-lg mb-2" />
               <div className="flex-1 rounded-xl border border-navy-600 border-dashed" />
             </div>
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })} className="p-2 text-muted hover:text-white transition-colors">
          <ChevronDown className="w-8 h-8 opacity-50" />
        </button>
      </div>
    </section>
  );
}
