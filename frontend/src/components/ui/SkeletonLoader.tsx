// src/components/ui/SkeletonLoader.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-neutral-200/70 rounded-xl ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
    <div className="premium-card p-6 flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 premium-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-4 premium-card p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);
