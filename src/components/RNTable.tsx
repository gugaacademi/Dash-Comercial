'use client';

import { RNData } from '@/lib/types';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

interface RNTableProps {
  rns: RNData[];
  onSelectRN: (rn: RNData) => void;
}

export default function RNTable({ rns, onSelectRN }: RNTableProps) {
  if (rns.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500">
        Nenhum RN encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">RN</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Média</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progresso</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tasks Críticas</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rns.map((rn) => (
              <tr
                key={rn.setor}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectRN(rn)}
              >
                <td className="px-4 py-3">
                  <span className="font-bold text-gray-900">RN {rn.setor}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-bold tabular-nums ${
                    rn.media >= 100 ? 'text-emerald-600' : rn.media >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {rn.media}%
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[160px]">
                  <ProgressBar value={rn.media} showLabel={false} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={rn.status} />
                </td>
                <td className="px-4 py-3">
                  {rn.tasksCriticas.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {rn.tasksCriticas.map((task) => (
                        <span
                          key={task}
                          className="inline-block px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-md font-medium"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-emerald-600 text-sm font-medium">Nenhuma</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRN(rn);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                  >
                    Ver detalhes →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
