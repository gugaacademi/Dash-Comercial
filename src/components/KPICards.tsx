'use client';

import { GVData } from '@/lib/types';

interface KPICardsProps {
  gv: GVData;
}

export default function KPICards({ gv }: KPICardsProps) {
  const cards = [
    {
      label: 'RNs Críticos',
      value: gv.totalCriticos,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
      icon: '🔴',
    },
    {
      label: 'RNs Atenção',
      value: gv.totalAtencao,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      icon: '🟡',
    },
    {
      label: 'RNs Bons',
      value: gv.totalBons,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      icon: '🟢',
    },
    {
      label: 'Média Geral',
      value: `${gv.mediaGeral}%`,
      color: gv.mediaGeral >= 100 ? 'bg-emerald-500' : gv.mediaGeral >= 80 ? 'bg-amber-500' : 'bg-red-500',
      bgLight: gv.mediaGeral >= 100 ? 'bg-emerald-50' : gv.mediaGeral >= 80 ? 'bg-amber-50' : 'bg-red-50',
      textColor: gv.mediaGeral >= 100 ? 'text-emerald-700' : gv.mediaGeral >= 80 ? 'text-amber-700' : 'text-red-700',
      icon: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bgLight} rounded-xl p-5 card-hover border border-transparent`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{card.label}</span>
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className={`text-3xl font-bold ${card.textColor}`}>{card.value}</div>
          <div className={`mt-3 h-1 rounded-full bg-gray-200`}>
            <div
              className={`h-full rounded-full ${card.color} progress-bar-animated`}
              style={{
                width: typeof card.value === 'number'
                  ? `${Math.min((card.value / gv.rns.length) * 100, 100)}%`
                  : `${Math.min(gv.mediaGeral, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
