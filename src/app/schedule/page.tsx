'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, MapPin, CheckCircle, ArrowRight, Home, Mail } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '@/components/CallToActionBanner'

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clinic: '',
    experience: '',
    program: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement form submission API endpoint
      // const response = await fetch('/api/registration', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (response.ok) {
      //   // Show success message
      //   setFormData({ name: '', email: '', clinic: '', experience: '', program: '', message: '' })
      // }
    } catch (error) {
      // Handle error
    }
  }

  const upcomingPrograms = [
    {
      id: 1,
      title: "LIVE SURGERY at PDC 2026",
      type: "Event",
      startDate: "Thursday, March 5, 2026",
      endDate: "Thursday, March 5, 2026",
      duration: "1.5 hours",
      capacity: "Open to all",
      location: "VCC West – Exhibit Hall Live Stage",
      status: "Open",
      description: "Join us at the Pacific Dental Conference (PDC) 2026 for an exclusive LIVE SURGERY on the Live Stage with Dr. Stephen Yoon & Dr. Chris Lee. Watch real-time implant surgery decision-making for challenging posterior maxilla cases, including limited vertical bone height and proximity to the maxillary sinus. A rare dental education opportunity—see clinical dentistry in action with practical, minimally invasive techniques performed live. 9:30–11:00 AM.",
      price: "Free",
    },
    {
      id: 2,
      title: "FOUNDATIONS OF IMPLANT DENTISTRY",
      type: "Residency",
      startDate: "March 22, 2025",
      endDate: "March 29, 2025",
      duration: "8 days",
      capacity: "Limited seats",
      location: "Vancouver, BC",
      status: "Open",
      description: "Spring 2025 residency program. Topics include consultation, suture techniques, implant placement, sinus lift basics, and even live surgery. Comprehensive training with hands-on experience and direct mentorship.",
      price: "From $7,500 + Tax",
      ceCredits: "56 CE Credits"
    }
  ]

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

  const renderProgramCard = (program: typeof upcomingPrograms[number], index: number, isMobile = false) => {
    const isResidency = program.type === 'Residency'
    const isEvent = program.type === 'Event'
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
        className={`group relative rounded-3xl border border-white/70 bg-white/90 backdrop-blur-sm p-6 sm:p-10 shadow-lg overflow-hidden ${
          isMobile ? 'min-w-[85%] snap-start' : ''
        }`}
      >
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${badgeColor}`}>
                {program.type}
              </span>
              <span
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                  program.status === 'Open'
                    ? 'bg-emerald-100 text-emerald-700'
                    : program.status === 'Waitlist'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {program.status}
              </span>
            </div>
          </div>

          <h3 className="text-xl sm:text-3xl font-extrabold text-secondary mb-2 sm:mb-3">{program.title}</h3>
          <p className="text-secondary-600 mb-5 sm:mb-6 text-sm sm:text-base">{program.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                <Calendar className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500">Dates</p>
                <p className="text-sm font-medium text-secondary-900">
                  {program.startDate === program.endDate ? program.startDate : `${program.startDate} – ${program.endDate}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                <Clock className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500">Duration</p>
                <p className="text-sm font-medium text-secondary-900">{program.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                <Users className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500">Capacity</p>
                <p className="text-sm font-medium text-secondary-900">{program.capacity}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                <MapPin className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500">Location</p>
                <p className="text-sm font-medium text-secondary-900">{program.location}</p>
              </div>
            </div>
          </div>

          {(program.price || program.ceCredits) && (
            <div className="mb-6 sm:mb-8 flex flex-wrap gap-4">
              {program.price && (
                <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">Price</p>
                  <p className="text-base font-bold text-primary">{program.price}</p>
                </div>
              )}
              {program.ceCredits && (
                <div className="px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
                  <p className="text-xs uppercase tracking-wide text-secondary-600 font-semibold">CE Credits</p>
                  <p className="text-base font-bold text-secondary">{program.ceCredits}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-secondary-500">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-secondary-600">Co-led by Dr. Chris Lee & Dr. Stephen Yoon</span>
              {program.type === 'Residency' && <span>Powered by HiOssen AIC Education</span>}
            </div>
            <a
              href="#registration-form"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all w-full sm:w-auto"
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
      <section className="py-12 sm:py-16 bg-gradient-to-br from-white via-primary/5 to-white relative overflow-hidden">
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
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
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
                      <option value="pdc-2026">PDC 2026 Live Surgery</option>
                      <option value="residency">Implant Residency (8-day)</option>
                      <option value="study-club">Live Surgery Study Club</option>
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

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <span>Submit registration</span>
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
                  href="/brochure/WISE.pdf"
                  download
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
              {[
                { title: 'LIVE SURGERY at PDC 2026', dates: 'March 5, 2026', status: 'Open', tag: 'Event' },
                { title: 'Foundations of Implant Dentistry', dates: 'March 22 – 29, 2025', status: 'Open', tag: 'Residency' },
              ].map((item, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div key={item.title} className="relative" data-aos="fade-up" data-aos-delay={idx * 80}>
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
                                        : 'bg-amber-100 text-amber-700'
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
                                        : 'bg-amber-100 text-amber-700'
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
              {[
                { title: 'LIVE SURGERY at PDC 2026', dates: 'March 5, 2026', status: 'Open', tag: 'Event' },
                { title: 'Foundations of Implant Dentistry', dates: 'March 22 – 29, 2025', status: 'Open', tag: 'Residency' },
              ].map((item, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div key={item.title} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full border-2 border-white shadow-lg z-10 ${
                      item.tag === 'Residency' ? 'bg-primary-500' : 'bg-secondary-500'
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
                                        : 'bg-amber-100 text-amber-700'
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
                                        : 'bg-amber-100 text-amber-700'
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
