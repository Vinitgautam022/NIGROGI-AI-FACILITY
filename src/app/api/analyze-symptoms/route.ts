import { NextResponse } from 'next/server';
import { analyzeSymptomsSmart } from '@/lib/analysis';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await analyzeSymptomsSmart({
      age: String(body.age ?? ''),
      sex: String(body.sex ?? ''),
      duration: String(body.duration ?? ''),
      symptoms: String(body.symptoms ?? ''),
      severity: String(body.severity ?? '')
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid symptom analysis request body.' }, { status: 400 });
  }
}
