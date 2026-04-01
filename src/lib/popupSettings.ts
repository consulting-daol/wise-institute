import { client } from './contentful';

export type PopupSettings = {
  id: string;
  enabled: boolean;
  mediaItemId?: string;
  title?: string;
  closeForTodayEnabled: boolean;
};

export const DEFAULT_POPUP_SETTINGS: PopupSettings = {
  id: 'default',
  enabled: false,
  mediaItemId: undefined,
  title: 'WISE Institute Popup',
  closeForTodayEnabled: true,
};

export async function getPopupSettings(): Promise<PopupSettings> {
  try {
    const response = await client.getEntries({
      content_type: 'popupSettings',
      limit: 1,
    });

    if (response.items.length === 0) return DEFAULT_POPUP_SETTINGS;

    const item = response.items[0];
    const fields = item.fields as Record<string, unknown>;

    const readField = <T>(value: unknown, fallback: T): T => {
      if (value === null || value === undefined) return fallback;
      if (typeof value === 'object' && value !== null && 'en-US' in (value as Record<string, unknown>)) {
        const localized = (value as { 'en-US'?: T })['en-US'];
        return (localized ?? fallback) as T;
      }
      return value as T;
    };

    const enabled = Boolean(readField<boolean>(fields.enabled, false));
    const mediaItemId = (readField<string | undefined>(fields.mediaItemId, undefined) || undefined) ?? undefined;
    const title = (readField<string | undefined>(fields.title, undefined) || undefined) ?? undefined;
    const closeForTodayEnabled = Boolean(readField<boolean>(fields.closeForTodayEnabled, true));

    return {
      id: item.sys.id,
      enabled,
      mediaItemId,
      title,
      closeForTodayEnabled,
    };
  } catch (error) {
    console.error('Error fetching popup settings:', error);
    return DEFAULT_POPUP_SETTINGS;
  }
}

