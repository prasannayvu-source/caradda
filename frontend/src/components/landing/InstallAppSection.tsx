import { useInView } from '../../hooks/useInView';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';
import { Smartphone, Zap, CloudOff, Download, Info } from 'lucide-react';

export default function InstallAppSection() {
  const { ref, inView } = useInView();
  const { canInstall, installApp, isInstalled, isIOS } = usePWAInstall();

  return (
    <section id="install" className="py-24 px-6 overflow-hidden" ref={ref}>
      <div className="container mx-auto">
        <div className={`bg-navy-800 rounded-[2.5rem] border border-navy-700 overflow-hidden relative ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
          {/* Subtle glowing orb inside the card */}
          <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-red/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 lg:p-20 items-center relative z-10">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 border border-navy-600 flex items-center justify-center mb-8 shadow-inner shadow-white/5">
                <Download className="w-6 h-6 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                Install CAR ADDA on <span className="text-gold">Your Phone</span>
              </h2>
              <p className="text-lg text-muted mb-10 leading-relaxed max-w-lg">
                No app store needed. Add CAR ADDA directly to your home screen for instant access — works exactly like a native app.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">Add to Home Screen</h4>
                    <p className="text-muted text-sm mt-1">Works beautifully on Android and iOS Safari.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">App-Like Experience</h4>
                    <p className="text-muted text-sm mt-1">Full screen, no browser bar, extremely fast launch.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center shrink-0">
                    <CloudOff className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">Always Ready</h4>
                    <p className="text-muted text-sm mt-1">Access your business data even with flaky internet.</p>
                  </div>
                </div>
              </div>

              <div>
                {isInstalled ? (
                  <Button variant="secondary" size="lg" disabled className="w-full sm:w-auto text-white/50 border-navy-600">
                    Already Installed ✓
                  </Button>
                ) : canInstall ? (
                  <Button variant="primary" size="lg" onClick={installApp} className="w-full sm:w-auto">
                    Install App Now
                  </Button>
                ) : isIOS ? (
                  <div className="bg-navy-900/80 rounded-xl p-4 border border-navy-700 flex gap-3 text-sm text-muted">
                    <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-medium block mb-1">How to install on iPhone/iPad:</strong>
                      Tap the <strong className="text-white font-medium">Share</strong> button in Safari, then scroll down and tap <strong className="text-white font-medium">Add to Home Screen</strong>.
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => window.alert('Install via your browser menu: Add to Home screen')}>
                    Install from Browser Menu
                  </Button>
                )}
              </div>
            </div>

            {/* Illustration side */}
            <div className="hidden lg:flex justify-center items-center">
               <div className="w-[300px] h-[600px] bg-navy-900 rounded-[3rem] border-8 border-navy-700 shadow-2xl relative overflow-hidden flex flex-col pt-8 px-4 justify-between -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-navy-700 rounded-b-xl rounded-t-sm z-20" /> {/* Notch */}
                  <div className="w-full h-full bg-navy-800 rounded-2xl flex flex-col overflow-hidden relative border border-navy-700/50">
                    <div className="h-48 bg-gradient-to-b from-navy-700 p-4">
                      <div className="flex justify-between items-start">
                         <div className="w-10 h-10 bg-red rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">CA</div>
                         <div className="w-8 h-8 rounded-full bg-navy-600" />
                      </div>
                      <div className="mt-8 space-y-2">
                         <div className="h-6 w-3/4 bg-white/10 rounded-md" />
                         <div className="h-4 w-1/2 bg-white/5 rounded-md" />
                      </div>
                    </div>
                    <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">
                       <div className="w-full aspect-square bg-navy-700/50 rounded-xl" />
                       <div className="w-full aspect-square bg-navy-700/50 rounded-xl" />
                       <div className="col-span-2 h-20 bg-navy-700/50 rounded-xl" />
                    </div>
                    {/* Add to home screen toast mockup */}
                    <div className="absolute bottom-6 left-4 right-4 bg-navy-700/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3 animate-pulse">
                       <div className="w-10 h-10 bg-red rounded-xl shrink-0" />
                       <div className="flex-1">
                          <div className="h-3 w-20 bg-white/80 rounded mb-1" />
                          <div className="h-2 w-full bg-white/40 rounded" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
