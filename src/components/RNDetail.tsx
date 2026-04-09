'use client';

import { RNData, TASK_NAMES, getStatusEmoji, getStatusLabel } from '@/lib/types';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

interface RNDetailProps {
  rn: RNData;
  onBack: () => void;
}

export default function RNDetail({ rn, onBack }: RNDetailProps) {
  const sortedTasks = [...TASK_NAMES].sort((a, b) => {
    const aVal = rn.tasks[a]?.status === 'sem_dados' ? 999 : (rn.tasks[a]?.percentual ?? 0);
    const bVal = rn.tasks[b]?.status === 'sem_dados' ? 999 : (rn.tasks[b]?.percentual ?? 0);
    return aVal - bVal;
  });

  const tasksNeedAction = TASK_NAMES.filter(
    (name) => rn.tasks[name] && rn.tasks[name].status !== 'sem_dados' && rn.tasks[name].percentual < 100
  ).sort((a, b) => (rn.tasks[a]?.percentual ?? 0) - (rn.tasks[b]?.percentual ?? 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">RN {rn.setor}</h2>
          <StatusBadge status={rn.status} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Média Geral</div>
          <div className={`text-3xl font-bold ${
            rn.media >= 100 ? 'text-emerald-600' : rn.media >= 80 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {rn.media}%
          </div>
          <ProgressBar value={rn.media} showLabel={false} />
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Status</div>
          <div className="text-3xl mb-1">{getStatusEmoji(rn.status)}</div>
          <div className="text-sm font-semibold">{getStatusLabel(rn.status)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Tasks Críticas</div>
          <div className="text-3xl font-bold text-red-600">{rn.tasksCriticas.length}</div>
          <div className="text-sm text-gray-500">de {TASK_NAMES.length} tarefas</div>
        </div>
      </div>

      {/* Task Detail Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Detalhamento por Tarefa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tarefa</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Meta</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Real</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">%</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Progresso</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">GAP</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TASK_NAMES.map((name) => {
                const task = rn.tasks[name];
                if (!task) return null;
                const semDados = task.status === 'sem_dados';
                return (
                  <tr key={name} className={`transition-colors ${semDados ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {name}
                      {semDados && <span className="ml-2 text-xs text-gray-400 italic">sem visibilidade</span>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-400">
                      {semDados ? '—' : task.meta.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-400">
                      {semDados ? '—' : task.real.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {semDados ? (
                        <span className="text-gray-400 text-sm">—</span>
                      ) : (
                        <span className={`font-bold tabular-nums ${
                          task.percentual >= 100 ? 'text-emerald-600' : task.percentual >= 80 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {task.percentual}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-[140px]">
                      {semDados ? (
                        <span className="text-gray-300 text-sm italic">sem dados</span>
                      ) : (
                        <ProgressBar value={task.percentual} showLabel={false} />
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${
                      semDados ? 'text-gray-300' : task.gap >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {semDados ? '—' : `${task.gap >= 0 ? '+' : ''}${task.gap.toLocaleString('pt-BR')}`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Heatmap de Performance</h3>
        </div>
        <div className="p-5 grid grid-cols-4 sm:grid-cols-7 gap-2">
          {sortedTasks.map((name) => {
            const task = rn.tasks[name];
            if (!task) return null;
            if (task.status === 'sem_dados') {
              return (
                <div
                  key={name}
                  className="bg-gray-100 rounded-lg p-3 text-center text-gray-400 border border-dashed border-gray-300"
                  title={`${name}: sem visibilidade`}
                >
                  <div className="text-xs font-medium truncate">{name}</div>
                  <div className="text-lg">⚪</div>
                </div>
              );
            }
            const bgColor = task.percentual >= 100
              ? 'bg-emerald-500'
              : task.percentual >= 90
              ? 'bg-emerald-300'
              : task.percentual >= 80
              ? 'bg-amber-400'
              : task.percentual >= 60
              ? 'bg-orange-400'
              : 'bg-red-500';
            return (
              <div
                key={name}
                className={`${bgColor} rounded-lg p-3 text-center text-white`}
                title={`${name}: ${task.percentual}%`}
              >
                <div className="text-xs font-medium truncate">{name}</div>
                <div className="text-lg font-bold">{task.percentual}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      {tasksNeedAction.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-900">📋 Plano de Ação Automático</h3>
            <p className="text-sm text-blue-700 mt-1">
              RN {rn.setor} — Status: {getStatusLabel(rn.status)} — Média: {rn.media}%
            </p>
          </div>
          <div className="p-5 space-y-3">
            {tasksNeedAction.map((name, idx) => {
              const task = rn.tasks[name];
              if (!task) return null;
              const urgency = task.percentual < 80 ? 'URGENTE' : 'MELHORAR';
              const urgencyColor = task.percentual < 80 ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50';
              return (
                <div key={name} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        Precisa evoluir em {name}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgencyColor}`}>
                        {urgency}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Atual: {task.percentual}% — Meta: 100% — GAP: {Math.abs(task.gap).toLocaleString('pt-BR')}
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={task.percentual} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
