import { NextResponse } from 'next/server';
import { getManagementEnv } from '@/lib/contentfulManagement';
import { DEFAULT_POPUP_SETTINGS } from '@/lib/popupSettings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CONTENT_TYPE_ID = 'popupSettings';

function readField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object' && value !== null && 'en-US' in (value as Record<string, unknown>)) {
    const localized = (value as { 'en-US'?: T })['en-US'];
    return (localized ?? fallback) as T;
  }
  return value as T;
}

function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const sessionCookie = cookieHeader
    .split(';')
    .find((cookie) => cookie.trim().startsWith('admin-session='));

  if (!sessionCookie) return false;

  try {
    const sessionValue = sessionCookie.split('=')[1];
    const decodedValue = decodeURIComponent(sessionValue);
    const sessionData = JSON.parse(Buffer.from(decodedValue, 'base64').toString());

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

    const contentType = await (
      env as unknown as {
        createContentTypeWithId: (
          id: string,
          data: unknown
        ) => Promise<{ publish: () => Promise<unknown> }>;
      }
    ).createContentTypeWithId(CONTENT_TYPE_ID, {
      name: 'Popup Settings',
      displayField: 'title',
      fields: [
        { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: false, validations: [] },
        { id: 'enabled', name: 'Enabled', type: 'Boolean', required: false, localized: false, validations: [] },
        {
          id: 'mediaItemId',
          name: 'Media Item ID',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [],
        },
        {
          id: 'closeForTodayEnabled',
          name: 'Close For Today Enabled',
          type: 'Boolean',
          required: false,
          localized: false,
          validations: [],
        },
      ],
    });

    await contentType.publish();
  }
}

export async function GET(request: Request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { env } = await getManagementEnv();
    await ensureContentType(env);

    const response = await env.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 1,
    });

    if (response.items.length === 0) {
      return NextResponse.json({ settings: DEFAULT_POPUP_SETTINGS });
    }

    const item = response.items[0];
    const fields = item.fields as Record<string, unknown>;

    return NextResponse.json({
      settings: {
        id: item.sys.id,
        title: readField<string>(fields.title, 'WISE Institute Popup'),
        enabled: Boolean(readField<boolean>(fields.enabled, false)),
        mediaItemId: (readField<string | undefined>(fields.mediaItemId, undefined) || undefined) ?? undefined,
        closeForTodayEnabled: Boolean(readField<boolean>(fields.closeForTodayEnabled, true)),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch popup settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || 'WISE Institute Popup');
    const enabled = Boolean(body.enabled);
    const mediaItemId = body.mediaItemId ? String(body.mediaItemId) : '';
    const closeForTodayEnabled = body.closeForTodayEnabled !== false;

    const { env } = await getManagementEnv();
    await ensureContentType(env);

    const existing = await env.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 1,
    });

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

      (entry.fields as Record<string, unknown>).title = { 'en-US': title };
      (entry.fields as Record<string, unknown>).enabled = { 'en-US': enabled };
      (entry.fields as Record<string, unknown>).mediaItemId = { 'en-US': mediaItemId || undefined };
      (entry.fields as Record<string, unknown>).closeForTodayEnabled = { 'en-US': closeForTodayEnabled };
      entry = await entry.update();
    } else {
      entry = await env.createEntry(CONTENT_TYPE_ID, {
        fields: {
          title: { 'en-US': title },
          enabled: { 'en-US': enabled },
          mediaItemId: { 'en-US': mediaItemId || undefined },
          closeForTodayEnabled: { 'en-US': closeForTodayEnabled },
        },
      });
    }

    await entry.publish();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save popup settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

