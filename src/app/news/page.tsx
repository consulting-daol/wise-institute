'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Home, ChevronUp } from 'lucide-react'
import PageHero from '../../components/PageHero'

type NewsItem = {
  id: number
  category: string
  categoryColor: string
  title: string
  date: string
  views: number
  href?: string
}

const newsItems: NewsItem[] = [
  {
    id: 10,
    category: 'Institute News',
    categoryColor: 'blue',
    title: 'New 2025 Implant Residency Program Dates Announced',
    date: '2025-01-15',
    views: 0,
    href: '/news/10'
  },
  {
    id: 9,
    category: 'Press Release',
    categoryColor: 'teal',
    title: 'WISE Institute Partners with HiOssen for Enhanced Training',
    date: '2024-12-10',
    views: 0,
    href: '/news/9'
  },
  {
    id: 8,
    category: 'Institute News',
    categoryColor: 'blue',
    title: 'Record Number of Doctors Complete 2024 Residency Program',
    date: '2024-11-20',
    views: 0,
    href: '/news/8'
  },
  {
    id: 7,
    category: 'Press Release',
    categoryColor: 'teal',
    title: 'WISE Institute Live Surgery Featured at PDC 2024',
    date: '2024-10-05',
    views: 0,
    href: '/news/7'
  },
  {
    id: 6,
    category: 'Institute News',
    categoryColor: 'blue',
    title: '2024 Fall Residency Program Successfully Completed',
    date: '2024-09-15',
    views: 0,
    href: '/news/6'
  },
  {
    id: 5,
    category: 'Press Release',
    categoryColor: 'teal',
    title: 'New Hands-on Training Facilities Open',
    date: '2024-08-20',
    views: 0,
    href: '/news/5'
  },
  {
    id: 4,
    category: 'Institute News',
    categoryColor: 'blue',
    title: 'Summer Live Surgery Study Club Concludes',
    date: '2024-07-10',
    views: 0,
    href: '/news/4'
  },
  {
    id: 3,
    category: 'Press Release',
    categoryColor: 'teal',
    title: 'WISE Institute Announces Partnership with Local Clinics',
    date: '2024-06-25',
    views: 0,
    href: '/news/3'
  },
  {
    id: 2,
    category: 'Institute News',
    categoryColor: 'blue',
    title: 'Spring Residency Program Graduates 40 Doctors',
    date: '2024-05-15',
    views: 0,
    href: '/news/2'
  },
  {
    id: 1,
    category: 'Press Release',
    categoryColor: 'teal',
    title: 'WISE Institute Expands Course Offerings',
    date: '2024-04-10',
    views: 0,
    href: '/news/1'
  }
]

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [views, setViews] = useState<Record<number, number>>({})

  // Load views from localStorage on mount
  // Note: When DB is connected, views should be fetched from the server/API
  useEffect(() => {
    const storedViews = localStorage.getItem('newsViews')
    if (storedViews) {
      try {
        const parsedViews = JSON.parse(storedViews)
        // Merge with current newsItems to ensure all items have view counts
        const mergedViews: Record<number, number> = {}
        newsItems.forEach((item) => {
          mergedViews[item.id] = parsedViews[item.id] ?? item.views
        })
        setViews(mergedViews)
      } catch (e) {
        console.error('Error loading views from localStorage:', e)
        // Initialize with default views (0) if parsing fails
        const initialViews: Record<number, number> = {}
        newsItems.forEach((item) => {
          initialViews[item.id] = item.views
        })
        setViews(initialViews)
      }
    } else {
      // Initialize with default views (0)
      const initialViews: Record<number, number> = {}
      newsItems.forEach((item) => {
        initialViews[item.id] = item.views
      })
      setViews(initialViews)
      localStorage.setItem('newsViews', JSON.stringify(initialViews))
    }
  }, [])

  // Get view count for a news item
  // TODO: When DB is connected, fetch views from API/server instead
  const getViewCount = (id: number) => {
    // First check if we have a view count in state (from localStorage or DB)
    if (views[id] !== undefined) {
      return views[id]
    }
    // Fallback to item's default view count (should be 0)
    return newsItems.find((item) => item.id === id)?.views ?? 0
  }

  // Handle news item click to increment views
  // TODO: When DB is connected, increment views via API call
  const handleNewsClick = (id: number, href?: string) => {
    // Check if this news was already viewed today (prevent multiple counts per day)
    const viewedTodayKey = `newsViewed_${id}_${new Date().toDateString()}`
    const hasViewedToday = localStorage.getItem(viewedTodayKey)

    if (!hasViewedToday) {
      // Increment views only if not viewed today
      const currentViews = views[id] ?? newsItems.find((item) => item.id === id)?.views ?? 0
      const newViews = {
        ...views,
        [id]: currentViews + 1,
      }
      setViews(newViews)
      
      // Save to localStorage (temporary solution until DB is connected)
      localStorage.setItem('newsViews', JSON.stringify(newViews))
      localStorage.setItem(viewedTodayKey, 'true')
      
      // TODO: When DB is connected, call API to increment views:
      // await incrementNewsViews(id)
    }
    
    // Navigate to news detail page (if href is provided)
    if (href) {
      // Use Next.js router for client-side navigation if possible
      window.location.href = href
    }
  }

  // Filter news items based on search query
  const filteredNews = newsItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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


  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Wise Institute"
        title="WISE Institute News"
        backgroundImage="/gallery/wise3.png"
        overlayClassName="bg-black/50"
        heightClassName="mt-16 lg:mt-20 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px]"
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'News' },
        ]}
        breadcrumbWrapperClassName="bg-primary-600 lg:bg-white lg:border-b lg:border-secondary-200"
        breadcrumbInnerClassName="py-3 sm:py-4"
        containerClassName="container-custom"
      />

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search Bar - Mobile: below title, Desktop: top right */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Title and Count - Desktop only */}
              <div className="hidden lg:block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
                  WISE Institute News
                </h2>
                <p className="text-sm sm:text-base text-secondary-600">
                  Total {filteredNews.length} items
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64 xl:w-80">
                  <input
                    type="text"
                    placeholder="Search news..."
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
              </div>
            </div>
          </div>

          {/* Total Count - Mobile: shown above list */}
          <div className="lg:hidden mb-4">
            <p className="text-sm text-secondary-900">
              Total <span className="text-blue-600 font-semibold">{filteredNews.length}</span> items
            </p>
          </div>

          {/* News List Table */}
          <div className="border-t border-b border-secondary-200">
            {/* Table Header - Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 py-4 bg-secondary-50 border-b border-secondary-200">
              <div className="col-span-1 text-center text-sm font-bold text-secondary-900">
                No.
              </div>
              <div className="col-span-6 text-sm font-bold text-secondary-900">
                Title
              </div>
              <div className="col-span-2 text-center text-sm font-bold text-secondary-900">
                Date
              </div>
              <div className="col-span-3 text-center text-sm font-bold text-secondary-900">
                Views
              </div>
            </div>

            {/* News Items */}
            <div className="divide-y divide-secondary-200">
              {filteredNews.length === 0 ? (
                <div className="py-12 text-center text-secondary-600">
                  No news items found.
                </div>
              ) : (
                filteredNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNewsClick(item.id, item.href)}
                    className="block hover:bg-secondary-50 transition-colors cursor-pointer"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 py-4">
                      {/* Number */}
                      <div className="col-span-1 flex items-center justify-center text-sm text-secondary-600">
                        {item.id}
                      </div>

                      {/* Title with Category */}
                      <div className="col-span-6">
                        <div className="flex items-center gap-3">
                          {/* Category */}
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                              item.categoryColor === 'blue'
                                ? 'text-blue-600 bg-blue-50'
                                : item.categoryColor === 'teal'
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-secondary-600 bg-secondary-50'
                            }`}
                          >
                            {item.category}
                          </span>
                          {/* Title */}
                          <h3 className="text-sm text-secondary-900 font-medium hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 flex items-center justify-center text-sm text-secondary-600">
                        {item.date}
                      </div>

                      {/* Views */}
                      <div className="col-span-3 flex items-center justify-center text-sm text-secondary-600">
                        {getViewCount(item.id).toLocaleString()}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden py-3 sm:py-4 px-4">
                      <div className="flex items-start gap-3">
                        {/* Left: Number (top-left) and Category/Title */}
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          {/* Number - small, light gray, vertically aligned with category */}
                          <span className="text-xs text-secondary-400 flex-shrink-0 pt-0.5">
                            {item.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            {/* Category */}
                            <div className="mb-1.5">
                              <span
                                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                  item.categoryColor === 'blue'
                                    ? 'text-blue-600 bg-blue-50'
                                    : item.categoryColor === 'teal'
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-secondary-600 bg-secondary-50'
                                }`}
                              >
                                {item.category}
                              </span>
                            </div>
                            {/* Title */}
                            <h3 className="text-sm text-secondary-900 font-medium leading-relaxed">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        {/* Right: Date and Views - stacked, right aligned */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs text-secondary-600 whitespace-nowrap">
                            {item.date}
                          </span>
                          <span className="text-xs text-secondary-600 whitespace-nowrap">
                            {getViewCount(item.id).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination - Placeholder for future implementation */}
          {filteredNews.length > 10 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {/* Pagination buttons can be added here */}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-secondary-200 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-50 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 text-secondary-700" />
        </button>
      )}
    </div>
  )
}

