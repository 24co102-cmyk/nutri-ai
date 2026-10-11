// src/components/BackendStatusIndicator.tsx
import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, X } from 'lucide-react';

export const BackendStatusIndicator: React.FC = () => {
  const [isWaking, setIsWaking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleStatus = (e: any) => {
      const waking = !!e.detail?.waking;
      setIsWaking(waking);
      if (waking) {
        setDismissed(false);
      }
    };

    window.addEventListener('nutrilens:backend-status', handleStatus);
    return () => window.removeEventListener('nutrilens:backend-status', handleStatus);
  }, []);

  if (!isWaking || dismissed) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto transition-all animate-bounce-subtle">
      <div className="bg-neutral-900/95 backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-neutral-700/60 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Cloud className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="font-bold text-white tracking-tight">Waking Cloud Instance</p>
          <p className="text-[11px] text-neutral-300">Connecting to Render backend. Takes ~15–30s on first load.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          title="Reload"
          className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss"
          className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BackendStatusIndicator;
