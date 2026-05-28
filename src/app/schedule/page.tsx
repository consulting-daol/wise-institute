'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, Clock, Users, MapPin, CheckCircle, ArrowRight, Home, Mail } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '@/components/CallToActionBanner'
import SquarePaymentButton from '@/components/SquarePaymentButton'
import { useReCaptchaToken } from '@/hooks/useReCaptchaToken'
import { Program, DEFAULT_PROGRAMS } from '@/lib/programs'
import RegistrationPaymentPrompt from '@/components/RegistrationPaymentPrompt'
import {
  getResidencyPaymentOptions,
  getSponsorshipPaymentOption,
  getStudyClubPaymentOption,
} from '@/lib/squarePayments'

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clinic: '',
    experience: '',
    program: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submittedProgram, setSubmittedProgram] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const paymentPromptRef = useRef<HTMLDivElement>(null)
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS)
  const { getToken } = useReCaptchaToken('registration')
  const websiteRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/programs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPrograms(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (submitStatus !== 'success') return
    paymentPromptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [submitStatus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      const recaptchaToken = await getToken()
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
          website: websiteRef.current?.value ?? '',
        }),
      })
      if (response.ok) {
        setSubmittedProgram(formData.program)
        setSubmitStatus('success')
        setFormData({ name: '', email: '', clinic: '', experience: '', program: '', message: '' })
      } else {
        const errData = await response.json().catch(() => ({}))
        setErrorMessage(errData?.error ?? 'Something went wrong')
        setSubmitStatus('error')
      }
    } catch {
      setErrorMessage('Failed to submit. Please try again.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const upcomingPrograms = programs

  type TimelineItem = {
    title: string
    dates: string
    status: Program['status']
    tag: 'Residency' | 'Study Club' | 'Event'
  }

  const timelineItems: TimelineItem[] = upcomingPrograms
    .filter((p) => p.isVisible !== false)
    .flatMap((program): TimelineItem[] => {
      if (program.type === "Residency") {
        const dates =
          program.timelineDates ??
          (program.startDate === program.endDate
            ? program.startDate
            : `${program.startDate} – ${program.endDate}`)
        return [
          {
            title: program.title,
            dates,
            status: program.status,
            tag: 'Residency',
          },
        ]
      }

      if (program.type === "Study Club") {
        const moduleDates = program.moduleDates ?? []
        if (moduleDates.length === 0) {
          // If the admin didn't provide per-session dates, at least show the main startDate.
          return [
            {
              title: program.title,
              dates: program.startDate,
              status: program.status,
              tag: 'Study Club',
            },
          ]
        }

        return moduleDates.map((md) => {
          const isCompleted = md.includes("[completed]")
          const label = md.replace(" [completed]", "")
          return {
            title: program.title,
            dates: label,
            status: isCompleted ? "Completed" : program.status,
            tag: 'Study Club',
          }
        })
      }

      // Event (fallback)
      const dates =
        program.startDate === program.endDate
          ? program.startDate
          : `${program.startDate} – ${program.endDate}`

      return [
        {
          title: program.title,
          dates,
          status: program.status,
          tag: 'Event',
        },
      ]
    })

  const snapshotHighlights = [
    {
      title: 'Live Surgery Mentorship',
      value: '2 days',
      description: 'Each cohort includes two guided live surgeries.',
      icon: <Calendar className="h-5 w-5 text-primary-700" />,
      accent: 'bg-primary-50 ring-primary-600/10',
    },
    {
      title: 'Hands-On Sessions',
      value: 'Daily',
      description: 'Pig jaw labs and guided hands-on practice each day.',
      icon: <Clock className="h-5 w-5 text-secondary-700" />,
      accent: 'bg-secondary-50 ring-secondary-500/20',
    },
    {
      title: 'Small Cohorts',
      value: '20 doctors',
      description: 'Limited seats ensure direct feedback and meaningful surgical practice.',
      icon: <Users className="h-5 w-5 text-accent-600" />,
      accent: 'bg-accent-50 ring-accent-500/15',
    },
    {
      title: 'Clinic Ready',
      value: 'Immediate',
      description: 'Walk away with protocols you can implement the moment you’re back in your clinic.',
      icon: <MapPin className="h-5 w-5 text-primary-700" />,
      accent: 'bg-primary-50 ring-primary-500/15',
    },
  ]

  const sponsorshipPayment = getSponsorshipPaymentOption()

  const renderProgramCard = (program: Program, index: number, isMobile = false) => {
    const isResidency = program.type === 'Residency'
    const isEvent = program.type === 'Event'
    const isStudyClub = program.type === 'Study Club'
    const residencyPayments = isResidency ? getResidencyPaymentOptions() : []
    const studyClubPayment = isStudyClub ? getStudyClubPaymentOption() : undefined
    const accentGradient = isResidency
      ? 'from-primary-500/25 via-primary-500/10 to-transparent'
      : isEvent
      ? 'from-accent-500/25 via-accent-500/10 to-transparent'
      : 'from-secondary-500/25 via-secondary-500/10 to-transparent'
    const badgeColor = isResidency ? 'bg-primary/10 text-primary' : isEvent ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
    const iconColor = isResidency ? 'text-primary' : isEvent ? 'text-accent' : 'text-secondary'

    return (
      <div
        key={`${program.id}-${isMobile ? 'mobile' : 'desktop'}`}
        data-aos="fade-up"
        data-aos-delay={index * 100}
        className={`group relative rounded-3xl border border-white/70 bg-white/90 backdrop-blur-sm p-5 sm:p-10 shadow-lg overflow-hidden flex flex-col ${
          isMobile ? 'min-w-[85%] snap-start' : ''
        }`}
      >
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="relative flex flex-col flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold ${badgeColor}`}>
              {program.type}
            </span>
            <span
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold ${
                program.status === 'Open'
                  ? 'bg-emerald-100 text-emerald-700'
                  : program.status === 'Waitlist'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {program.status}
            </span>
            {isStudyClub && (
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold bg-teal-100 text-teal-700">
                Ongoing
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-3xl font-extrabold text-secondary mb-1.5 sm:mb-3 leading-tight">{program.title}</h3>
          <p className="text-secondary-600 mb-4 sm:mb-6 text-[13px] sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">{program.description}</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div className="flex items-start gap-2 sm:gap-3 col-span-2 lg:col-span-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500">Dates</p>
                {program.moduleDates ? (
                  <div className="text-xs sm:text-sm font-medium text-secondary-900 space-y-0.5 sm:space-y-1">
                    {program.moduleDates.map((date, idx) => {
                      const isCompleted = date.includes('[completed]')
                      const label = date.replace(' [completed]', '')
                      return (
                        <p
                          key={idx}
                          className={
                            isCompleted
                              ? 'line-through text-secondary-400'
                              : date.includes('Live Surgery')
                              ? 'font-semibold text-primary'
                              : ''
                          }
                        >
                          {isCompleted ? `${label} ✓` : label}
                        </p>
                      )
                    })}
                    {isResidency && (
                      <p className="text-secondary-600 text-[11px] sm:text-xs mt-1">9:00 am – 5:00 pm</p>
                    )}
                    {isStudyClub && (
                      <p className="text-secondary-600 text-[11px] sm:text-xs mt-1">8:00 AM – 5:00 PM</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-secondary-900">
                    {program.startDate === program.endDate ? program.startDate : `${program.startDate} – ${program.endDate}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500">Duration</p>
                <p className="text-xs sm:text-sm font-medium text-secondary-900">{program.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500">Capacity</p>
                <p className="text-xs sm:text-sm font-medium text-secondary-900">{program.capacity}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 col-span-2 lg:col-span-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500">Location</p>
                <p className="text-xs sm:text-sm font-medium text-secondary-900">{program.location}</p>
              </div>
            </div>
          </div>

          {(program.price || program.ceCredits) && (
            <div className="mb-5 sm:mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                {program.price && (
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-primary-600 font-semibold">Price</p>
                    <p className="text-sm sm:text-base font-bold text-primary">{program.price}</p>
                  </div>
                )}
                {program.ceCredits && (
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-secondary/10 border border-secondary/20">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold">CE Credits</p>
                    <p className="text-sm sm:text-base font-bold text-secondary">{program.ceCredits}</p>
                  </div>
                )}
              </div>
              {isResidency && (
                <div className="bg-secondary-50 rounded-xl p-3 sm:p-4 border border-secondary-200">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold mb-1.5 sm:mb-2">Pricing Options</p>
                  <div className="text-[13px] sm:text-sm text-secondary-700 space-y-0.5 sm:space-y-1">
                    <p><span className="font-semibold">$9,500 CAD</span> + Tax — Modules 1-4 (Live Surgery)</p>
                    <p><span className="font-semibold">$7,500 CAD</span> + Tax — Modules 1-3 (No Surgery)</p>
                  </div>
                  {residencyPayments.length > 0 && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-secondary-200 space-y-2">
                      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold">Pay by credit card</p>
                      <div className="flex flex-col gap-2">
                        {residencyPayments.map((option) => (
                          <SquarePaymentButton
                            key={option.url}
                            href={option.url}
                            label={option.label}
                            variant="outline"
                          />
                        ))}
                      </div>
                      <p className="text-[11px] sm:text-xs text-secondary-500 leading-snug">
                        Payment and registration are separate. After paying, please also{' '}
                        <a href="#registration-form" className="text-primary-600 hover:text-primary-700 font-medium underline">
                          complete the registration form
                        </a>{' '}
                        so we can confirm your seat. Tax is calculated at checkout.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {isStudyClub && (
                <div className="bg-secondary-50 rounded-xl p-3 sm:p-4 border border-secondary-200">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold mb-2 sm:mb-3">What&apos;s Included</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[13px] sm:text-sm text-secondary-700">
                    {[
                      'Case presentations & planning',
                      'Live surgical execution',
                      'Work up the cases',
                      'Case review & recap',
                      'Real-time feedback from Dr. Yoon',
                      'Small-group setting',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  {studyClubPayment && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-secondary-200 space-y-2">
                      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold">Pay by credit card</p>
                      <SquarePaymentButton
                        href={studyClubPayment.url}
                        label={studyClubPayment.label}
                        variant="outline"
                      />
                      <p className="text-[11px] sm:text-xs text-secondary-500 leading-snug">
                        Payment and registration are separate. After paying, please also{' '}
                        <a href="#registration-form" className="text-primary-600 hover:text-primary-700 font-medium underline">
                          complete the registration form
                        </a>{' '}
                        so we can confirm your seat. Tax is calculated at checkout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-secondary-500 mt-auto border-t border-secondary-100 pt-4 sm:pt-6">
            <div className="flex flex-col gap-0.5">
              {isStudyClub ? (
                <>
                  <span className="font-semibold text-secondary-600">Led by Dr. Stephen Yoon</span>
                  <span>Coquitlam City Dentist · Spots are limited</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-secondary-600">Co-led by Dr. Lee & Dr. Yoon</span>
                  {(isResidency || isEvent) && <span>Powered by HiOssen AIC Education</span>}
                </>
              )}
            </div>
            <a
              href="#registration-form"
              className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-secondary-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all w-full sm:w-auto"
            >
              Register interest
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="WISE Institute"
        title="Schedule & Registration"
        description="Join our upcoming programs and advance your implant surgical skills with hands-on experience."
        backgroundImage="/gallery/wise5.webp"
        heightClassName="h-[45vh] min-h-[400px]"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Schedule' },
        ]}
      />

      {/* Program Snapshot */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-5" data-aos="fade-right">
              <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
                Snapshot
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight mb-3 sm:mb-4">
                Residency-level energy with study club flexibility
              </h2>
              <p className="text-secondary-600 text-sm sm:text-lg">
                Each WISE cohort is built for efficient, focused learning—fast-paced but never rushed.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5" data-aos="fade-left">
              {snapshotHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset ${item.accent}`}>
                    {item.icon}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">{item.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-secondary mt-1">{item.value}</p>
                  <p className="text-xs sm:text-sm text-secondary-600 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section id="payments" className="py-12 sm:py-16 bg-gradient-to-br from-white via-primary/5 to-white relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-primary-200/30 blur-3xl absolute top-6 left-3" />
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-secondary-200/30 blur-3xl absolute bottom-10 right-6" />
        </div>
        <div className="container-custom relative">
          <div data-aos="fade-up" className="text-center mb-10 sm:mb-16">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Upcoming Courses
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-secondary mt-4 mb-2 sm:mb-3">
              Programs crafted for real clinical growth
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-secondary-600">
              Each cohort blends live surgeries, immersive mentorship, and daily hands-on work so you return to clinic confident and ready.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            <div className="lg:hidden -mx-4">
              <div className="flex gap-6 px-4 pb-6 overflow-x-auto snap-x snap-mandatory">
                {upcomingPrograms.map((program, index) => renderProgramCard(program, index, true))}
              </div>
            </div>
            <div className="hidden lg:flex lg:flex-col lg:space-y-10">
              {upcomingPrograms.map((program, index) => renderProgramCard(program, index))}
            </div>
          </div>
        </div>
      </section>

      {sponsorshipPayment && (
        <section className="py-8 sm:py-10 bg-gradient-to-br from-secondary-50 to-white border-y border-secondary-100">
          <div className="container-custom">
            <div
              data-aos="fade-up"
              className="max-w-2xl mx-auto rounded-2xl sm:rounded-3xl border border-secondary-100 bg-white p-6 sm:p-8 shadow-lg text-center"
            >
              <p className="uppercase tracking-wider text-primary-600 font-bold text-xs sm:text-sm mb-2">
                Sponsorship &amp; organizations
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-2">
                Pay by credit card (custom amount)
              </h2>
              <p className="text-sm sm:text-base text-secondary-600 mb-4">
                For sponsorships or payments arranged with our team, use the link below. Enter the amount we agreed on
                with you at checkout.
              </p>
              <SquarePaymentButton
                href={sponsorshipPayment.url}
                label={sponsorshipPayment.label}
                sublabel={sponsorshipPayment.sublabel}
                variant="primary"
                className="w-full sm:w-auto mx-auto"
              />
              <p className="text-[11px] sm:text-xs text-secondary-500 leading-snug mt-3">
                If this payment is for a doctor attending a program, please also have them{' '}
                <a href="#registration-form" className="text-primary-600 hover:text-primary-700 font-medium underline">
                  complete the registration form
                </a>{' '}
                so we can confirm their seat.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Registration Form */}
      <section id="registration-form" className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <div data-aos="fade-up" className="rounded-2xl sm:rounded-3xl border border-secondary-100 bg-gradient-to-br from-white via-background to-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg">
                <div className="text-left mb-5 sm:mb-6 md:mb-8">
                  <p className="uppercase tracking-wider text-primary-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3">
                    Registration Form
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">Tell us when to save your seat</h2>
                  <p className="text-sm sm:text-base text-secondary-600">
                    We'll follow up with cohort availability, tuition, and what to prep before live surgery days.
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-secondary-500 leading-snug rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
                    <span className="font-semibold text-primary-700">Recommended:</span> Submit this form first,
                    then complete payment on the next screen. If you&apos;ve already paid via Square, still submit
                    the form so we can match your payment to your seat.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                  {submitStatus === 'success' && (
                    <div className="space-y-3">
                      <p className="text-sm text-emerald-600">
                        Thank you — we received your registration. We&apos;ll follow up at the email you
                        provided and send a confirmation there as well.
                      </p>
                      <div ref={paymentPromptRef}>
                        <RegistrationPaymentPrompt programInterest={submittedProgram} />
                      </div>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-600" role="alert">
                      {errorMessage === 'Too many requests. Please try again later.'
                        ? 'Too many requests. Please wait a moment before trying again.'
                        : 'Something went wrong. Please try again or email us at info@wiseinstitute.com.'}
                    </p>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@clinic.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      id="clinic"
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Smith Dental Clinic"
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner (0-5 implants placed)</option>
                      <option value="intermediate">Intermediate (5-50 implants placed)</option>
                      <option value="advanced">Advanced (50+ implants placed)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                      Program Interest
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select program of interest</option>
                      <option value="residency">Implant Residency (8-day)</option>
                      <option value="study-club">WISE STRAUMANN / NEODENT</option>
                      <option value="both">Both Programs</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us about your goals and any questions you have..."
                    />
                  </div>

                  {/* Honeypot: hidden from users, bots typically fill it */}
                  <div
                    className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
                    aria-hidden
                  >
                    <input
                      ref={websiteRef}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Submit registration'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Program Benefits */}
            <div data-aos="fade-left" className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-secondary-100 bg-white p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-secondary">What you'll get</h3>
                {[
                  'Guided live surgeries & pig jaw labs',
                  'Direct mentorship from both directors',
                  'Printed playbooks + ongoing support',
                  'Alumni network & case review circle',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm text-secondary-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-primary/20 bg-white p-5 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary mb-3">Download brochure</h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Full syllabus, tuition, and kit list in one PDF you can share with your team.
                </p>
                <a
                  href="/brochure/Vancouver-BC-Foundation-Course-Spring-2026-FLYER-V6-1.pdf"
                  download="Vancouver-BC-Foundation-Course-Spring-2026-FLYER.pdf"
                  className="btn-secondary w-full inline-flex items-center justify-center"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Calendar */}
      <section className="py-10 sm:py-14 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14" data-aos="fade-up">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Timeline
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">2025–2026 Program Calendar</h2>
            <p className="text-secondary-600 text-sm sm:text-lg">
              Residency and study club windows laid out so you can plan clinic coverage early.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden sm:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-secondary-200 via-secondary-300 to-transparent" />
            <div className="space-y-8 sm:space-y-10">
              {timelineItems.map((item, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div key={`${item.title}-${item.dates}`} className="relative" data-aos="fade-up" data-aos-delay={idx * 80}>
                    {/* Timeline dot */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-white shadow-lg z-10 ${
                      item.tag === 'Residency' ? 'bg-primary-500' : item.tag === 'Event' ? 'bg-accent-500' : 'bg-secondary-500'
                    }`} />
                    
                    {/* Card - Alternating left/right */}
                    <div className="grid grid-cols-2 gap-8">
                      {isLeft ? (
                        <>
                          <div className="pr-8">
                            <div className="bg-white rounded-2xl border border-secondary-100 shadow-md p-5 sm:p-6 mx-auto" style={{ maxWidth: '500px' }}>
                              <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex items-center gap-2 justify-center mb-1">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      item.tag === 'Residency'
                                        ? 'bg-primary/10 text-primary'
                                        : item.tag === 'Event'
                                          ? 'bg-accent/10 text-accent'
                                          : 'bg-secondary/10 text-secondary'
                                    }`}
                                  >
                                    {item.tag}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      item.status === 'Open'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : item.status === 'Waitlist'
                                          ? 'bg-amber-100 text-amber-700'
                                          : item.status === 'Completed'
                                            ? 'bg-gray-100 text-gray-600'
                                            : 'bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-secondary">{item.title}</h3>
                                <div className="flex items-center gap-2 justify-center text-secondary-600 text-sm font-medium">
                                  <Calendar className="h-4 w-4 text-secondary-400" />
                                  <p>{item.dates}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div></div>
                        </>
                      ) : (
                        <>
                          <div></div>
                          <div className="pl-8">
                            <div className="bg-white rounded-2xl border border-secondary-100 shadow-md p-5 sm:p-6 mx-auto" style={{ maxWidth: '500px' }}>
                              <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex items-center gap-2 justify-center mb-1">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      item.tag === 'Residency'
                                        ? 'bg-primary/10 text-primary'
                                        : item.tag === 'Event'
                                          ? 'bg-accent/10 text-accent'
                                          : 'bg-secondary/10 text-secondary'
                                    }`}
                                  >
                                    {item.tag}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      item.status === 'Open'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : item.status === 'Waitlist'
                                          ? 'bg-amber-100 text-amber-700'
                                          : item.status === 'Completed'
                                            ? 'bg-gray-100 text-gray-600'
                                            : 'bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-secondary">{item.title}</h3>
                                <div className="flex items-center gap-2 justify-center text-secondary-600 text-sm font-medium">
                                  <Calendar className="h-4 w-4 text-secondary-400" />
                                  <p>{item.dates}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile Timeline - Same as Desktop */}
          <div className="sm:hidden relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-secondary-200 via-secondary-300 to-transparent" />
            <div className="space-y-6">
              {timelineItems.map((item, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div key={`${item.title}-${item.dates}`} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full border-2 border-white shadow-lg z-10 ${
                      item.tag === 'Residency' ? 'bg-primary-500' : item.tag === 'Event' ? 'bg-accent-500' : 'bg-secondary-500'
                    }`} />
                    
                    {/* Card - Alternating left/right */}
                    <div className="grid grid-cols-2 gap-4">
                      {isLeft ? (
                        <>
                          <div className="pr-3">
                            <div className="bg-white rounded-2xl border border-secondary-100 shadow-md p-4 mx-auto" style={{ maxWidth: '100%' }}>
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <div className="flex items-center gap-1.5 justify-center flex-wrap mb-0.5">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      item.tag === 'Residency' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                    }`}
                                  >
                                    {item.tag}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      item.status === 'Open'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : item.status === 'Waitlist'
                                          ? 'bg-amber-100 text-amber-700'
                                          : item.status === 'Completed'
                                            ? 'bg-gray-100 text-gray-600'
                                            : 'bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <h3 className="text-sm font-bold text-secondary">{item.title}</h3>
                                <div className="flex items-center gap-1.5 justify-center text-xs text-secondary-600 font-medium">
                                  <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                                  <p>{item.dates}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div></div>
                        </>
                      ) : (
                        <>
                          <div></div>
                          <div className="pl-3">
                            <div className="bg-white rounded-2xl border border-secondary-100 shadow-md p-4 mx-auto" style={{ maxWidth: '100%' }}>
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <div className="flex items-center gap-1.5 justify-center flex-wrap mb-0.5">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      item.tag === 'Residency' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                    }`}
                                  >
                                    {item.tag}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      item.status === 'Open'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : item.status === 'Waitlist'
                                          ? 'bg-amber-100 text-amber-700'
                                          : item.status === 'Completed'
                                            ? 'bg-gray-100 text-gray-600'
                                            : 'bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <h3 className="text-sm font-bold text-secondary">{item.title}</h3>
                                <div className="flex items-center gap-1.5 justify-center text-xs text-secondary-600 font-medium">
                                  <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                                  <p>{item.dates}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToActionBanner
        title="Ready to Advance Your Skills?"
        description="Don't wait — our programs fill up quickly. Register your interest today to secure your spot."
        primaryAction={{
          label: 'Register Now',
          href: '/schedule#registration-form',
          icon: <ArrowRight className="h-5 w-5 text-primary-600" />,
        }}
        secondaryAction={{
          label: 'Contact Us',
          href: '/contact',
          icon: <Mail className="h-5 w-5 text-white" />,
        }}
      />
    </div>
  )
}
