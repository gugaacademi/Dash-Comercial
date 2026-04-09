'use client';

import { useState, useEffect, useCallback } from 'react';
import { GVData, GV_CONFIG } from '@/lib/types';
import GVDashboard from './GVDashboard';

export default function AppShell() {
  const [data, setData] = useState<GVData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGV, setSelectedGV] = useState<GVData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Erro ao carregar dados');
      }
      const result: GVData[] = await res.json();
      setData(result);
      setError(null);
      setLastUpdate(new Date());

      // If a GV is selected, update it with fresh data
      if (selectedGV) {
        const updated = result.find((gv) => gv.id === selectedGV.id);
        if (updated) setSelectedGV(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [selectedGV]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // If a GV is selected, show their dashboard
  if (selectedGV) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AC
              </div>
              <span className="font-bold text-gray-900">Acompanhamento Comercial</span>
            </div>
            {lastUpdate && (
              <span className="text-xs text-gray-400">
                Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <GVDashboard gv={selectedGV} onBack={() => setSelectedGV(null)} />
        </main>
      </div>
    );
  }

  // GV Selection Screen
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              AC
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Acompanhamento Comercial</h1>
              <p className="text-sm text-gray-500">Selecione seu perfil para acessar o dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
          <p className="text-gray-500">Escolha o Gerente de Vendas para visualizar o dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((gv) => {
            const config = GV_CONFIG.find((c) => c.id === gv.id);
            return (
              <button
                key={gv.id}
                onClick={() => setSelectedGV(gv)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-left card-hover cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {gv.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{gv.nome}</h3>
                    <p className="text-sm text-gray-500">
                      GV {gv.id} • RNs {config?.rangeStart}–{config?.rangeEnd}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{gv.totalCriticos}</div>
                    <div className="text-xs text-red-500">Críticos</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-lg">
                    <div className="text-lg font-bold text-amber-600">{gv.totalAtencao}</div>
                    <div className="text-xs text-amber-500">Atenção</div>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600">{gv.totalBons}</div>
                    <div className="text-xs text-emerald-500">Bons</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{gv.mediaGeral}%</div>
                    <div className="text-xs text-blue-500">Média</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{gv.rns.length} RNs no total</span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Acessar dashboard →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {lastUpdate && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Dados atualizados automaticamente a cada 60 segundos • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        )}
      </main>
    </div>
  );
}
