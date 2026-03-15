import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useInView';

export default function CallToActionSection() {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  return (
    <section className="py-24 px-6 relative overflow-hidden border-t border-gold/10" ref={ref}>
      {/* Full width dark red gradient overlay */}
      <div className="absolute inset-0 bg-navy z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
      
      <div className={`container mx-auto text-center relative z-10 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Ready to Digitise Your Car Wash Business?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto font-medium">
          Join shop owners already saving hours every single week. Start managing better today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto px-10">
            Login to Dashboard
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.querySelector('#install')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-10">
            Install App
          </Button>
        </div>
        
        <div className="mt-12">
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2 group">
             Learn More 
             <span className="group-hover:-translate-y-1 transition-transform inline-block">↑</span>
           </button>
        </div>
      </div>
    </section>
  );
}
