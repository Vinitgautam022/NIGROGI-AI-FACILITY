import { NextResponse } from 'next/server';
import { analyzeReportSmart } from '@/lib/analysis';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await analyzeReportSmart({
      reportTitle: String(body.reportTitle ?? ''),
      reportText: String(body.reportText ?? '')
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid report analysis request body.' }, { status: 400 });
  }
}
