// src/components/BackendStatusIndicator.tsx
import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, X } from 'lucide-react';

export const BackendStatusIndicator: React.FC = () => {
  const [isWaking, setIsWaking] = useState(false);
  const [justConnected, setJustConnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleStatus = (e: any) => {
      const waking = !!e.detail?.waking;
      if (waking) {
        setIsWaking(true);
        setJustConnected(false);
        setDismissed(false);
      } else if (isWaking) {
        setIsWaking(false);
        setJustConnected(true);
        setTimeout(() => setJustConnected(false), 2500);
      }
    };

    window.addEventListener('nutrilens:backend-status', handleStatus);
    return () => window.removeEventListener('nutrilens:backend-status', handleStatus);
  }, [isWaking]);

  if ((!isWaking && !justConnected) || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-neutral-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-neutral-700/60 flex items-center gap-2.5">
        {isWaking ? (
          <>
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Cloud className="w-3 h-3 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="font-semibold text-neutral-200 text-[11px] leading-tight">
                Connecting to cloud server...
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              title="Dismiss"
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <p className="font-semibold text-emerald-400 text-[11px]">
              Cloud Engine Connected
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BackendStatusIndicator;
