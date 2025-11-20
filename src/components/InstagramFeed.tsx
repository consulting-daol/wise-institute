'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type InstagramPost = {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

type InstagramFeedProps = {
  limit?: number
  useServerAPI?: boolean
}

export default function InstagramFeed({ 
  limit = 6,
  useServerAPI = true
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        let response: Response

        if (useServerAPI) {
          // Use server-side API route (more secure)
          response = await fetch('/api/instagram')
        } else {
          // Direct API call (requires client-side tokens)
          const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
          const userId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID

          if (!accessToken || !userId) {
            throw new Error('Instagram credentials not configured')
          }

          response = await fetch(
            `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=${limit}&access_token=${accessToken}`
          )
        }

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts')
        }

        const data = await response.json()
        setPosts((data.data || []).slice(0, limit))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Instagram feed')
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Instagram API Error:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [limit, useServerAPI])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-600">Loading Instagram feed...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-600">No Instagram posts found</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg bg-secondary-100 hover:opacity-90 transition-opacity group"
        >
          <Image
            src={post.thumbnail_url || post.media_url}
            alt={post.caption || 'Instagram post'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}

