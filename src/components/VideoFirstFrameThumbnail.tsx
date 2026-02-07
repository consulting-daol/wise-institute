'use client'

import { useState, useEffect, useRef } from 'react'

type VideoFirstFrameThumbnailProps = {
  src: string
  className?: string
  onMouseEnter?: (e: React.MouseEvent<HTMLVideoElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLVideoElement>) => void
}

export default function VideoFirstFrameThumbnail({
  src,
  className,
  onMouseEnter,
  onMouseLeave,
}: VideoFirstFrameThumbnailProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const captureVideoRef = useRef<HTMLVideoElement | null>(null)

  // Lazy load: only capture when in viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { rootMargin: '50px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Capture first frame when in view
  useEffect(() => {
    if (!isInView || !src) return

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const handleLoadedData = () => {
      video.currentTime = 0
    }

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setPosterUrl(dataUrl)
        }
      } catch {
        // CORS or canvas tainted - fallback to no poster
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('seeked', handleSeeked)
    video.src = src
    captureVideoRef.current = video

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('seeked', handleSeeked)
      video.src = ''
    }
  }, [isInView, src])

  return (
    <div ref={containerRef} className="w-full h-full">
      <video
        src={src}
        poster={posterUrl || undefined}
        className={className}
        preload="none"
        muted
        playsInline
        loop
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </div>
  )
}
