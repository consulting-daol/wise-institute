import { NextResponse } from 'next/server';
import { getPrograms } from '@/lib/programs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const programs = await getPrograms();
    return NextResponse.json(programs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch programs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
