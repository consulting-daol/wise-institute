import { getMediaItems, MediaItem } from '@/lib/contentful'
import GalleryClient from './GalleryClient'

export default async function GalleryPage() {
  let mediaItems: MediaItem[] = []

  try {
    mediaItems = (await getMediaItems()).filter(
      (item) => item.category?.toLowerCase() !== 'popup'
    )
  } catch (error) {
    console.error('Error loading gallery media:', error)
    // Fallback: empty array - GalleryClient will show "No media items found"
  }

  return <GalleryClient initialMediaItems={mediaItems} />
}
