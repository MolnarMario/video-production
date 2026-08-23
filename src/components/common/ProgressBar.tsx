import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showPercentage = false,
  className = '',
  animate = true,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const getGradientClass = (pct: number) => {
    if (pct === 100) return 'from-emerald-500 to-teal-400';
    if (pct >= 70) return 'from-sky-500 to-emerald-400';
    if (pct >= 35) return 'from-indigo-500 to-sky-400';
    return 'from-slate-400 to-indigo-500 dark:from-slate-600 dark:to-indigo-500';
  };

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-300/50 dark:border-slate-700/50 ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${getGradientClass(clamped)} rounded-full ${
            animate ? 'transition-all duration-300 ease-out' : ''
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 min-w-[36px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};
