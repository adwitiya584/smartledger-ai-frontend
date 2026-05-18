import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const isDismissed = localStorage.getItem('pwa-dismissed');
    if (isDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-slide-up">
      <div className="glass rounded-2xl p-4 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl balance-gradient flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-xl">💎</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Add Paisa Nest to Home Screen</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Get quick access to your finances — works like a native app!
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 balance-gradient text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition"
              >
                <Download size={12} />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="text-slate-400 text-xs px-3 py-1.5 rounded-lg glass hover:text-white transition"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-600 hover:text-slate-400 transition flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;