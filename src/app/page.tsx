'use client'

import { ArrowRight, Users, Calendar, Award, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import Logo from '@/components/Logo'
import { useState, useEffect, useRef, type TouchEvent } from 'react'
import Image from 'next/image'
import DiagonalRibbon from '@/components/DiagonalRibbon'
import SectionHeader from '@/components/SectionHeader'
import StatsSection from '@/components/StatsSection'
import FeatureLinksSection from '@/components/FeatureLinksSection'
import ProgramInfoSection from '@/components/ProgramInfoSection'
import NewsSection from '@/components/NewsSection'
import { NewsItem } from '@/lib/news'
import { checkAdminSession } from '@/lib/admin'

function NewsSectionWithCMS({ isAdmin, onEditNews }: { isAdmin: boolean; onEditNews: (newsItem: NewsItem) => void }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          // 최대 4개만 표시
          const items = data.slice(0, 4).map((item: NewsItem) => ({
            ...item,
            onEdit: isAdmin ? () => onEditNews(item) : undefined,
          }));
          setNewsItems(items);
        }
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [isAdmin, onEditNews]);

  // 기본 fallback 데이터
  const defaultNewsItems = [
    {
      category: 'Institute News',
      categoryColor: 'blue' as const,
      title: 'New 2025 Implant Residency Program Dates Announced',
      description: 'WISE Institute is pleased to announce the 2025 schedule for our comprehensive 8-day implant residency program. Registration opens next month.',
      date: '2025-01-15',
      href: '/news'
    },
    {
      category: 'Press Release',
      categoryColor: 'teal' as const,
      title: 'WISE Institute Partners with HiOssen for Enhanced Training',
      description: 'We are excited to announce our continued collaboration with HiOssen AIC Education, bringing advanced implant training to general dentists across Western Canada.',
      date: '2025-12-10',
      href: '/news'
    },
    {
      category: 'Institute News',
      categoryColor: 'blue' as const,
      title: 'Record Number of Doctors Complete 2025 Residency Program',
      description: 'Over 80 doctors completed our implant residency program this year, with 200+ hours of hands-on training and live surgery sessions.',
      date: '2025-11-20',
      href: '/news'
    },
    {
      category: 'Press Release',
      categoryColor: 'teal' as const,
      title: 'WISE Institute Live Surgery Featured at PDC 2025',
      description: 'Dr. Chris Lee and Dr. Stephen Yoon presented live surgery demonstrations at the Pacific Dental Conference, showcasing our hands-on training approach.',
      date: '2025-10-05',
      href: '/news'
    }
  ];

  const displayItems = newsItems.length > 0 
    ? newsItems 
    : defaultNewsItems.map(item => ({
        ...item,
        onEdit: isAdmin ? () => {
          // 기본 뉴스는 편집 불가 (CMS에 없음)
        } : undefined,
      }));

  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <NewsSection
        eyebrow="NEWS"
        title="WISE Institute News"
        description="Stay updated with the latest updates, announcements, and highlights from WISE Institute."
        newsItems={displayItems}
        viewAllText="View all news"
        viewAllHref="/news"
      />
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Campaign slider state (second section)
  const [campaignIndex, setCampaignIndex] = useState(0)

  // Default fallback data
  const defaultCampaignItems = [
    { 
      src: '/gallery/wise.webp', 
      title: 'Implant Residency Campaign',
      description: 'Join our comprehensive 8-day implant residency program designed for general dentists. Experience hands-on training with real patient cases and expert mentorship.',
      ctaText: 'LEARN MORE',
      ctaLink: '/programs'
    },
    { 
      src: '/gallery/wise2.webp', 
      title: 'Live Surgery Study Club',
      description: 'Participate in our live surgery study club sessions where you can observe and learn from real surgical procedures performed by experienced implant specialists.',
      ctaText: 'VIEW SCHEDULE',
      ctaLink: '/schedule'
    },
    { 
      src: '/gallery/wise3.webp', 
      title: 'Residency Highlights',
      description: 'Discover the comprehensive training experience at WISE Institute. From daily hands-on sessions to live surgery days, see what makes our program unique.',
      ctaText: 'EXPLORE GALLERY',
      ctaLink: '/gallery'
    },
    { 
      src: '/gallery/wise4.webp', 
      title: 'Mentorship & Support',
      description: 'Join our residency to build solid surgical fundamentals with daily hands-on sessions and two live surgery days. Learn efficiently and bring predictable results to your clinic.',
      ctaText: 'APPLY NOW',
      ctaLink: '/schedule'
    },
    { 
      src: '/gallery/wise5.webp', 
      title: 'Hands-on Every Day',
      description: 'Experience daily hands-on training sessions that reinforce your learning. Practice implant techniques with expert guidance in a supportive learning environment.',
      ctaText: 'VIEW PROGRAMS',
      ctaLink: '/programs'
    },
    { 
      src: '/gallery/wise6.webp', 
      title: 'Course Materials',
      description: 'Access comprehensive course materials and resources designed to support your learning journey. From surgical guides to clinical protocols, everything you need is included.',
      ctaText: 'LEARN MORE',
      ctaLink: '/programs'
    },
    { 
      src: '/gallery/wise7.webp', 
      title: 'Advanced Training Resources',
      description: 'Benefit from our extensive collection of advanced training resources, including video libraries, case studies, and ongoing support from our expert faculty.',
      ctaText: 'GET STARTED',
      ctaLink: '/schedule'
    },
  ]

  const defaultSlides = [
    {
      subtitle: "From hands-on training to surgical excellence",
      title: "WISE Institute",
      description: "Advanced dental implant education for general dentists across Western Canada",
      ctaText: "LEARN MORE",
      ctaLink: "/about",
      slideLabel: "WISE Institute Education",
      image: "/gallery/wise.webp",
      desktopImage: "/gallery/Wise_Institute_Education.png"
    },
    {
      subtitle: "Hands-on surgical implant education",
      title: "Live Surgery Training",
      description: "Real patient cases under expert supervision",
      ctaText: "VIEW PROGRAMS",
      ctaLink: "/programs",
      slideLabel: "Live Surgery Study Club",
      image: "/gallery/Live_Surgery.png"
    },
    {
      subtitle: "Comprehensive 8-day program",
      title: "Implant Residency",
      description: "Maximize learning in minimal time with 2 live surgery days",
      ctaText: "REGISTER NOW",
      ctaLink: "/schedule",
      slideLabel: "HiOssen F.I.D Course",
      image: "/gallery/HiOssen.jpeg"
    }
  ]

  const [slides, setSlides] = useState(defaultSlides)
  const [campaignItems, setCampaignItems] = useState(defaultCampaignItems)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Additional image states with fallback
  const [statsImage, setStatsImage] = useState('/gallery/wise3.webp')
  const [statsImageType, setStatsImageType] = useState<'image' | 'video'>('image')
  const [featureLeftImage, setFeatureLeftImage] = useState('/gallery/gallery.jpg')
  const [featureLeftImageType, setFeatureLeftImageType] = useState<'image' | 'video'>('image')
  const [featureRightImage, setFeatureRightImage] = useState('/gallery/wise2.webp')
  const [featureRightImageType, setFeatureRightImageType] = useState<'image' | 'video'>('image')
  const [programStoryImages, setProgramStoryImages] = useState(['/gallery/wise2.webp', '/gallery/wise.webp', '/gallery/wise3.webp'])
  const [programStoryImageTypes, setProgramStoryImageTypes] = useState<Array<'image' | 'video'>>(['image', 'image', 'image'])

  // Check admin status and load media items
  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminSession();
      setIsAdmin(adminStatus);
      
    };
    checkAdmin();
  }, []);

  // Load landing page settings from CMS
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/landing-page-settings?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded landing page settings:', data);
          
          if (data.settings) {
            // Hero slides 업데이트
            if (data.settings.heroSlides && data.settings.heroSlides.length > 0) {
              setSlides(data.settings.heroSlides);
            }
            
            // Campaign items 업데이트
            if (data.settings.campaignItems && data.settings.campaignItems.length > 0) {
              setCampaignItems(data.settings.campaignItems);
            }
            
            // Stats image 업데이트 (항상 업데이트, 없으면 fallback 사용)
            setStatsImage(data.settings.statsImage || '/gallery/wise3.webp');
            setStatsImageType(data.settings.statsImageType || 'image');
            
            // Feature left image 업데이트
            setFeatureLeftImage(data.settings.featureLeftImage || '/gallery/gallery.jpg');
            setFeatureLeftImageType(data.settings.featureLeftImageType || 'image');
            
            // Feature right image 업데이트
            setFeatureRightImage(data.settings.featureRightImage || '/gallery/wise2.webp');
            setFeatureRightImageType(data.settings.featureRightImageType || 'image');
            
            // Program story images 업데이트
            if (data.settings.programStoryImages && data.settings.programStoryImages.length > 0) {
              setProgramStoryImages(data.settings.programStoryImages);
              setProgramStoryImageTypes(data.settings.programStoryImageTypes || data.settings.programStoryImages.map(() => 'image'));
            } else {
              // Fallback 사용
              setProgramStoryImages(['/gallery/wise2.webp', '/gallery/wise.webp', '/gallery/wise3.webp']);
              setProgramStoryImageTypes(['image', 'image', 'image']);
            }
          } else {
            // settings가 null이면 fallback 사용
            console.log('No settings found, using fallback images');
          }
        }
      } catch (error) {
        console.error('Error loading landing page settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleRefreshLandingSettings = async () => {
    try {
      // 캐시 방지를 위해 timestamp 추가
      const response = await fetch(`/api/landing-page-settings?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Refreshed landing page settings:', data);
        
        if (data.settings) {
          // Hero slides 업데이트
          if (data.settings.heroSlides && data.settings.heroSlides.length > 0) {
            setSlides(data.settings.heroSlides);
          }
          
          // Campaign items 업데이트
          if (data.settings.campaignItems && data.settings.campaignItems.length > 0) {
            setCampaignItems(data.settings.campaignItems);
          }
          
          // Stats image 업데이트 (항상 업데이트, 없으면 fallback 사용)
          setStatsImage(data.settings.statsImage || '/gallery/wise3.webp');
          setStatsImageType(data.settings.statsImageType || 'image');
          
          // Feature left image 업데이트
          setFeatureLeftImage(data.settings.featureLeftImage || '/gallery/gallery.jpg');
          setFeatureLeftImageType(data.settings.featureLeftImageType || 'image');
          
          // Feature right image 업데이트
          setFeatureRightImage(data.settings.featureRightImage || '/gallery/wise2.webp');
          setFeatureRightImageType(data.settings.featureRightImageType || 'image');
          
          // Program story images 업데이트
          if (data.settings.programStoryImages && data.settings.programStoryImages.length > 0) {
            setProgramStoryImages(data.settings.programStoryImages);
            setProgramStoryImageTypes(data.settings.programStoryImageTypes || data.settings.programStoryImages.map(() => 'image'));
          } else {
            // Fallback 사용
            setProgramStoryImages(['/gallery/wise.webp', '/gallery/wise2.webp', '/gallery/wise3.webp']);
            setProgramStoryImageTypes(['image', 'image', 'image']);
          }
        } else {
          // settings가 null이면 fallback 사용
          console.log('No settings found, using fallback images');
        }
      } else {
        console.error('Failed to refresh landing page settings:', response.status);
      }
    } catch (error) {
      console.error('Error loading landing page settings:', error);
    }
  };


  const nextCampaign = () => {
    setCampaignIndex((i) => (i + 1) % campaignItems.length)
  }
  
  const prevCampaign = () => {
    setCampaignIndex((i) => (i - 1 + campaignItems.length) % campaignItems.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
        autoSlideIntervalRef.current = null
      }
      return
    }

    // Auto-advance slides every 8 seconds
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [isPaused, slides.length])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index)
    // Reset pause state when manually clicking a slide
    setIsPaused(false)
  }

  const [isDesktop, setIsDesktop] = useState(false)

  // Touch handlers for campaign slider (mobile swipe)
  const touchStartXRef = useRef<number | null>(null)
  const [touchOffset, setTouchOffset] = useState(0)
  const [isDraggingCampaign, setIsDraggingCampaign] = useState(false)

  const handleCampaignTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0].clientX
    setTouchOffset(0)
    setIsDraggingCampaign(true)
  }

  const handleCampaignTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return
    setTouchOffset(event.touches[0].clientX - touchStartXRef.current)
  }

  const handleCampaignTouchEnd = () => {
    if (touchStartXRef.current === null) return
    const swipeThreshold = 50
    if (touchOffset <= -swipeThreshold) {
      nextCampaign()
    } else if (touchOffset >= swipeThreshold) {
      prevCampaign()
    }
    setIsDraggingCampaign(false)
    setTouchOffset(0)
    touchStartXRef.current = null
  }

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024)
      }
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return (
    <div>
      {/* Hero Section - 70% height */}
      <section className="relative pt-16 lg:pt-20 bg-white overflow-visible">
        {/* White left margin (10%) - Hidden on mobile */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[10%] bg-white z-[10]" />
        
        {/* Hero Content - 70% height */}
        <div className="relative" style={{ minHeight: '70vh', height: '70vh', maxHeight: '600px' }}>
          {/* Bottom ribbon container - behind image - Full width on mobile, 90% with left margin on desktop */}
          <div className="absolute bottom-0 left-0 right-0 w-full lg:w-[90%] lg:ml-[10%] z-[5]">
            {/* Diagonal Ribbon - behind image, positioned to show below image */}
            {/* Mobile: left-6, Desktop: left-24 */}
            <DiagonalRibbon 
              wrapperClassName="absolute left-6 lg:left-24 right-6 -bottom-2 lg:-bottom-4 pointer-events-none z-[5]" 
              heightClass="h-24" 
              colorClass="bg-primary-600"
              rotateClass="rotate-[-8deg] lg:rotate-[-4deg]"
            />
          </div>
          
          {/* Slides Container - Full width on mobile, 90% with left margin on desktop */}
          <div className="relative w-full lg:w-[90%] lg:ml-[10%] h-full z-[50] bg-white">
            {slides.map((slide, index) => {
              const slideImageSrc =
                isDesktop && slide.desktopImage
                  ? slide.desktopImage
                  : slide.image

              return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1500 ${
                  index === currentSlide 
                    ? 'opacity-100 z-[20]' 
                    : 'opacity-0 z-[10] pointer-events-none'
                }`}
              >
                {/* Background Image Container - covers everything, always has white background */}
                {slideImageSrc ? (
                  <div className="absolute inset-0 overflow-hidden bg-white group/image">
                    <Image
                      src={slideImageSrc}
                      alt={slide.title}
                      fill
                      className="object-cover w-full h-full"
                      priority={index === 0}
                      sizes="100vw"
                      style={{ 
                        objectFit: 'cover', 
                        objectPosition: index === 2 ? 'center 30%' : 'center top' 
                      }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-white" />
                )}

                {/* Slide Content - above image */}
                <div
                  className="relative z-[60] container-custom h-full flex items-center pointer-events-none pb-20 sm:pb-0"
                  data-aos="fade-up"
                >
                  <div className="w-full max-w-3xl">
                    {/* Text shadow for readability on light images */}
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p className="text-sm md:text-base text-white font-medium uppercase tracking-wider">
                          {slide.subtitle}
                        </p>
                      )}
                      
                      {/* Main Title */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                        {slide.title}
                      </h1>
                      
                      {/* Description */}
                      {slide.description && (
                        <p className="text-lg sm:text-xl lg:text-2xl text-white leading-relaxed">
                          {slide.description}
                        </p>
                      )}
                      
                      {/* CTA Button */}
                      {slide.ctaText && (
                        <div className="pt-2 sm:pt-4 pointer-events-auto">
                          <Link 
                            href={slide.ctaLink || '#'}
                            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 sm:px-8 py-2 sm:py-4 font-semibold shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                          >
                            {slide.ctaText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>

          {/* Bottom Navigation Bar - above image */}
          <div className="absolute bottom-0 left-0 right-0 w-full lg:w-[90%] lg:ml-[10%] z-[60]" data-aos="fade-up">
            {/* Bottom Navigation Bar */}
            <div className="relative bg-transparent text-white pointer-events-auto">
              <div className="container-custom pb-2 sm:pb-4 lg:pb-5">
                {/* Navigation Content */}
                <div className="flex items-center justify-between mb-2 sm:mb-4 lg:mb-5">
                  {/* Left Side - Slide Labels with circular icons */}
                  <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 flex-nowrap overflow-x-auto">
                    {slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideClick(index)}
                        className={`flex items-center gap-1 sm:gap-1.5 lg:gap-3 transition-all duration-300 cursor-pointer flex-shrink-0 ${
                          index === currentSlide
                            ? 'text-white'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <span className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-[9px] sm:text-xs lg:text-sm font-medium whitespace-nowrap hidden sm:inline">
                          {slide.slideLabel || slide.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Side - Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    {/* Slide Counter */}
                    <div className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium">
                      <span>{currentSlide + 1}</span>
                      <span>/</span>
                      <span>{slides.length}</span>
                    </div>

                    {/* Pause/Play Button */}
                    <button
                      onClick={togglePause}
                      className="text-white hover:text-white/80 transition-colors"
                      aria-label={isPaused ? 'Play' : 'Pause'}
                    >
                      {isPaused ? (
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar Container - Full width bar with active portion */}
                <div className="relative w-full h-[2px] bg-white/30">
                  {/* Active/Completed portion - white line */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White Spacing Section before WISE Institute Intro */}
      <div className="relative bg-white" style={{ height: '10vh', minHeight: '100px' }} />

      {/* WISE Institute Intro Section (Second Section) */}
      <section className="relative section-padding bg-white overflow-hidden" data-aos="fade-up">
        {/* Watermark text */}
        <div className="pointer-events-none select-none absolute inset-0 hidden md:block z-0">
          <span className="absolute top-8 left-0 text-[16rem] leading-none font-extrabold text-secondary-200/30 tracking-tight">
            WISE
          </span>
          <span className="absolute bottom-0 right-0 text-[16rem] leading-none font-extrabold text-secondary-200/30 tracking-tight">
            INSTITUTE
          </span>
        </div>
        <div className="container-custom relative z-10">
          {/* Heading */}
          <SectionHeader
            eyebrow="WISE Institute"
            title="Hands-on Implant Education"
            description="We design practical, live-surgery focused education so general dentists can confidently bring new skills back to their clinics."
            dataAos="fade-up"
          />

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left column: image with ribbon */}
            <div
              className="relative max-w-sm mx-auto w-full md:max-w-none"
              data-aos="fade-right"
              onTouchStart={handleCampaignTouchStart}
              onTouchMove={handleCampaignTouchMove}
              onTouchEnd={handleCampaignTouchEnd}
            >
              {/* Mobile watermark - positioned to peek out from behind image */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center md:hidden z-[40]">
                <span className="text-[12rem] leading-none font-extrabold text-secondary-200/50 tracking-tight whitespace-nowrap">
                  WISE
                </span>
                <span className="text-[10rem] font-extrabold text-secondary-200/50 tracking-tight whitespace-nowrap">
                  INSTITUTE
                </span>
              </div>
              {/* Bottom ribbon container - behind image */}
              <div className="absolute bottom-0 left-0 right-0 z-[5]">
                <DiagonalRibbon
                  wrapperClassName="absolute left-12 right-12 -bottom-2 pointer-events-none z-[5]"
                  heightClass="h-10"
                  colorClass="bg-primary-600"
                  rotateClass="rotate-[-6deg]"
                />
              </div>
              
              {/* Image container - on top of ribbon with white background to hide ribbon overlap */}
              <div className="relative z-[50] overflow-visible shadow-xl border border-secondary-100 bg-transparent max-w-[80%] sm:max-w-[75%] mx-auto md:max-w-full">
                <div className="absolute inset-0 bg-white z-0" />
                <div className="relative aspect-[3/4] overflow-hidden z-20 bg-white">
                  <div
                    className="absolute inset-0 flex h-full"
                    style={{
                      transform: `translateX(calc(-${campaignIndex * 100}% + ${touchOffset}px))`,
                      transition: isDraggingCampaign ? 'none' : 'transform 400ms ease-out',
                    }}
                  >
                    {campaignItems.map((item, index) => (
                      <div key={item.src || index} className="relative w-full h-full shrink-0 group/image">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: top image + content card */}
            <div className="space-y-8" data-aos="fade-left">
              {/* Top right small image with arrows */}
              <div className="relative hidden md:block" data-aos="fade-left" data-aos-delay="100">
                <div className="overflow-hidden shadow-xl border border-secondary-100 bg-white">
                  <div className="absolute inset-0 bg-white" />
                  <div className="relative aspect-[16/10] overflow-hidden group/image">
                    {/* Current Image - instant change, no animation */}
                    <Image 
                      src={campaignItems[(campaignIndex + 1) % campaignItems.length]?.src || '/gallery/wise2.webp'} 
                      alt={campaignItems[(campaignIndex + 1) % campaignItems.length]?.title || 'Campaign'} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                {/* arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-16 flex flex-col gap-3">
                  <button onClick={prevCampaign} aria-label="Previous" className="w-9 h-9 rounded-full border border-secondary-200 bg-white/90 hover:bg-white transition-colors flex items-center justify-center shadow-sm">
                    <ChevronLeft className="w-4 h-4 text-secondary-700" />
                  </button>
                  <button onClick={nextCampaign} aria-label="Next" className="w-9 h-9 rounded-full border border-secondary-200 bg-white/90 hover:bg-white transition-colors flex items-center justify-center shadow-sm">
                    <ChevronRight className="w-4 h-4 text-secondary-700" />
                  </button>
                </div>
              </div>

              {/* Text card */}
              <div data-aos="fade-up" data-aos-delay="150">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-secondary-900 mb-2 sm:mb-3">
                  {campaignItems[campaignIndex]?.title || 'Implant Residency Campaign'}
                </h3>
                <p className="text-sm sm:text-base text-secondary-600 leading-relaxed max-w-xl">
                  {campaignItems[campaignIndex]?.description || 'Join our residency to build solid surgical fundamentals with daily hands-on sessions and two live surgery days. Learn efficiently and bring predictable results to your clinic.'}
                </p>
                <div className="mt-5">
                  <Link 
                    href={campaignItems[campaignIndex]?.ctaLink || '/schedule'} 
                    className="inline-flex items-center gap-2 text-secondary-900 font-bold hover:text-primary-700 transition-colors"
                  >
                    {campaignItems[campaignIndex]?.ctaText || 'APPLY NOW'}
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                  </Link>
                </div>

                {/* bottom progress / pager */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="h-[2px] bg-secondary-200 w-1/2">
                    <div className="h-full bg-secondary-500" style={{ width: `${((campaignIndex + 1) / campaignItems.length) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-4 text-secondary-500 text-xs">
                    <span>{campaignIndex + 1} / {campaignItems.length}</span>
                    <span className="w-2 h-2 rounded-sm bg-secondary-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <div data-aos="fade-up" data-aos-delay="50">
        <StatsSection
          imageSrc={statsImage}
          imageType={statsImageType}
          eyebrow="PROGRAM STATS"
          title="WISE Institute at a glance"
          description="Hands-on implant education built for busy clinicians — live surgeries, daily practice, and real clinical impact."
          leftStat={{ 
            value: '200+ hours', 
            label: 'Annual teaching hours',
            icon: (
              <Image
                src="/icons/times.webp"
                alt="Hours icon"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
              />
            )
          }}
          rightStat={{ 
            value: '80+ doctors', 
            label: 'Trained per year',
            icon: (
              <Image
                src="/icons/doctors.webp"
                alt="Doctors icon"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
              />
            )
          }}
        />
      </div>

      {/* Feature Links Section */}
      <div data-aos="fade-up" data-aos-delay="100" className="relative">
        <FeatureLinksSection
          eyebrow="RESOURCES"
          title="From live surgeries to real clinic results"
          description="See residency highlights, case galleries and resources that show how WISE training translates into everyday clinical outcomes."
          leftCard={{ 
            imageSrc: featureLeftImage, 
            imageType: featureLeftImageType,
            title: 'WISE Gallery', 
            href: '/gallery', 
            ctaLabel: 'Browse gallery',
          }}
          rightCard={{ 
            imageSrc: featureRightImage, 
            imageType: featureRightImageType,
            title: 'Residency highlights', 
            href: '/programs', 
            ctaLabel: 'View highlights',
          }}
        />
      </div>

      {/* Program Info Section */}
      <div data-aos="fade-up" data-aos-delay="150">
        <ProgramInfoSection
          mainTitle="Training that transforms — it's you"
          infoBlocks={[
            {
              title: 'Program Overview',
              description: 'Comprehensive 8-day residency with 2 live surgery days, daily hands-on practice, and printed materials.',
              href: '/programs'
            },
            {
              title: 'Hands-on Learning',
              description: 'Every session includes practical training using pig jaws for realistic surgical experience.',
              href: '/programs'
            },
            {
              title: 'Course Structure',
              description: 'Designed for busy clinicians — maximize learning in minimal time away from your practice.',
              href: '/schedule'
            },
            {
              title: 'Support & Resources',
              description: 'Printed course notes, mentorship support, and ongoing access to learning materials.',
              href: '/contact'
            }
          ]}
          storyItems={programStoryImages.map((img, idx) => ({
            imageSrc: img,
            imageType: programStoryImageTypes[idx] || 'image',
            caption: idx === 0 
              ? 'Live surgery training with real patient cases.'
              : idx === 1
              ? 'Dentists placing their first implants under expert supervision.'
              : 'Hands-on practice sessions using pig jaws for realistic experience.',
          }))}
          moreLinkText="View more stories"
          moreLinkHref="/programs"
        />
      </div>

      {/* News Section */}
      <NewsSectionWithCMS 
        isAdmin={isAdmin}
        onEditNews={(newsItem) => {
          // 뉴스 편집은 /news 페이지에서 처리
          window.location.href = '/news';
        }}
      />

      {/* Instagram Feed */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="elfsight-app-2e86006e-ae57-4f36-a3a5-1d7a2a0b162f" data-elfsight-app-lazy></div>
        </div>
      </section>

      {/* Elfsight Script */}
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />

    </div>
  )
}
