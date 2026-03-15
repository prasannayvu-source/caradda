import { X, Smartphone, Download } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function InstallPromptBanner() {
  const { canInstall, installApp, isIOS } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!canInstall && !isIOS)) return null;

  return (
    <div className="
      fixed bottom-0 left-0 right-0 z-50
      bg-navy-800 border-t border-navy-700
      px-4 py-3 safe-area-inset-bottom
      flex items-center gap-3
      animate-slideUp
    ">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center flex-shrink-0">
        <Smartphone className="w-5 h-5 text-red" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Install CAR ADDA</p>
        <p className="text-muted text-xs mt-0.5">
          {isIOS
            ? 'Tap Share → Add to Home Screen'
            : 'Add to your home screen for offline access'}
        </p>
      </div>

      {/* Install / Dismiss */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isIOS && canInstall && (
          <button
            onClick={() => { installApp(); setDismissed(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red text-white rounded-xl text-xs font-semibold hover:bg-red-600 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-navy-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
