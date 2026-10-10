// src/components/ui/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color?: string; // Tailwind color class e.g. bg-emerald-500
  showPercent?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  target,
  unit = 'g',
  color = 'bg-emerald-500',
  showPercent = true,
  className = '',
}) => {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-700">{label}</span>
        <div className="flex items-center gap-1.5 text-neutral-500">
          <span className="font-bold text-neutral-900">{current}</span>
          <span>/</span>
          <span>{target}{unit}</span>
          {showPercent && (
            <span className="font-semibold text-neutral-400 text-[10px]">
              ({percent}%)
            </span>
          )}
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
