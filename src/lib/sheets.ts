import { RNData, GVData, GV_CONFIG, TASK_NAMES, getGVBySetor, getStatus } from './types';

const COLUMN_MAP: Record<string, { metaCol: number; realCol: number }> = {
  'Cerveja':              { metaCol: 1, realCol: 2 },
  'Cerveja Zero':         { metaCol: 3, realCol: 4 },
  'Match':                { metaCol: 5, realCol: 6 },
  'NAB':                  { metaCol: 7, realCol: 8 },
  'Marketplace':          { metaCol: 9, realCol: 10 },
  'Volume':               { metaCol: 11, realCol: 12 },
  'Faturamento Score 5':  { metaCol: 13, realCol: 14 },
};

function parseNumber(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0;
  let str = String(val).replace(/[%R$\s]/g, '');
  // Formato brasileiro: 1.000,50 → remove pontos de milhar, troca vírgula por ponto
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else {
    // Se só tem pontos, verifica se é milhar (ex: 1.000 = mil) ou decimal (ex: 1.5)
    const parts = str.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      // 1.000 → milhar, remove o ponto
      str = str.replace(/\./g, '');
    }
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function parseRow(row: string[]): RNData | null {
  const setor = parseInt(row[0], 10);
  if (isNaN(setor)) return null;

  const gv = getGVBySetor(setor);
  if (!gv) return null;

  const tasks: RNData['tasks'] = {};
  let totalPercentual = 0;
  let taskCount = 0;
  const tasksCriticas: string[] = [];

  for (const taskName of TASK_NAMES) {
    const cols = COLUMN_MAP[taskName];
    const meta = parseNumber(row[cols.metaCol]);
    const real = parseNumber(row[cols.realCol]);
    const percentual = meta > 0 ? Math.round((real / meta) * 100) : 0;
    const gap = Math.round((real - meta) * 100) / 100;
    const status = getStatus(percentual);

    tasks[taskName] = { meta, real, percentual, gap, status };
    totalPercentual += percentual;
    taskCount++;

    if (status === 'critico') {
      tasksCriticas.push(taskName);
    }
  }

  const media = taskCount > 0 ? Math.round(totalPercentual / taskCount) : 0;

  return {
    setor,
    tasks,
    media,
    status: getStatus(media),
    tasksCriticas,
  };
}

export async function fetchSheetData(sheetId: string, apiKey: string): Promise<GVData[]> {
  const range = 'A2:O100';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch sheet data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  const gvMap = new Map<number, RNData[]>();

  for (const gv of GV_CONFIG) {
    gvMap.set(gv.id, []);
  }

  for (const row of rows) {
    const rn = parseRow(row);
    if (!rn) continue;

    const gv = getGVBySetor(rn.setor);
    if (gv) {
      gvMap.get(gv.id)?.push(rn);
    }
  }

  const result: GVData[] = [];

  for (const gvConfig of GV_CONFIG) {
    const rns = gvMap.get(gvConfig.id) || [];
    rns.sort((a, b) => a.setor - b.setor);

    const totalCriticos = rns.filter((r) => r.status === 'critico').length;
    const totalAtencao = rns.filter((r) => r.status === 'atencao').length;
    const totalBons = rns.filter((r) => r.status === 'bom').length;
    const mediaGeral = rns.length > 0 ? Math.round(rns.reduce((sum, r) => sum + r.media, 0) / rns.length) : 0;

    result.push({
      id: gvConfig.id,
      nome: gvConfig.nome,
      rns,
      mediaGeral,
      totalCriticos,
      totalAtencao,
      totalBons,
    });
  }

  return result;
}
