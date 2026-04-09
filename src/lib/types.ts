export interface TaskData {
  meta: number;
  real: number;
  percentual: number;
  gap: number;
  status: 'critico' | 'atencao' | 'bom' | 'sem_dados';
}

export interface RNData {
  setor: number;
  tasks: Record<string, TaskData>;
  media: number;
  status: 'critico' | 'atencao' | 'bom';
  tasksCriticas: string[];
}

export interface GVData {
  id: number;
  nome: string;
  rns: RNData[];
  mediaGeral: number;
  totalCriticos: number;
  totalAtencao: number;
  totalBons: number;
}

export const TASK_NAMES = [
  'Cerveja',
  'Cerveja Zero',
  'Match',
  'NAB',
  'Marketplace',
  'Volume',
  'Faturamento Score 5',
] as const;

export type TaskName = (typeof TASK_NAMES)[number];

export const GV_CONFIG = [
  { id: 1, nome: 'Alex Magalhães', rangeStart: 101, rangeEnd: 110 },
  { id: 2, nome: 'Matheus Sousa', rangeStart: 201, rangeEnd: 208 },
] as const;

export function getGVBySetor(setor: number): (typeof GV_CONFIG)[number] | undefined {
  return GV_CONFIG.find((gv) => setor >= gv.rangeStart && setor <= gv.rangeEnd);
}

export function getStatus(percentual: number): 'critico' | 'atencao' | 'bom' {
  if (percentual < 80) return 'critico';
  if (percentual < 100) return 'atencao';
  return 'bom';
}

export function getStatusEmoji(status: 'critico' | 'atencao' | 'bom' | 'sem_dados'): string {
  switch (status) {
    case 'critico': return '🔴';
    case 'atencao': return '🟡';
    case 'bom': return '🟢';
    case 'sem_dados': return '⚪';
  }
}

export function getStatusLabel(status: 'critico' | 'atencao' | 'bom' | 'sem_dados'): string {
  switch (status) {
    case 'critico': return 'Crítico';
    case 'atencao': return 'Atenção';
    case 'bom': return 'Bom';
    case 'sem_dados': return 'Sem dados';
  }
}
