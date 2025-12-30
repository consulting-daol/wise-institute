'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ChevronLeft, ChevronUp, Edit2 } from 'lucide-react'
import PageHero from '@/components/PageHero'
import { NewsItem } from '@/lib/news'
import { checkAdminSession } from '@/lib/admin'
import NewsEditModal from '@/components/NewsEditModal'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = params?.id as string

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; title: string; thumbnail?: string[] }>>([])

  // Load news item and increment views
  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        const response = await fetch('/api/news')
        if (response.ok) {
          const data = await response.json()
          const item = data.find((item: NewsItem) => item.id === newsId)
          if (item) {
            setNewsItem(item)
            
            // Views 기능 제거됨 (Contentful 업데이트로 인한 성능 이슈)
            // try {
            //   await fetch(`/api/news/${newsId}/increment-views`, {
            //     method: 'POST',
            //   })
            // } catch (error) {
            //   console.error('Failed to increment views:', error)
            // }
          } else {
            // Fallback to default items
            const defaultItems: NewsItem[] = [
              {
                id: '10',
                category: 'Institute News',
                categoryColor: 'blue',
                title: 'New 2025 Implant Residency Program Dates Announced',
                description: 'WISE Institute is pleased to announce the new dates for the 2025 Implant Residency Program. This comprehensive program offers hands-on training and advanced techniques in implant dentistry.',
                date: '2025-01-15',
                href: '/news/10',
                createdAt: new Date().toISOString(),
              },
              {
                id: '9',
                category: 'Press Release',
                categoryColor: 'teal',
                title: 'WISE Institute Partners with HiOssen for Enhanced Training',
                description: 'WISE Institute announces a strategic partnership with HiOssen to provide enhanced training opportunities and access to cutting-edge implant technology for our residents.',
                date: '2025-12-10',
                href: '/news/9',
                createdAt: new Date().toISOString(),
              },
              {
                id: '8',
                category: 'Institute News',
                categoryColor: 'blue',
                title: 'Record Number of Doctors Complete 2025 Residency Program',
                description: 'This year marks a milestone as a record number of doctors successfully completed the WISE Institute Residency Program, demonstrating our commitment to excellence in dental education.',
                date: '2025-11-20',
                href: '/news/8',
                createdAt: new Date().toISOString(),
              },
              {
                id: '7',
                category: 'Press Release',
                categoryColor: 'teal',
                title: 'WISE Institute Live Surgery Featured at PDC 2025',
                description: 'WISE Institute was honored to feature live surgery demonstrations at the prestigious PDC 2025 conference, showcasing advanced implant techniques to an international audience.',
                date: '2025-10-05',
                href: '/news/7',
                createdAt: new Date().toISOString(),
              },
            ]
            const fallbackItem = defaultItems.find(item => item.id === newsId)
            if (fallbackItem) {
              setNewsItem(fallbackItem)
            }
          }
        }
      } catch (error) {
        console.error('Error loading news item:', error)
      } finally {
        setLoading(false)
      }
    }
    loadNewsItem()
  }, [newsId])

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminSession()
      setIsAdmin(adminStatus)
      
      if (adminStatus) {
        try {
          const mediaResponse = await fetch('/api/media')
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json()
            setMediaItems(mediaData)
          }
        } catch (error) {
          console.error('Error loading media items:', error)
        }
      }
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

  const handleRefreshNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        const item = data.find((item: NewsItem) => item.id === newsId)
        if (item) {
          setNewsItem(item)
        }
      }
    } catch (error) {
      console.error('Error loading news:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-secondary-600">Loading...</div>
      </div>
    )
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-white">
        <PageHero
          eyebrow="WISE Institute"
          title="News Not Found"
          backgroundImage="/gallery/wise3.webp"
          overlayClassName="bg-black/50"
          heightClassName="mt-16 lg:mt-20 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px]"
          breadcrumbs={[
            { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
            { label: 'News', href: '/news' },
            { label: 'Not Found' },
          ]}
        />
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center py-12">
              <p className="text-secondary-600 mb-4">The news item you're looking for doesn't exist.</p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to News
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="WISE Institute"
        title={newsItem.title}
        backgroundImage={newsItem.image || '/gallery/wise3.webp'}
        overlayClassName="bg-black/50"
        heightClassName="mt-16 lg:mt-20 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px]"
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'News', href: '/news' },
          { label: newsItem.title },
        ]}
      />

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back to News</span>
            </Link>
          </div>

          {/* News Detail Card */}
          <div className="bg-white border border-secondary-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="border-b border-secondary-200 bg-secondary-50 px-4 sm:px-6 py-4 sm:py-4">
              {/* Mobile Layout */}
              <div className="sm:hidden flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Category */}
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        newsItem.categoryColor === 'blue'
                          ? 'text-blue-600 bg-blue-50'
                          : newsItem.categoryColor === 'teal'
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-600 bg-secondary-50'
                      }`}
                    >
                      {newsItem.category}
                    </span>
                    {/* Date */}
                    <span className="text-xs text-secondary-600">
                      {newsItem.date}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowNewsModal(true)
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop/Tablet Layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Category */}
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      newsItem.categoryColor === 'blue'
                        ? 'text-blue-600 bg-blue-50'
                        : newsItem.categoryColor === 'teal'
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 bg-secondary-50'
                    }`}
                  >
                    {newsItem.category}
                  </span>
                  {/* Date */}
                  <span className="text-sm text-secondary-600">
                    {newsItem.date}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowNewsModal(true)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight">
                {newsItem.title}
              </h1>

              {/* Image */}
              {newsItem.image && (
                <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden">
                  <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
                    <Image
                      src={newsItem.image}
                      alt={newsItem.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, (max-width: 1200px) 80vw, 1200px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div className="text-sm sm:text-base lg:text-lg text-secondary-700 leading-relaxed sm:leading-loose whitespace-pre-line">
                  {newsItem.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-white border border-secondary-200 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-50 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-700" />
        </button>
      )}

      {/* News Edit Modal */}
      {isAdmin && newsItem && (
        <NewsEditModal
          isOpen={showNewsModal}
          onClose={() => {
            setShowNewsModal(false)
          }}
          onSave={handleRefreshNews}
          newsItem={newsItem}
          mediaItems={mediaItems}
        />
      )}
    </div>
  )
}

