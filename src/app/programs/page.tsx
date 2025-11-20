'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, BookOpen, Stethoscope, Award, Clock, MapPin, Home, Activity, Scissors, Heart, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '../../components/CallToActionBanner'

export default function ProgramsPage() {
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
      <section className="py-10 sm:py-14 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            <div data-aos="fade-right" className="flex flex-col">
              <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
                Implant Residency
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight mb-3 sm:mb-4">
                8-day intensive program with live surgery mentorship
              </h2>
              <p className="text-secondary-600 text-sm sm:text-lg mb-6 sm:mb-8">
                <span className="font-semibold text-primary">8 day implant residency</span> with HiOssen AIC partnership, featuring 2 days of live surgery. We understand that time away from practice means time away from family & friends, so we deliver as much information in the least number of days possible.
              </p>
              
              {/* Key Features */}
              <div className="space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary-500">Duration</p>
                    <p className="text-sm font-medium text-secondary-900">8 intensive days with 2 live surgery sessions</p>
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
              </div>

              <Link href="/schedule" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all mt-auto">
                Register for Upcoming Course
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div data-aos="fade-left" className="rounded-3xl border border-secondary-100 bg-white p-6 sm:p-10 shadow-lg">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">What You'll Learn</h3>
              <div className="space-y-4">
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
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Hands-On Practice</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">We use pig jaws to give more realistic feel for things like incision, flap reflection, bone grafting and suturing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Live Surgery</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Real patient cases under supervision</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Clinical Application</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Ready to apply skills in your practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Surgery Study Club */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-white via-primary/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-primary-200/30 blur-3xl absolute top-6 left-3" />
          <div className="h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-secondary-200/30 blur-3xl absolute bottom-10 right-6" />
        </div>
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            <div data-aos="fade-left" className="rounded-3xl border border-secondary-100 bg-white p-6 sm:p-10 shadow-lg order-2 lg:order-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">Program Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Real Patient Cases</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Dentists bring their own patients for surgery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Paired Learning</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Perform & assist under direct supervision</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Direct Mentorship</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Learn from Dr. Lee and Dr. Yoon personally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow ring-1 ring-secondary-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Confidence Building</h4>
                    <p className="text-xs sm:text-sm text-secondary-600">Return to clinic ready to apply skills</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-right" className="flex flex-col order-1 lg:order-2">
              <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
                Live Surgery Study Club
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight mb-3 sm:mb-4">
                Real patient cases with direct mentorship
              </h2>
              <p className="text-secondary-600 text-sm sm:text-lg mb-6 sm:mb-8">
                Doctors would bring their own patients to place implants. Surgery time was busy; Doctors would be paired up for the day and take turn performing and assisting the surgery. Occasionally, Stephen and I would step in to demonstrate certain techniques.
              </p>
              
              <div className="rounded-2xl border border-secondary-100 bg-white p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
                <blockquote className="text-base sm:text-lg italic text-secondary-600 mb-2">
                  "Our ultimate goal is for you to return to your clinic and confidently apply what you've learned."
                </blockquote>
                <cite className="text-sm sm:text-base text-primary font-semibold">— WISE Institute Directors</cite>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-primary-50 ring-primary-600/10">
                    <Calendar className="h-5 w-5 text-primary-700" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Schedule</p>
                  <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">3 sessions per year</p>
                </div>
                <div className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-secondary-50 ring-secondary-500/20">
                    <Users className="h-5 w-5 text-secondary-700" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Group Size</p>
                  <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Small groups</p>
                </div>
              </div>

              <Link href="/schedule" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 transition-all mt-auto">
                View Schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Networking & Community */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-10 sm:mb-14">
              <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
                Networking & Community
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">Building connections beyond the clinic</h2>
              <p className="text-secondary-600 text-sm sm:text-lg max-w-3xl mx-auto">
                A big part of our WISE and HiOssen's culture is to allow doctors to network with one another. And what better way is there than to do it over food and some drinks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              <div data-aos="fade-up" data-aos-delay="100" className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-primary-50 ring-primary-600/10">
                  <Users className="h-5 w-5 text-primary-700" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Shared Experiences</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Doctors share experiences, challenges, and successes</p>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="200" className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-secondary-50 ring-secondary-500/20">
                  <MapPin className="h-5 w-5 text-secondary-700" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Meals & Laughter</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Learning happens over food and drinks as much as in the clinic</p>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="300" className="rounded-2xl border border-secondary-100 bg-white p-3.5 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-inset bg-accent-50 ring-accent-500/15">
                  <Award className="h-5 w-5 text-accent-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">Lifelong Connections</p>
                <p className="text-sm sm:text-base font-medium text-secondary-900 mt-1">Build professional relationships that last beyond the program</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Comparison */}
      <section className="py-10 sm:py-14 bg-secondary-50">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-10 sm:mb-14">
            <p className="uppercase tracking-wider text-primary-600 font-bold text-sm sm:text-base lg:text-lg mb-3">
              Choose Your Program
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary mt-3 mb-2">Programs crafted for real clinical growth</h2>
            <p className="text-secondary-600 text-sm sm:text-lg max-w-3xl mx-auto">
              Both programs offer comprehensive training with different focuses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div data-aos="fade-right" className="group relative rounded-3xl border border-white/70 bg-white/90 backdrop-blur-sm p-6 sm:p-10 shadow-lg overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/25 via-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-5 sm:mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-primary/10 text-primary">
                    Residency
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-secondary mb-2 sm:mb-3">Implant Residency</h3>
                <p className="text-secondary-600 mb-5 sm:mb-6 text-sm sm:text-base">8-day intensive program with 2 live surgery days, hands-on training with pig jaws, and comprehensive course materials.</p>
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">8-day intensive program</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">2 days of live surgery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Daily hands-on practice</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Printed course materials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">HiOssen AIC partnership</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-secondary-200">
                  <p className="text-xs sm:text-sm text-secondary-500 mb-2">Perfect for:</p>
                  <p className="text-sm sm:text-base text-secondary-600">Busy clinicians who want comprehensive training in a structured format</p>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" className="group relative rounded-3xl border border-white/70 bg-white/90 backdrop-blur-sm p-6 sm:p-10 shadow-lg overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary-500/25 via-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-5 sm:mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-secondary/10 text-secondary">
                    Study Club
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-secondary mb-2 sm:mb-3">Live Surgery Study Club</h3>
                <p className="text-secondary-600 mb-5 sm:mb-6 text-sm sm:text-base">Real patient cases with direct mentorship from Dr. Lee and Dr. Yoon. Bring your own patients for surgery.</p>
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Real patient cases</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Direct mentorship</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Paired learning approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Flexible scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-secondary-600">Small group size</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-secondary-200">
                  <p className="text-xs sm:text-sm text-secondary-500 mb-2">Perfect for:</p>
                  <p className="text-sm sm:text-base text-secondary-600">Dentists ready to advance with real patient experience</p>
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
