'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, Users, BookOpen, Stethoscope, Award, Clock, MapPin, Home, Activity, Scissors, Heart, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '../../components/CallToActionBanner'

export default function ProgramsPage() {
  const router = useRouter()

  const handleProgramClick = (programType: 'residency' | 'study-club') => {
    router.push(`/contact?program=${programType}`)
  }

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="WISE Institute"
        title="Our Programs"
        description="Comprehensive implant education designed for busy clinicians who want to maximize learning in minimal time."
        backgroundImage="/gallery/WISE.005.webp"
        imagePosition="top"
        heightClassName="h-[45vh] min-h-[400px]"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Programs' },
        ]}
      />

      {/* Implant Residency */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            <div data-aos="fade-right" className="flex flex-col">
              <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
                Implant Residency
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight mb-3 sm:mb-4">
                Foundations of Implant Dentistry – Spring 2026 Vancouver
              </h2>
              <p className="text-secondary-600 text-sm sm:text-lg mb-6 sm:mb-8">
                <span className="font-semibold text-primary">56 CE Credits | Up to 4 modules | 8 days</span>. AIC Implant Master Program with HiOssen AIC Education: Surgical (Modules 1–2), Prosthetic (Module 3), and Live Surgery (Module 4). We deliver comprehensive training in the least number of days possible.
              </p>
              
              {/* Key Features */}
              <div className="space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Module Dates</p>
                    <div className="text-sm font-medium text-secondary-900 space-y-1">
                      <p>Module 1: April 11-12, 2026</p>
                      <p>Module 2: May 2-3, 2026</p>
                      <p>Module 3: June 6-7, 2026</p>
                      <p className="font-semibold text-primary">Module 4: July 11-12, 2026 (Live Surgery Days)</p>
                    </div>
                    <p className="text-xs text-secondary-500 mt-2">Registration: 8:30 am | Course: 9:00 am – 5:00 pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Course Structure</p>
                    <p className="text-sm font-medium text-secondary-900">6 Workshop Days + 2 Live Surgery Days</p>
                    <p className="text-xs text-secondary-600 mt-1">Includes case presentations, case work-up, and case review & recap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Capacity</p>
                    <p className="text-sm font-medium text-secondary-900">20 doctors per cohort for personalized attention</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Materials</p>
                    <p className="text-sm font-medium text-secondary-900">Printed course notes included for review</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Pricing</p>
                    <div className="text-sm font-medium text-secondary-900 space-y-1">
                      <p><span className="font-semibold">$9,500 CAD</span> + Tax (Modules 1-4 / Includes Live Surgery)</p>
                      <p><span className="font-semibold">$7,500 CAD</span> + Tax (Modules 1-3 / No Surgery)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/schedule" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all mt-auto">
                Register for Upcoming Course
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div data-aos="fade-left" className="rounded-3xl border-2 border-secondary-200 bg-white p-6 sm:p-10 shadow-lg">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">What You'll Learn</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Surgical Techniques</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Flap reflection, bone grafting, suturing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Hands-On Practice</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">We use pig jaws to give more realistic feel for things like incision, flap reflection, bone grafting and suturing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Live Surgery</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Real patient cases under supervision</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Clinical Application</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Ready to apply skills in your practice</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-secondary-200">
                <h4 className="text-sm sm:text-base font-semibold text-secondary mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-secondary-600 list-disc list-inside">
                  <li>Perform comprehensive pre-surgical patient evaluation and case selection</li>
                  <li>Develop predictable implant treatment plans using clinical and CBCT data</li>
                  <li>Understand surgical principles for implant placement and guided surgery</li>
                  <li>Perform basic sinus lift and GBR techniques</li>
                  <li>Understand implant prosthetic components and workflows</li>
                  <li>Apply implant treatment planning concepts through real clinical cases</li>
                  <li>Observe and learn live implant surgeries under expert mentorship</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Breakdown */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-secondary-50">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Module Overview
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">Four Progressive Modules</h2>
            <p className="text-secondary-600 text-sm sm:text-lg">
              Structured learning path from foundational concepts to live surgical observation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div data-aos="fade-up" data-aos-delay="100" className="rounded-2xl border-2 border-secondary-200 bg-white p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-secondary">Surgical Foundations & Guided Surgery</h3>
              </div>
              <p className="text-sm sm:text-base text-secondary-600 mb-4">
                Introduction to implantology, patient assessment, treatment planning, CBCT-based planning, and hands-on guided and freehand implant placement.
              </p>
              <div className="text-xs sm:text-sm text-secondary-500">
                <p className="font-semibold mb-2" style={{ color: '#219281' }}>Dates: April 11-12, 2026</p>
                <p className="text-secondary-600">9:00 am – 5:00 pm</p>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="rounded-2xl border-2 border-secondary-200 bg-white p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-secondary">Surgical: Sinus Lift & Basic GBR</h3>
              </div>
              <p className="text-sm sm:text-base text-secondary-600 mb-4">
                Principles of sinus augmentation and basic bone grafting techniques with hands-on practice in sinus lift and GBR procedures.
              </p>
              <div className="text-xs sm:text-sm text-secondary-500">
                <p className="font-semibold mb-2" style={{ color: '#219281' }}>Dates: May 2-3, 2026</p>
                <p className="text-secondary-600">9:00 am – 5:00 pm</p>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="rounded-2xl border-2 border-secondary-200 bg-white p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-secondary">Prosthetic & Treatment Planning</h3>
              </div>
              <p className="text-sm sm:text-base text-secondary-600 mb-4">
                Implant prosthetic concepts, impression and digital workflows, PRF applications, and restorative-driven implant treatment planning.
              </p>
              <div className="text-xs sm:text-sm text-secondary-500">
                <p className="font-semibold mb-2" style={{ color: '#219281' }}>Dates: June 6-7, 2026</p>
                <p className="text-secondary-600">9:00 am – 5:00 pm</p>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary-900">4</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-secondary">Live Surgery</h3>
              </div>
              <p className="text-sm sm:text-base text-secondary-600 mb-4">
                Two days of live implant surgery observation with expert mentorship, focusing on real-time clinical decision-making and case discussion.
              </p>
              <div className="text-xs sm:text-sm text-primary-600">
                <p className="font-semibold mb-2" style={{ color: '#219281' }}>Dates: July 11-12, 2026 (Live Surgery Days)</p>
                <p className="text-secondary-600">9:00 am – 5:00 pm</p>
                <p className="text-secondary-500 mt-1">Optional: Available with full program ($9,500) or separately</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Surgery Study Club */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-gradient-to-br from-white via-primary/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-primary-200/30 blur-3xl absolute top-6 left-3" />
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-secondary-200/30 blur-3xl absolute bottom-10 right-6" />
        </div>
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            <div data-aos="fade-left" className="rounded-3xl border-2 border-secondary-200 bg-white p-6 sm:p-10 shadow-lg order-2 lg:order-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">Program Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Real Patient Cases</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Bring your own clinical cases and perform surgery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Case Planning & Review</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Case presentations, workup, execution & recap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Expert Guidance</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Real-time feedback from Dr. Stephen Yoon</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Small-Group Setting</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Individualized attention in an intimate format</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="mt-6 pt-6 border-t border-secondary-100">
                <h4 className="text-sm font-semibold text-secondary mb-3 uppercase tracking-wide">Upcoming Sessions — 2026</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                    <span className="text-sm text-secondary-400 line-through">March 22, 2026 — Completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-secondary-700 font-medium">June 14, 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-secondary-700 font-medium">September 13, 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-secondary-700 font-medium">November 8, 2026</span>
                  </div>
                  <p className="text-xs text-secondary-500 mt-2">8:00 AM – 5:00 PM · Coquitlam City Dentist</p>
                </div>
              </div>
            </div>

            <div data-aos="fade-right" className="flex flex-col order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-3">
                <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg">
                  Live Surgery Study Club
                </p>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Ongoing Series</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight mb-3 sm:mb-4">
                Real patient cases with direct mentorship
              </h2>
              <p className="text-secondary-600 text-sm sm:text-lg mb-6 sm:mb-8">
                Our Live Surgery Study Club is off to a great start — the first session was successfully completed! Registration is now open for the remaining sessions in 2026, led by Dr. Stephen Yoon. Bring your own clinical cases and perform implant surgeries in a small-group setting with expert guidance.
              </p>
              
              <div className="rounded-2xl border-2 border-secondary-200 bg-white p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
                <blockquote className="text-base sm:text-lg italic text-secondary-600 mb-2">
                  "Our ultimate goal is for you to return to your clinic and confidently apply what you've learned."
                </blockquote>
                <cite className="text-sm sm:text-base text-primary font-semibold">— WISE Institute Directors</cite>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="rounded-2xl border-2 border-secondary-200 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-primary-50 ring-primary-600/10">
                    <Calendar className="h-5 w-5 text-primary-700" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">CE Credits</p>
                  <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">36 CE Credits</p>
                </div>
                <div className="rounded-2xl border-2 border-secondary-200 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-secondary-50 ring-secondary-500/20">
                    <Users className="h-5 w-5 text-secondary-700" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Group Size</p>
                  <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Small groups</p>
                </div>
              </div>

              <Link href="/contact?program=study-club" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all mt-auto">
                Register Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Networking & Community */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Networking & Community
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">Building connections beyond the clinic</h2>
            <p className="text-secondary-600 text-sm sm:text-lg">
              A big part of our WISE and HiOssen's culture is to allow doctors to network with one another. And what better way is there than to do it over food and some drinks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              <div data-aos="fade-up" data-aos-delay="100" className="rounded-2xl border-2 border-secondary-200 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-primary-50 ring-primary-600/10">
                  <Users className="h-5 w-5 text-primary-700" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Shared Experiences</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Doctors share experiences, challenges, and successes</p>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="200" className="rounded-2xl border-2 border-secondary-200 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-secondary-50 ring-secondary-500/20">
                  <MapPin className="h-5 w-5 text-secondary-700" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Meals & Laughter</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Learning happens over food and drinks as much as in the clinic</p>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="300" className="rounded-2xl border-2 border-secondary-200 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-accent-50 ring-accent-500/15">
                  <Award className="h-5 w-5 text-accent-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Lifelong Connections</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Build professional relationships that last beyond the program</p>
              </div>
            </div>
        </div>
      </section>

      {/* Program Comparison */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-secondary-50">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Choose Your Program
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">Programs crafted for real clinical growth</h2>
            <p className="text-secondary-600 text-sm sm:text-lg">
              Both programs offer comprehensive training with different focuses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div 
              data-aos="fade-right" 
              onClick={() => handleProgramClick('residency')}
              className="group relative rounded-2xl sm:rounded-3xl border-2 border-secondary-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/25 via-primary-500/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-5 sm:mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-primary/10 text-primary">
                    Residency
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-secondary mb-2 sm:mb-3">Implant Residency</h3>
                <p className="text-secondary-600 mb-5 sm:mb-6 text-sm sm:text-base">Foundations of Implant Dentistry: A Comprehensive Residency Program – Spring 2026 Vancouver. 56 CE Credits, up to 4 modules, 8 days. AIC Training Centre, Burnaby, BC. $7,500 – $9,500 + Tax.</p>
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">56 CE Credits | Up to 4 modules | 8 days</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Modules 1–2: Surgical, Module 3: Prosthetic, Module 4: Live Surgery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Hands-on & theory, pig jaw surgeries, mentored live surgeries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Co-led by Dr. Lee & Dr. Yoon</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Powered by HiOssen AIC Education</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-secondary-200">
                  <p className="text-xs sm:text-sm text-secondary-500 mb-2">Perfect for:</p>
                  <p className="text-sm sm:text-base text-secondary-600">Busy clinicians who want comprehensive implant training in a structured format. Starts April 11, 2026.</p>
                </div>
              </div>
            </div>

            <div 
              data-aos="fade-left" 
              onClick={() => handleProgramClick('study-club')}
              className="group relative rounded-2xl sm:rounded-3xl border-2 border-secondary-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary-500/25 via-secondary-500/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-5 sm:mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-secondary/10 text-secondary">
                    Study Club
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-secondary mb-2 sm:mb-3">Live Surgery Study Club</h3>
                <p className="text-secondary-600 mb-5 sm:mb-6 text-sm sm:text-base">Ongoing series led by Dr. Stephen Yoon. Bring your own clinical cases and perform implant surgeries with expert guidance. June, September & November 2026 — Coquitlam City Dentist.</p>
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">36 CE Credits | 4 live-surgery days | $4,999 CAD</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Work on your own real clinical cases</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Case planning, execution & review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Real-time feedback from Dr. Yoon</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Small group — spots are limited</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-secondary-200">
                  <p className="text-xs sm:text-sm text-secondary-500 mb-2">Perfect for:</p>
                  <p className="text-sm sm:text-base text-secondary-600">Dentists ready to elevate confidence in implant dentistry with real surgical experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToActionBanner
        title="Ready to Start Your Implant Journey?"
        description="Join our next cohort and transform your practice with hands-on surgical education."
        primaryAction={{
          label: 'View Schedule',
          href: '/schedule'
        }}
        secondaryAction={{
          label: 'Contact Us',
          href: '/contact'
        }}
      />
    </div>
  )
}
