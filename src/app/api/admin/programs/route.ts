import { NextResponse } from 'next/server';
import { getManagementEnv } from '@/lib/contentfulManagement';
import { DEFAULT_PROGRAMS, Program } from '@/lib/programs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CONTENT_TYPE_ID = 'programsSettings';

function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const sessionCookie = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('admin-session='));

  if (!sessionCookie) return false;

  try {
    const sessionValue = sessionCookie.split('=')[1];
    const decoded = decodeURIComponent(sessionValue);
    const sessionData = JSON.parse(Buffer.from(decoded, 'base64').toString());
    if (!sessionData.user || !sessionData.expires) return false;
    if (new Date() > new Date(sessionData.expires)) return false;
    return true;
  } catch {
    return false;
  }
}

async function ensureContentType(env: Awaited<ReturnType<typeof getManagementEnv>>['env']) {
  try {
    await env.getContentType(CONTENT_TYPE_ID);
  } catch (err: unknown) {
    const isNotFound =
      (err as { status?: number }).status === 404 ||
      (err as Error).message?.includes('not found') ||
      (err as Error).message?.includes('could not be found');
    if (!isNotFound) throw err;

    const contentType = await (env as unknown as { createContentTypeWithId: (id: string, data: unknown) => Promise<{ publish: () => Promise<unknown> }> }).createContentTypeWithId(CONTENT_TYPE_ID, {
      name: 'Programs Settings',
      displayField: 'internalTitle',
      fields: [
        { id: 'internalTitle', name: 'Internal Title', type: 'Symbol', required: true, localized: false, validations: [] },
        { id: 'programs', name: 'Programs', type: 'Object', required: false, localized: false, validations: [] },
      ],
    });
    await contentType.publish();
  }
}

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { env } = await getManagementEnv();
    await ensureContentType(env);

    const response = await env.getEntries({ content_type: CONTENT_TYPE_ID, limit: 1 });

    if (response.items.length === 0) {
      return NextResponse.json({ programs: DEFAULT_PROGRAMS });
    }

    const fields = response.items[0].fields as Record<string, unknown>;
    const programsField = fields.programs as unknown;

    let programs: Program[] | undefined;
    if (Array.isArray(programsField)) {
      programs = programsField as Program[];
    } else if (programsField && typeof programsField === 'object') {
      const maybeLocalized = (programsField as Record<string, unknown>)['en-US'];
      if (Array.isArray(maybeLocalized)) programs = maybeLocalized as Program[];
    }

    return NextResponse.json({
      programs: Array.isArray(programs) && programs.length > 0 ? programs : DEFAULT_PROGRAMS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch programs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const programs: Program[] = body.programs;

    if (!Array.isArray(programs)) {
      return NextResponse.json({ error: 'programs must be an array' }, { status: 400 });
    }

    const { env } = await getManagementEnv();
    await ensureContentType(env);

    const existing = await env.getEntries({ content_type: CONTENT_TYPE_ID, limit: 1 });

    let entry;
    if (existing.items.length > 0) {
      entry = existing.items[0];
      try {
        if ((entry as { isPublished?: () => boolean }).isPublished?.()) {
          entry = await entry.unpublish();
        }
      } catch {
        // already unpublished
      }
      // Field is created as localized: false, so store directly.
      (entry.fields as Record<string, unknown>).programs = programs;
      entry = await entry.update();
    } else {
      entry = await env.createEntry(CONTENT_TYPE_ID, {
        fields: {
          internalTitle: { 'en-US': 'Programs Settings' },
          programs,
        },
      });
    }

    await entry.publish();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save programs';
    console.error('Error saving programs:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
