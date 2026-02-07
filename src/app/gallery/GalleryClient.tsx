'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Home, ChevronUp, X, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import PageHero from '@/components/PageHero'
import VideoFirstFrameThumbnail from '@/components/VideoFirstFrameThumbnail'
import { MediaItem } from '@/lib/contentful'
import { checkAdminSession } from '@/lib/admin'

type GalleryMedia = {
  url: string
  type: 'image' | 'video'
  itemTitle: string
  itemDescription?: string
  itemCategory?: string
}

type GalleryClientProps = {
  initialMediaItems: MediaItem[]
}

export default function GalleryClient({ initialMediaItems }: GalleryClientProps) {
  const router = useRouter()
  const [mediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [allGalleryMedia, setAllGalleryMedia] = useState<GalleryMedia[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAdmin, setIsAdmin] = useState(false)
  const ITEMS_PER_PAGE = 12
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null)
  const scrollPositionRef = useRef(0)

  // Check admin status (non-blocking, deferred)
  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminSession()
      setIsAdmin(adminStatus)
    }
    checkAdmin()
  }, [])

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get all media URLs (images and videos) from a media item, removing duplicates
  const getAllMediaUrls = (item: MediaItem): Array<{ url: string; type: 'image' | 'video' }> => {
    const mediaMap = new Map<string, { url: string; type: 'image' | 'video' }>()
    
    // Add videos first (priority)
    item.videos?.forEach(url => {
      if (url && !mediaMap.has(url)) {
        mediaMap.set(url, { url, type: 'video' })
      }
    })
    
    // Add images (skip if already exists as video)
    item.images?.forEach(url => {
      if (url && !mediaMap.has(url)) {
        mediaMap.set(url, { url, type: 'image' })
      }
    })
    
    // Add thumbnails (skip if already exists)
    item.thumbnail?.forEach(url => {
      if (url && !mediaMap.has(url)) {
        mediaMap.set(url, { url, type: 'image' })
      }
    })
    
    return Array.from(mediaMap.values())
  }

  // Build all gallery media array when mediaItems change
  useEffect(() => {
    const galleryMedia: GalleryMedia[] = []
    mediaItems.forEach((item) => {
      const allMedia = getAllMediaUrls(item)
      if (allMedia.length > 0) {
        galleryMedia.push({
          url: allMedia[0].url,
          type: allMedia[0].type,
          itemTitle: item.title,
          itemDescription: item.description,
          itemCategory: item.category,
        })
      }
    })
    setAllGalleryMedia(galleryMedia)
  }, [mediaItems])

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (selectedMediaIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMediaIndex(null)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (selectedMediaIndex > 0) {
          setSelectedMediaIndex(selectedMediaIndex - 1)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (selectedMediaIndex < allGalleryMedia.length - 1) {
          setSelectedMediaIndex(selectedMediaIndex + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMediaIndex, allGalleryMedia.length])

  // Prevent body scroll when modal is open + reset on close (fixes mobile video fullscreen exit)
  useEffect(() => {
    if (selectedMediaIndex !== null) {
      scrollPositionRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const savedScroll = scrollPositionRef.current
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScroll)
      })
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
    }
  }, [selectedMediaIndex])

  const pauseCurrentVideo = () => {
    const video = lightboxVideoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
      lightboxVideoRef.current = null
    }
  }

  const openModal = (itemIndex: number) => {
    scrollPositionRef.current = window.scrollY
    setSelectedMediaIndex(itemIndex)
  }

  const closeModal = () => {
    pauseCurrentVideo()
    setSelectedMediaIndex(null)
  }

  const goToPrevious = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex > 0) {
      pauseCurrentVideo()
      setSelectedMediaIndex(selectedMediaIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex < allGalleryMedia.length - 1) {
      pauseCurrentVideo()
      setSelectedMediaIndex(selectedMediaIndex + 1)
    }
  }

  // Filter media items based on search query
  const filteredMediaItems = mediaItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredMediaItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredMediaItems.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="WISE Institute"
        title="Gallery"
        description="Explore our case galleries, residency highlights, and training resources"
        backgroundImage="/gallery/wise3.webp"
        overlayClassName="bg-black/50"
        heightClassName="mt-16 lg:mt-20 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px]"
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Gallery' },
        ]}
      />

      {/* Main Content */}
      <section className={`section-padding bg-white ${selectedMediaIndex !== null ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="container-custom">
          {/* Search Bar and Count */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="lg:hidden mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">
                Gallery
              </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="hidden lg:block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
                  Gallery
                </h2>
                <p className="text-sm sm:text-base text-secondary-600">
                  Total {filteredMediaItems.length} items
                </p>
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64 xl:w-80">
                  <input
                    type="text"
                    placeholder="Search by title or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 sm:py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <button
                  type="button"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors flex-shrink-0"
                    aria-label="Add Media"
                    title="Add Media"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <p className="text-sm text-secondary-900">
              Total <span className="text-primary-600 font-semibold">{filteredMediaItems.length}</span> items
            </p>
          </div>

          {/* Gallery Grid */}
          {filteredMediaItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600">No media items found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {paginatedItems.map((item, itemIndex) => {
                  const allMedia = getAllMediaUrls(item)
                  if (allMedia.length === 0) return null

                  const firstMedia = allMedia[0]
                  const originalIndex = mediaItems.findIndex(mi => mi.id === item.id)
                  
                  return (
                    <div
                      key={item.id}
                      className="group relative bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        if (originalIndex >= 0) {
                          openModal(originalIndex)
                        }
                      }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
                        {firstMedia.type === 'video' ? (
                          <VideoFirstFrameThumbnail
                            src={firstMedia.url}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onMouseEnter={(e) => {
                              e.currentTarget.play().catch(() => {})
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause()
                              e.currentTarget.currentTime = 0
                            }}
                          />
                        ) : (
                          <Image
                            src={firstMedia.url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        )}
                        
                        {firstMedia.type === 'video' && (
                          <div className="absolute top-2 left-2 bg-primary-600/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold text-white z-10">
                            Video
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4 bg-white">
                        <h3 className="text-sm sm:text-base font-medium text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 border border-secondary-200 rounded-lg text-xs sm:text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2.5 sm:px-3 py-2 sm:py-2.5 min-w-[36px] sm:min-w-[40px] border rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'border-secondary-200 text-secondary-700 hover:bg-secondary-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-1 sm:px-2 text-secondary-400 text-xs sm:text-sm">...</span>
                      }
                      return null
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 border border-secondary-200 rounded-lg text-xs sm:text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showScrollTop && selectedMediaIndex === null && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-white border border-secondary-200 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-50 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-700" />
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedMediaIndex !== null && allGalleryMedia[selectedMediaIndex] && (
        <div
          className="fixed inset-0 w-full min-h-[100dvh] h-[100dvh] bg-black/95 z-[99999] flex items-center justify-center p-4 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onClick={closeModal}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeModal()
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[100010] min-w-[48px] min-h-[48px] w-12 h-12 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {selectedMediaIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[100010] min-w-[48px] min-h-[48px] w-12 h-12 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors touch-manipulation"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          {selectedMediaIndex < allGalleryMedia.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[100010] min-w-[48px] min-h-[48px] w-12 h-12 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors touch-manipulation"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          <div
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 1 }}
          >
            {allGalleryMedia[selectedMediaIndex].type === 'video' ? (
              <video
                ref={(el) => { lightboxVideoRef.current = el }}
                src={allGalleryMedia[selectedMediaIndex].url}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
                <Image
                  src={allGalleryMedia[selectedMediaIndex].url}
                  alt={allGalleryMedia[selectedMediaIndex].itemTitle}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                  priority
                />
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-black/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    {allGalleryMedia[selectedMediaIndex].itemTitle}
                  </h3>
                  {allGalleryMedia[selectedMediaIndex].itemDescription && (
                    <p className="text-sm sm:text-base text-white/90 line-clamp-2">
                      {allGalleryMedia[selectedMediaIndex].itemDescription}
                    </p>
                  )}
                  {allGalleryMedia[selectedMediaIndex].itemCategory && (
                    <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full text-primary-200 bg-primary-600/30">
                      {allGalleryMedia[selectedMediaIndex].itemCategory}
                    </span>
                  )}
                </div>
                <div className="text-sm sm:text-base text-white/70 flex-shrink-0">
                  {selectedMediaIndex + 1} / {allGalleryMedia.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
