import { NextResponse } from 'next/server';
import { getManagementEnv, uploadImageFromBase64 } from '@/lib/contentfulManagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'imageBase64 is required' },
        { status: 400 }
      );
    }

    const { env } = await getManagementEnv();
    const entry = await env.getEntry(id);

    const contentType = entry.sys.contentType?.sys?.id;
    if (contentType !== 'wiseInstitute') {
      return NextResponse.json(
        { error: 'Not a media item entry (expected wiseInstitute)' },
        { status: 400 }
      );
    }

    const title = (entry.fields as any)?.title?.['en-US'] || 'media';
    const fileName = `thumbnail-${title.replace(/\s+/g, '-').slice(0, 30)}.jpg`;

    const asset = await uploadImageFromBase64(env, imageBase64, fileName);

    const existingThumbs = (entry.fields as any).thumbnail?.['en-US'] || [];
    (entry.fields as any).thumbnail = {
      'en-US': [
        ...existingThumbs,
        { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } },
      ],
    };

    const updated = await entry.update();
    await updated.publish();

    const assetUrl =
      (asset as any).fields?.file?.['en-US']?.url?.startsWith('//')
        ? `https:${(asset as any).fields.file['en-US'].url}`
        : (asset as any).fields?.file?.['en-US']?.url || '';

    return NextResponse.json({
      success: true,
      thumbnailUrl: assetUrl,
      assetId: asset.sys.id,
    });
  } catch (error: any) {
    console.error('Error saving thumbnail to Contentful:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save thumbnail' },
      { status: 500 }
    );
  }
}
