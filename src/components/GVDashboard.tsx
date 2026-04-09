'use client';

import { useState, useMemo } from 'react';
import { GVData, RNData } from '@/lib/types';
import KPICards from './KPICards';
import RNTable from './RNTable';
import RNDetail from './RNDetail';
import Filters, { FilterStatus } from './Filters';

interface GVDashboardProps {
  gv: GVData;
  onBack: () => void;
}

export default function GVDashboard({ gv, onBack }: GVDashboardProps) {
  const [selectedRN, setSelectedRN] = useState<RNData | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos');
  const [rnFilter, setRnFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');

  const filteredRNs = useMemo(() => {
    let result = gv.rns;

    if (statusFilter !== 'todos') {
      result = result.filter((rn) => rn.status === statusFilter);
    }

    if (rnFilter) {
      result = result.filter((rn) => String(rn.setor) === rnFilter);
    }

    if (taskFilter) {
      result = result.filter((rn) => rn.tasksCriticas.includes(taskFilter));
    }

    return result;
  }, [gv.rns, statusFilter, rnFilter, taskFilter]);

  if (selectedRN) {
    return (
      <div>
        <RNDetail rn={selectedRN} onBack={() => setSelectedRN(null)} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          ← Voltar
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard — {gv.nome}</h1>
          <p className="text-sm text-gray-500">GV {gv.id} • {gv.rns.length} RNs</p>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards gv={gv} />

      {/* Filters */}
      <Filters
        rns={gv.rns}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        rnFilter={rnFilter}
        setRnFilter={setRnFilter}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
      />

      {/* RN Table */}
      <RNTable rns={filteredRNs} onSelectRN={setSelectedRN} />

      {/* GV Heatmap Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Visão Geral — Heatmap de RNs</h3>
        </div>
        <div className="p-5 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {gv.rns.map((rn) => {
            const bgColor = rn.media >= 100
              ? 'bg-emerald-500'
              : rn.media >= 90
              ? 'bg-emerald-300'
              : rn.media >= 80
              ? 'bg-amber-400'
              : rn.media >= 60
              ? 'bg-orange-400'
              : 'bg-red-500';
            return (
              <button
                key={rn.setor}
                onClick={() => setSelectedRN(rn)}
                className={`${bgColor} rounded-lg p-3 text-center text-white hover:opacity-90 transition-opacity cursor-pointer`}
                title={`RN ${rn.setor}: ${rn.media}%`}
              >
                <div className="text-xs font-medium">RN {rn.setor}</div>
                <div className="text-lg font-bold">{rn.media}%</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
