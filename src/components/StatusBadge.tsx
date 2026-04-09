'use client';

import { getStatusEmoji, getStatusLabel } from '@/lib/types';

interface StatusBadgeProps {
  status: 'critico' | 'atencao' | 'bom';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const bgColor = {
    critico: 'bg-red-100 text-red-800 border-red-200',
    atencao: 'bg-amber-100 text-amber-800 border-amber-200',
    bom: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor}`}>
      {getStatusEmoji(status)} {getStatusLabel(status)}
    </span>
  );
}
