'use client';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 150);
  const displayWidth = Math.min(clampedValue, 100);

  const getColor = () => {
    if (value >= 100) return 'bg-emerald-500';
    if (value >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor()} progress-bar-animated transition-all`}
          style={{ width: `${displayWidth}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold w-12 text-right tabular-nums">
          {value}%
        </span>
      )}
    </div>
  );
}
