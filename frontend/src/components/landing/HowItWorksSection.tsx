import { useInView } from '../../hooks/useInView';
import { FileText, Users, Package, TrendingUp } from 'lucide-react';

const STEPS = [
  { num: '01', icon: FileText, title: 'Create a Bill', desc: 'Select services, enter customer details and car number. Bill is generated instantly.' },
  { num: '02', icon: Users, title: 'Track Customers', desc: 'Every customer is saved automatically. View full history with one tap.' },
  { num: '03', icon: Package, title: 'Manage Inventory', desc: 'Stock is deducted automatically when a service is completed. Get alerts when running low.' },
  { num: '04', icon: TrendingUp, title: 'View Reports', desc: 'See daily and monthly sales, expense breakdown, and net profit at a glance.' },
];

export default function HowItWorksSection() {
  const { ref, inView } = useInView();

  return (
    <section id="how-it-works" className="py-32 px-6 bg-navy-800/50 border-y border-navy-800" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-red mb-2 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Simple Enough for Anyone.<br/>Powerful Enough for Business.
          </h2>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[27px] left-[10%] right-[10%] h-[2px] bg-navy-700 -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.num}
                  className={`relative flex flex-col items-center text-center ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-red flex items-center justify-center text-white font-bold text-xl mb-6 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-4 ring-navy z-10">
                    {step.num}
                  </div>
                  
                  <div className="bg-navy-800/80 p-6 rounded-2xl border border-navy-700 w-full flex-1 flex flex-col items-center hover:border-navy-600 transition-colors">
                    <Icon className="text-gold w-8 h-8 mb-4" />
                    <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
