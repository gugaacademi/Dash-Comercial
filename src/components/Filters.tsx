'use client';

import { RNData, TASK_NAMES } from '@/lib/types';

export type FilterStatus = 'todos' | 'critico' | 'atencao' | 'bom';
export type SortOrder = 'padrao' | 'pior_melhor' | 'melhor_pior';

interface FiltersProps {
  rns: RNData[];
  statusFilter: FilterStatus;
  setStatusFilter: (s: FilterStatus) => void;
  rnFilter: string;
  setRnFilter: (s: string) => void;
  taskFilter: string;
  setTaskFilter: (s: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (s: SortOrder) => void;
}

export default function Filters({
  rns,
  statusFilter,
  setStatusFilter,
  rnFilter,
  setRnFilter,
  taskFilter,
  setTaskFilter,
  sortOrder,
  setSortOrder,
}: FiltersProps) {
  const statusOptions: { value: FilterStatus; label: string; emoji: string }[] = [
    { value: 'todos', label: 'Todos', emoji: '📋' },
    { value: 'critico', label: 'Críticos', emoji: '🔴' },
    { value: 'atencao', label: 'Atenção', emoji: '🟡' },
    { value: 'bom', label: 'Bons', emoji: '🟢' },
  ];

  const allCriticalTasks = new Set<string>();
  for (const rn of rns) {
    for (const t of rn.tasksCriticas) {
      allCriticalTasks.add(t);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Status filter buttons */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
          <div className="flex gap-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* RN filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">RN</label>
          <select
            value={rnFilter}
            onChange={(e) => setRnFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todos os RNs</option>
            {rns.map((rn) => (
              <option key={rn.setor} value={String(rn.setor)}>
                RN {rn.setor}
              </option>
            ))}
          </select>
        </div>

        {/* Task Crítica filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Task Crítica</label>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todas as Tasks</option>
            {TASK_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Ordenar</label>
          <div className="flex gap-1">
            {[
              { value: 'padrao'      as SortOrder, label: 'Padrão',         emoji: '↕️' },
              { value: 'pior_melhor' as SortOrder, label: 'Menor → Maior',  emoji: '📈' },
              { value: 'melhor_pior' as SortOrder, label: 'Maior → Menor',  emoji: '📉' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortOrder(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortOrder === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
