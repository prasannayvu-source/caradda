import { useInView } from '../../hooks/useInView';

const SERVICES = [
  { icon: '🫧', name: 'Normal Wash', desc: 'Quick exterior wash & basic cleaning' },
  { icon: '✨', name: 'Premium Wash', desc: 'Full exterior foam + interior deep cleaning' },
  { icon: '🎨', name: 'Painting Services', desc: 'Banner, fender, door & full car painting' },
  { icon: '🔩', name: 'Car Accessories', desc: 'Premium fixtures and accessories fitting' },
  { icon: '🔨', name: 'Denting & Tinkering', desc: 'Expert body dent repair and panel work' },
  { icon: '🏺', name: 'Ceramic Coating', desc: 'Long-lasting protective ceramic finish' },
  { icon: '🛡️', name: 'PPF Protection', desc: 'Paint Protection Film installation' },
  { icon: '🛋️', name: 'Interior Detailing', desc: 'Deep clean, conditioning & fragrance' },
];

export default function ServicesSection() {
  const { ref, inView } = useInView();

  return (
    <section id="services" className="py-24 px-6 relative bg-navy-900/50" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-red mb-2 block">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Everything Your Shop Offers, Managed Digitally.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service, i) => (
            <div 
              key={service.name}
              className={`bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-red hover:-translate-y-1 transition-all duration-300 cursor-default group ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl mb-5 block grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 origin-bottom-left">
                {service.icon}
              </span>
              <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
              <p className="text-muted text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
