import { Receipt, Users, Package, IndianRupee, BarChart2, MessageCircle } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const FEATURES = [
  { icon: Receipt, title: 'Digital Billing', desc: 'Generate, print and share professional bills in seconds. Setup preset prices for easy tap-and-add.' },
  { icon: Users, title: 'Customer Management', desc: 'Auto-capture every customer and track their full service history based on their car number.' },
  { icon: Package, title: 'Inventory Tracking', desc: 'Monitor stock levels and get alerted before you run out. Stock deducts automatically on billing.' },
  { icon: IndianRupee, title: 'Expense Management', desc: 'Log every business cost and wages to know exactly where your hard-earned money goes.' },
  { icon: BarChart2, title: 'Reports & Analytics', desc: 'Beautiful daily and monthly sales charts with accurate net profit breakdown and top services.' },
  { icon: MessageCircle, title: 'WhatsApp Invoicing', desc: 'Send digital PDF bills directly to your customers via WhatsApp with just one single tap.' },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView();

  return (
    <section id="features" className="py-24 px-6 relative" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-red mb-2 block">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            One App. Every Tool You Need.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className={`flex flex-col gap-4 p-8 bg-navy-800 rounded-2xl border border-navy-700 hover:border-navy-600 transition-colors duration-300 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-red/10 border border-red/20 flex items-center justify-center mb-2 shadow-inner shadow-red/5">
                  <Icon className="text-red w-7 h-7" />
                </div>
                <h3 className="text-white font-bold text-xl">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
