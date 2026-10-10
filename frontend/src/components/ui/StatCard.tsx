// src/components/ui/StatCard.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: {
    text: string;
    type?: 'success' | 'warning' | 'info' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-600',
  iconBg = 'bg-emerald-50 border-emerald-200/80',
  badge,
  onClick,
  className = '',
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-neutral-500">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-[11px] font-medium text-neutral-500 truncate">
              {subtitle}
            </span>
          )}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                badgeStyles[badge.type || 'neutral']
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
