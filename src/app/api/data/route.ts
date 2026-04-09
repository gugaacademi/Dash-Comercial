import { fetchSheetData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!sheetId || !apiKey) {
    return Response.json(
      { error: 'Configuração do Google Sheets não encontrada. Defina GOOGLE_SHEET_ID e GOOGLE_API_KEY.' },
      { status: 500 }
    );
  }

  try {
    const data = await fetchSheetData(sheetId, apiKey);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ error: message }, { status: 500 });
  }
}
