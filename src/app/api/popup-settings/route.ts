import { NextResponse } from 'next/server';
import { getMediaItems } from '@/lib/contentful';
import { DEFAULT_POPUP_SETTINGS, getPopupSettings } from '@/lib/popupSettings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const [settings, mediaItems] = await Promise.all([getPopupSettings(), getMediaItems()]);
    const mediaItem = settings.mediaItemId ? mediaItems.find((m) => m.id === settings.mediaItemId) : undefined;
    const popupImage = mediaItem?.thumbnail?.[0] ?? mediaItem?.images?.[0] ?? '';
    const hasValidImage = Boolean(popupImage);

    return NextResponse.json({
      settings: {
        ...settings,
        enabled: Boolean(settings.enabled && hasValidImage),
        image: popupImage,
      },
    });
  } catch (error) {
    console.error('Error fetching popup settings:', error);
    return NextResponse.json({
      settings: {
        ...DEFAULT_POPUP_SETTINGS,
        image: '',
      },
    });
  }
}

