// src/components/ui/EmptyState.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center rounded-2xl bg-white border border-dashed border-neutral-200/90 shadow-2xs space-y-4 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#faf9f8] border border-neutral-200/80 text-neutral-500 flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-6 h-6 text-neutral-600" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-neutral-900 tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="premium-btn-primary text-xs"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
