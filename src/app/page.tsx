'use client'

import { ArrowRight, Users, Calendar, Award, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import DiagonalRibbon from '@/components/DiagonalRibbon'
import SectionHeader from '@/components/SectionHeader'
import StatsSection from '@/components/StatsSection'
import FeatureLinksSection from '@/components/FeatureLinksSection'
import ProgramInfoSection from '@/components/ProgramInfoSection'
import NewsSection from '@/components/NewsSection'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Campaign slider state (second section)
  const [campaignIndex, setCampaignIndex] = useState(0)

  // You can replace these with your own images later
  const campaignItems = [
    { src: '/gallery/wise.png', title: 'Implant Residency Campaign' },
    { src: '/gallery/wise2.png', title: 'Live Surgery Study Club' },
    { src: '/gallery/wise3.png', title: 'Residency Highlights' },
    { src: '/gallery/wise4.png', title: 'Mentorship & Support' },
    { src: '/gallery/wise5.png', title: 'Hands-on Every Day' },
    { src: '/gallery/wise6.png', title: 'Course Materials' },
    { src: '/gallery/wise7.png', title: 'Course Materials' },
  ]

  const nextCampaign = () => {
    setCampaignIndex((i) => (i + 1) % campaignItems.length)
  }
  
  const prevCampaign = () => {
    setCampaignIndex((i) => (i - 1 + campaignItems.length) % campaignItems.length)
  }

  const slides = [
    {
      subtitle: "From hands-on training to surgical excellence",
      title: "WISE Institute",
      description: "AI-powered dental implant education for general dentists across Western Canada",
      ctaText: "",
      ctaLink: "",
      slideLabel: "WISE Institute Education",
      image: "/gallery/wise.png"
    },
    {
      subtitle: "Hands-on surgical implant education",
      title: "Live Surgery Training",
      description: "Real patient cases under expert supervision",
      ctaText: "",
      ctaLink: "",
      slideLabel: "Live Surgery Study Club",
      image: "/gallery/wise2.png"
    },
    {
      subtitle: "Comprehensive 8-day program",
      title: "Implant Residency",
      description: "Maximize learning in minimal time with 2 live surgery days",
      ctaText: "",
      ctaLink: "",
      slideLabel: "HiOssen F.I.D Course",
      image: "/gallery/wise3.png"
    }
  ]

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

    // Auto-advance slides every 5 seconds
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

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
              wrapperClassName="absolute left-6 lg:left-24 right-6 -bottom-2 lg:-bottom-8 z-[5] pointer-events-none" 
              heightClass="h-24" 
              colorClass="bg-primary-600"
              rotateClass="rotate-[-8deg] lg:rotate-[-4deg]"
            />
          </div>
          
          {/* Slides Container - Full width on mobile, 90% with left margin on desktop */}
          <div className="relative w-full lg:w-[90%] lg:ml-[10%] h-full z-[50] bg-white">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 ${
                  index === currentSlide 
                    ? 'opacity-100 z-10' 
                    : 'opacity-0 z-[5] pointer-events-none'
                } transition-opacity duration-1000`}
              >
                {/* Background Image Container - covers everything, always has white background */}
                {slide.image && (
                  <div className="absolute inset-0 overflow-hidden bg-white">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover w-full h-full"
                      priority={index === 0}
                      sizes="100vw"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>
                )}
                {/* Fallback white background if no image - ensures ribbon is always covered */}
                {!slide.image && (
                  <div className="absolute inset-0 bg-white" />
                )}

                {/* Slide Content - above image */}
                <div
                  className="relative z-[60] container-custom h-full flex items-center pointer-events-none"
                  data-aos="fade-up"
                >
                  <div className="w-full max-w-3xl">
                    {/* Text shadow for readability on light images */}
                    <div className="space-y-6 lg:space-y-8 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
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
                        <div className="pt-4 pointer-events-auto">
                          <Link 
                            href={slide.ctaLink}
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
                          >
                            {slide.ctaText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Navigation Bar - above image */}
          <div className="absolute bottom-0 left-0 right-0 z-[60]" data-aos="fade-up">
            {/* Bottom Navigation Bar */}
            <div className="relative bg-transparent text-white pointer-events-auto">
              <div className="container-custom pb-4 lg:pb-5">
                {/* Navigation Content */}
                <div className="flex items-center justify-between mb-4 lg:mb-5">
                  {/* Left Side - Slide Labels with circular icons */}
                  <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
                    {slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideClick(index)}
                        className={`flex items-center gap-2 lg:gap-3 transition-all duration-300 cursor-pointer ${
                          index === currentSlide
                            ? 'text-white'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <span className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                          {slide.slideLabel}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Side - Controls */}
                  <div className="flex items-center gap-3 lg:gap-4">
                    {/* Slide Counter */}
                    <div className="flex items-center gap-1 text-white text-sm font-medium">
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
        <div className="pointer-events-none select-none absolute inset-0 hidden xl:block">
          <span className="absolute top-8 left-0 text-[16rem] leading-none font-extrabold text-secondary-200/30 tracking-tight">
            WISE
          </span>
          <span className="absolute bottom-0 right-0 text-[16rem] leading-none font-extrabold text-secondary-200/30 tracking-tight">
            INSTITUTE
          </span>
        </div>

        <div className="container-custom relative">
          {/* Heading */}
          <SectionHeader
            eyebrow="Wise Institute"
            title="Hands-on Implant Education"
            description="We design practical, live-surgery focused education so general dentists can confidently bring new skills back to their clinics."
            dataAos="fade-up"
          />

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column: image with ribbon */}
            <div className="relative" data-aos="fade-right">
              {/* Bottom ribbon container - behind image */}
              <div className="absolute bottom-0 left-0 right-0 z-[5]">
                <DiagonalRibbon
                  wrapperClassName="absolute left-6 right-6 -bottom-2 pointer-events-none z-[5]"
                  heightClass="h-20"
                  colorClass="bg-primary-600"
                  rotateClass="rotate-[-6deg]"
                />
              </div>
              
              {/* Image container - on top of ribbon with white background to hide ribbon overlap */}
              <div className="relative z-[50] overflow-hidden shadow-xl border border-secondary-100 bg-white">
                <div className="absolute inset-0 bg-white" />
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Current Image - instant change, no animation */}
                  <Image 
                    src={campaignItems[campaignIndex].src} 
                    alt={campaignItems[campaignIndex].title} 
                    fill 
                    className="object-cover" 
                    priority={campaignIndex === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Right column: top image + content card */}
            <div className="space-y-8" data-aos="fade-left">
              {/* Top right small image with arrows */}
              <div className="relative" data-aos="fade-left" data-aos-delay="100">
                <div className="overflow-hidden shadow-xl border border-secondary-100 bg-white">
                  <div className="absolute inset-0 bg-white" />
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Current Image - instant change, no animation */}
                    <Image 
                      src={campaignItems[(campaignIndex + 1) % campaignItems.length].src} 
                      alt={campaignItems[(campaignIndex + 1) % campaignItems.length].title} 
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
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-secondary-900 mb-2 sm:mb-3">{campaignItems[campaignIndex].title}</h3>
                <p className="text-sm sm:text-base text-secondary-600 leading-relaxed max-w-xl">
                  Join our residency to build solid surgical fundamentals with daily hands‑on sessions and two live surgery days. Learn efficiently and bring predictable results to your clinic.
                </p>
                <div className="mt-5">
                  <Link href="/schedule" className="inline-flex items-center gap-2 text-secondary-900 font-bold hover:text-primary-700">
                    Apply Now
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
          imageSrc="/gallery/wise3.png"
          eyebrow="PROGRAM STATS"
          title="WISE Institute at a glance"
          description="Hands-on implant education built for busy clinicians — live surgeries, daily practice, and real clinical impact."
          leftStat={{ 
            value: '200+ hours', 
            label: 'Annual teaching hours',
            icon: (
              <Image
                src="/icons/times.png"
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
                src="/icons/doctors.png"
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
      <div data-aos="fade-up" data-aos-delay="100">
        <FeatureLinksSection
          eyebrow="RESOURCES"
          title="From live surgeries to real clinic results"
          description="See residency highlights, case galleries and resources that show how WISE training translates into everyday clinical outcomes."
          leftCard={{ imageSrc: '/gallery/wise.png', title: 'Case gallery', href: '/gallery', ctaLabel: 'Browse gallery' }}
          rightCard={{ imageSrc: '/gallery/wise2.png', title: 'Residency highlights', href: '/programs', ctaLabel: 'View highlights' }}
        />
      </div>

      {/* Program Info Section */}
      {/* Featured Programs - Commented out
      featuredPrograms={[
        {
          icon: <Award className="h-8 w-8 text-white" />,
          iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
          title: 'Implant Residency',
          features: [
            '8-day intensive program with 2 live surgery days',
            'Designed for busy clinicians — maximize learning in minimal time',
            'Includes printed course notes for review',
            'Hands-on every day using pig jaws'
          ],
          buttonText: 'Learn More',
          buttonHref: '/programs',
          buttonClass: 'btn-primary',
          dotColor: 'bg-primary-500'
        },
        {
          icon: <Users className="h-8 w-8 text-white" />,
          iconBg: 'bg-gradient-to-br from-accent-500 to-accent-600',
          title: 'Live Surgery Study Club',
          features: [
            'Real patient cases — dentists bring their own patients',
            'Paired learning: perform & assist under supervision',
            'Direct mentorship from Dr. Lee and Dr. Yoon',
            'Confidence to apply skills in your clinic'
          ],
          buttonText: 'Learn More',
          buttonHref: '/programs',
          buttonClass: 'btn-accent',
          dotColor: 'bg-accent-500'
        }
      ]}
      featuredProgramsTitle="Featured Programs"
      featuredProgramsDescription="Choose from our comprehensive range of implant education programs designed for busy clinicians."
      */}
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
          storyItems={[
            {
              imageSrc: '/gallery/wise.png',
              caption: 'Dentists placing their first implants under expert supervision.'
            },
            {
              imageSrc: '/gallery/wise2.png',
              caption: 'Live surgery training with real patient cases.'
            },
            {
              imageSrc: '/gallery/wise3.png',
              caption: 'Hands-on practice sessions using pig jaws for realistic experience.'
            }
          ]}
          moreLinkText="View more stories"
          moreLinkHref="/stories"
        />
      </div>

      {/* News Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <NewsSection
          eyebrow="NEWS"
          title="WISE Institute News"
          description="Stay updated with the latest updates, announcements, and highlights from WISE Institute."
          newsItems={[
            {
              category: 'Institute News',
              categoryColor: 'blue',
              title: 'New 2025 Implant Residency Program Dates Announced',
              description: 'WISE Institute is pleased to announce the 2025 schedule for our comprehensive 8-day implant residency program. Registration opens next month.',
              date: '2025-01-15',
              href: '/news'
            },
            {
              category: 'Press Release',
              categoryColor: 'teal',
              title: 'WISE Institute Partners with HiOssen for Enhanced Training',
              description: 'We are excited to announce our continued collaboration with HiOssen AIC Education, bringing advanced implant training to general dentists across Western Canada.',
              date: '2024-12-10',
              href: '/news'
            },
            {
              category: 'Institute News',
              categoryColor: 'blue',
              title: 'Record Number of Doctors Complete 2024 Residency Program',
              description: 'Over 80 doctors completed our implant residency program this year, with 200+ hours of hands-on training and live surgery sessions.',
              date: '2024-11-20',
              href: '/news'
            },
            {
              category: 'Press Release',
              categoryColor: 'teal',
              title: 'WISE Institute Live Surgery Featured at PDC 2024',
              description: 'Dr. Chris Lee and Dr. Stephen Yoon presented live surgery demonstrations at the Pacific Dental Conference, showcasing our hands-on training approach.',
              date: '2024-10-05',
              href: '/news'
            }
          ]}
          viewAllText="View all news"
          viewAllHref="/news"
        />
      </div>
    </div>
  )
}
