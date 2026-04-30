"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { MediaItem } from "@/lib/contentful";

type PopupSettingsResponse = {
  settings: {
    id?: string;
    title?: string;
    enabled?: boolean;
    mediaItemId?: string;
    closeForTodayEnabled?: boolean;
  };
};

export default function PopupManagementTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("WISE Institute Popup");
  const [enabled, setEnabled] = useState(false);
  const [mediaItemId, setMediaItemId] = useState("");
  const [closeForTodayEnabled, setCloseForTodayEnabled] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const loadAll = async () => {
    try {
      const [settingsRes, mediaRes] = await Promise.all([
        fetch("/api/admin/popup-settings", { credentials: "include" }),
        fetch("/api/media", { credentials: "include" }),
      ]);

      const settingsData: PopupSettingsResponse = await settingsRes.json();
      const mediaData: MediaItem[] = mediaRes.ok ? await mediaRes.json() : [];
      const validMediaIds = new Set((Array.isArray(mediaData) ? mediaData : []).map((m) => m.id));

      setMediaItems(Array.isArray(mediaData) ? mediaData : []);
      if (settingsData?.settings) {
        const hasStaleMediaSelection =
          !!settingsData.settings.mediaItemId && !validMediaIds.has(settingsData.settings.mediaItemId);
        const sanitizedEnabled =
          hasStaleMediaSelection ? false : Boolean(settingsData.settings.enabled);
        const sanitizedMediaItemId =
          hasStaleMediaSelection ? "" : (settingsData.settings.mediaItemId || "");

        setTitle(settingsData.settings.title || "WISE Institute Popup");
        setEnabled(sanitizedEnabled);
        setMediaItemId(sanitizedMediaItemId);
        setCloseForTodayEnabled(settingsData.settings.closeForTodayEnabled !== false);

        // If previously selected media was deleted, auto-clean settings in CMS.
        if (hasStaleMediaSelection) {
          await fetch("/api/admin/popup-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              title: settingsData.settings.title || "WISE Institute Popup",
              enabled: false,
              mediaItemId: undefined,
              closeForTodayEnabled: settingsData.settings.closeForTodayEnabled !== false,
            }),
          });
          setMessage("Deleted popup image was removed from settings automatically.");
          setIsError(false);
        }
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Failed to load popup settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedMedia = useMemo(
    () => mediaItems.find((item) => item.id === mediaItemId),
    [mediaItems, mediaItemId]
  );
  const hasPopupImage = Boolean(mediaItemId && selectedMedia);
  const isSaveDisabled = saving || (enabled && !hasPopupImage);

  const previewSrc =
    selectedMedia?.thumbnail?.[0] ??
    selectedMedia?.images?.[0] ??
    "";

  const handleSave = async () => {
    if (enabled && !hasPopupImage) {
      setIsError(true);
      setMessage("Please add a popup image before enabling homepage popup.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/admin/popup-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          enabled,
          mediaItemId: mediaItemId || undefined,
          closeForTodayEnabled,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to save popup settings");

      setMessage("Popup settings saved successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Failed to save popup settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPopupImage = async () => {
    if (!uploadFile) {
      setIsError(true);
      setMessage("Please choose an image file to upload.");
      return;
    }

    setUploading(true);
    setMessage(null);
    setIsError(false);

    try {
      const formData = new FormData();
      const fileBaseName = uploadFile.name.replace(/\.[^/.]+$/, "");
      formData.append("title", `Popup - ${fileBaseName}`);
      formData.append("category", "Popup");
      formData.append("description", "Homepage popup image");
      formData.append("thumbnail", uploadFile);

      const createRes = await fetch("/api/admin/media", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData?.error || "Failed to upload popup image");
      }

      await loadAll();
      if (createData?.id) {
        setMediaItemId(createData.id);
      }
      setUploadFile(null);
      setMessage("Popup image uploaded successfully. Click Save Popup Settings to apply.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Failed to upload popup image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSelectedImage = async () => {
    if (!mediaItemId) {
      setIsError(true);
      setMessage("Select a popup image first.");
      return;
    }

    const confirmed = window.confirm("Delete selected popup image from media library?");
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch(`/api/admin/media/${mediaItemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete selected popup image");
      }

      setMediaItemId("");
      await loadAll();
      setMessage("Selected popup image deleted. Click Save Popup Settings to apply.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Failed to delete selected popup image");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!hasPopupImage && enabled) {
      setEnabled(false);
    }
  }, [hasPopupImage, enabled]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-secondary-200 p-6 text-secondary-600">
        Loading popup settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm ${
            isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-secondary-200 shadow-soft p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-secondary-900">Popup Management</h2>
          <p className="text-sm text-secondary-600 mt-1">
            Configure homepage popup visibility and image from Contentful media items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Popup Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm"
                placeholder="WISE Institute Popup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Popup Image</label>
              <select
                value={mediaItemId}
                onChange={(e) => setMediaItemId(e.target.value)}
                className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Select a media item</option>
                {mediaItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                Choose a media item thumbnail as popup image. Clear selection to remove custom image.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full border border-secondary-200 rounded-xl px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-white"
                />
                <button
                  type="button"
                  onClick={handleUploadPopupImage}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-secondary-900 text-white hover:bg-secondary-800 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelectedImage}
                  disabled={deleting || !mediaItemId}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  disabled={!hasPopupImage}
                  className="h-4 w-4 rounded border-secondary-300"
                />
                Enable popup on homepage
              </label>
              {!hasPopupImage && (
                <p className="text-xs text-amber-700">
                  Please add a popup image.
                </p>
              )}
              <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
                <input
                  type="checkbox"
                  checked={closeForTodayEnabled}
                  onChange={(e) => setCloseForTodayEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300"
                />
                Show "Close for today" option
              </label>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 mb-2">Preview</p>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-secondary-200 bg-secondary-50">
              {previewSrc ? (
                <Image src={previewSrc} alt={title || "Popup preview"} fill className="object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-secondary-500">
                  <ImagePlus className="h-5 w-5 mr-2" />
                  Please add popup image.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="px-6 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Popup Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

