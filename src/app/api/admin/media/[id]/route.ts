import { NextResponse } from 'next/server';
import { getManagementEnv, uploadImage } from '@/lib/contentfulManagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 세션 기반 인증 확인
function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const sessionCookie = cookieHeader
    .split(';')
    .find(cookie => cookie.trim().startsWith('admin-session='));
  
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { env } = await getManagementEnv();
    let entry;
    try {
      entry = await env.getEntry(params.id);
    } catch (err: any) {
      if (err?.status === 404 || err?.response?.status === 404) {
        return NextResponse.json({ error: 'Media item not found (it may have been deleted already).' }, { status: 404 });
      }
      throw err;
    }

    const contentType = entry.sys.contentType?.sys?.id;
    if (contentType !== 'wiseInstitute') {
      return NextResponse.json({ error: 'Not a media item entry (expected wiseInstitute)' }, { status: 400 });
    }

    const formData = await request.formData();

    const updateField = (key: string, val?: string) => {
      if (val !== undefined) {
        (entry.fields as any)[key] = { 'en-US': val };
      }
    };

    updateField('title', String(formData.get('title') || '').trim() || undefined);
    updateField('category', String(formData.get('category') || '').trim() || undefined);
    updateField('description', String(formData.get('description') || '').trim() || undefined);

    const thumbFiles = formData.getAll('thumbnail').filter((f): f is File => f instanceof File && f.size > 0);
    const imageFiles = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
    const videoFiles = formData.getAll('videos').filter((f): f is File => f instanceof File && f.size > 0);

    const clearThumbnails = String(formData.get('clearThumbnails') || '').toLowerCase() === 'true';
    const clearImages = String(formData.get('clearImages') || '').toLowerCase() === 'true';

    const deleteImagesJson = formData.get('deleteImages');
    const deleteImageUrls: string[] = deleteImagesJson ? JSON.parse(String(deleteImagesJson)) : [];

    if (clearThumbnails) {
      (entry.fields as any).thumbnail = { 'en-US': [] };
    } else if (thumbFiles.length) {
      const existingThumbs = ((entry.fields as any).thumbnail?.['en-US'] || []);
      const uploaded = await Promise.all(thumbFiles.map((f) => uploadImage(env, f)));
      (entry.fields as any).thumbnail = {
        'en-US': [...existingThumbs, ...uploaded.map((asset) => ({ sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } }))],
      };
    }

    if (clearImages) {
      (entry.fields as any).images = { 'en-US': [] };
    } else if (imageFiles.length || deleteImageUrls.length > 0) {
      const existingImages = ((entry.fields as any).images?.['en-US'] || []);
      
      let remainingImages = existingImages;
      if (deleteImageUrls.length > 0) {
        const assetIdToUrlMap = new Map<string, string>();
        
        await Promise.all(
          existingImages
            .filter((img: any) => img.sys && img.sys.id)
            .map(async (img: any) => {
              try {
                const asset = await env.getAsset(img.sys.id);
                const assetUrl = asset.fields?.file?.['en-US']?.url || '';
                assetIdToUrlMap.set(img.sys.id, assetUrl);
              } catch (err: any) {
                console.error(`Failed to fetch asset ${img.sys.id}:`, err);
              }
            })
        );
        
        remainingImages = existingImages.filter((img: any) => {
          if (!img.sys || !img.sys.id) return true;
          
          const assetUrl = assetIdToUrlMap.get(img.sys.id) || '';
          if (!assetUrl) return true;
          
          const shouldKeep = !deleteImageUrls.some((deleteUrl: string) => {
            const deleteFileName = deleteUrl.split('/').pop()?.split('?')[0];
            const assetFileName = assetUrl.split('/').pop()?.split('?')[0];
            return deleteFileName && assetFileName && deleteFileName === assetFileName;
          });
          
          return shouldKeep;
        });
      }
      
      let uploaded: any[] = [];
      if (imageFiles.length) {
        uploaded = await Promise.all(imageFiles.map((f) => uploadImage(env, f)));
      }
      
      (entry.fields as any).images = {
        'en-US': [...remainingImages, ...uploaded.map((asset) => ({ sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } }))],
      };
    }

    // 비디오 처리
    if (videoFiles.length > 0) {
      const existingVideos = ((entry.fields as any).videos?.['en-US'] || []);
      const uploadedVideos: any[] = [];
      
      for (const videoFile of videoFiles) {
        const arrayBuffer = await videoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const videoAsset = await env.createAssetFromFiles({
          fields: {
            title: { 'en-US': videoFile.name },
            description: { 'en-US': videoFile.name },
            file: {
              'en-US': {
                contentType: videoFile.type,
                fileName: videoFile.name,
                file: buffer as any,
              },
            },
          },
        });
        
        // Process asset and wait for completion with polling
        let processed = await videoAsset.processForAllLocales();
        
        // Poll until asset is processed (max 2 minutes)
        const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes
        let attempts = 0;
        while (attempts < maxAttempts) {
          try {
            // Refresh asset to check processing status
            const refreshed = await env.getAsset(processed.sys.id);
            if (refreshed.fields?.file?.['en-US']?.url) {
              // Asset is processed
              processed = refreshed;
              break;
            }
          } catch (err) {
            // Asset might not be ready yet, continue polling
          }
          
          // Wait 2 seconds before next attempt
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
          
          // Refresh processed asset
          try {
            processed = await env.getAsset(processed.sys.id);
          } catch (err) {
            // Continue polling
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn(`Video asset ${processed.sys.id} processing timeout, but continuing...`);
        }
        
        const published = await processed.publish();
        uploadedVideos.push(published);
      }
      
      (entry.fields as any).videos = {
        'en-US': [...existingVideos, ...uploadedVideos.map((asset) => ({ sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } }))],
      };
    }

    const updated = await entry.update();
    const published = await updated.publish();
    
    return NextResponse.json({ id: published.sys.id }, { status: 200 });
  } catch (err: any) {
    console.error('Admin update media error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { env } = await getManagementEnv();
    let entry;
    try {
      entry = await env.getEntry(params.id);
    } catch (err: any) {
      if (err?.status === 404 || err?.response?.status === 404) {
        // Treat as idempotent success: already deleted.
        return NextResponse.json({ ok: true, alreadyDeleted: true }, { status: 200 });
      }
      throw err;
    }

    try {
      if ((entry as any).isPublished()) {
        await entry.unpublish();
      }
    } catch (unpublishError) {
      console.warn('Failed to unpublish before deletion:', unpublishError);
    }

    await entry.delete();
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('Admin delete media error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

