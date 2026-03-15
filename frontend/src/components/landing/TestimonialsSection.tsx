import { useInView } from '../../hooks/useInView';

const TESTIMONIALS = [
  {
    quote: "Earlier I used to write bills in a register. Now I generate, print and WhatsApp the bill in under 30 seconds.",
    author: "Ravi S.",
    role: "Owner, Ravi Car Wash, Pune",
    rating: 5
  },
  {
    quote: "The inventory alerts saved us twice last month. We never ran out of shampoo mid-day again.",
    author: "Kiran P.",
    role: "Owner, Clean Auto Studio, Mumbai",
    rating: 5
  },
  {
    quote: "I can see the monthly profit from my phone anytime. No more guessing if the business is doing well.",
    author: "Suresh M.",
    role: "Owner, Star Detailing, Nagpur",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="testimonials" className="py-24 px-6 bg-navy-900/30" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-red mb-2 block">
            What Shop Owners Say
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Built for Real Car Wash Businesses
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-hidden md:pb-0 hide-scrollbar">
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={t.author}
              className={`snap-start min-w-[300px] w-full bg-navy-800 rounded-2xl p-8 border border-navy-700 flex flex-col gap-6 hover:border-navy-600 hover:-translate-y-1 transition-all duration-300 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, idx) => (
                  <svg key={idx} className="w-5 h-5 text-gold fill-gold" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 text-base leading-relaxed italic flex-1">"{t.quote}"</p>
              <div>
                <p className="text-white font-bold text-base">{t.author}</p>
                <p className="text-muted text-sm mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
