'use client'

import Image from 'next/image'
import { ArrowRight, Award, Users, Stethoscope, Calendar, Home, Briefcase } from 'lucide-react'
import CallToActionBanner from '@/components/CallToActionBanner'
import PageHero from '../../components/PageHero'

export default function DirectorsPage() {
  const teachingPillars = [
    {
      title: 'Evidence-Based Approach',
      description:
        'All teaching methods are grounded in current research and proven clinical outcomes, ensuring students learn the most effective techniques.',
      icon: <Award className="h-7 w-7 text-primary-700" />,
      iconBg: 'bg-primary-50 ring-primary-600/10',
    },
    {
      title: 'Real-World Application',
      description:
        'Every skill taught is designed for immediate application in busy clinical practice, with focus on efficiency and patient safety.',
      icon: <Users className="h-7 w-7 text-accent-600" />,
      iconBg: 'bg-accent-50 ring-accent-600/10',
    },
    {
      title: 'Mentorship Focus',
      description:
        'Direct, personalized guidance from experienced practitioners who understand the challenges of modern dental practice.',
      icon: <Stethoscope className="h-7 w-7 text-secondary-700" />,
      iconBg: 'bg-secondary-100 ring-secondary-300/60',
    },
    {
      title: 'Confidence Building',
      description:
        'Our ultimate goal is for graduates to return to their clinics with the confidence and competence to perform implant procedures.',
      icon: <Calendar className="h-7 w-7 text-primary-700" />,
      iconBg: 'bg-primary-50 ring-primary-600/10',
    },
  ]

  const recognitionItems = [
    {
      title: 'HiOssen AIC Faculty',
      description:
        'Both directors serve as education faculty for HiOssen AIC, contributing to curriculum development and program delivery.',
      icon: <Award className="h-10 w-10 text-primary-700" />,
      iconBg: 'bg-primary-50 ring-primary-600/10',
    },
    {
      title: 'Key Opinion Leaders',
      description:
        'Recognized as KOLs for HiOssen, Straumann, and NeoDent, influencing industry standards and best practices.',
      icon: <Users className="h-10 w-10 text-accent-600" />,
      iconBg: 'bg-accent-50 ring-accent-600/10',
    },
    {
      title: 'Featured Presenters',
      description:
        'Regular presenters at major dental conferences, including featured sessions on PDC Live Stage Surgery.',
      icon: <Calendar className="h-10 w-10 text-secondary-700" />,
      iconBg: 'bg-secondary-100 ring-secondary-300/60',
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="WISE Institute"
        title="Our Directors"
        description="Meet the experienced practitioners who founded WISE Institute and continue to guide our educational mission."
        backgroundImage="/gallery/wise2.webp"
        heightClassName="h-[45vh] min-h-[400px]"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'About', href: '/about' },
          { label: 'Our Directors' },
        ]}
      />

      {/* Dr. Chris Lee */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div data-aos="fade-right" className="order-2 lg:order-1">
              <div className="space-y-5 sm:space-y-6 md:space-y-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-secondary-900 mb-2">
                      Dr. Chris Lee
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-primary-700 font-medium">DMD, B.Sc. (Pharm)</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-2.5 sm:px-3 py-1 text-xs text-secondary-600 shadow-sm flex-shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                    Director
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-inset ring-primary-600/10">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold tracking-tight text-secondary-900 text-lg sm:text-xl mb-3 sm:mb-4">
                        Career & Education
                      </h3>
                      <ul className="space-y-2 sm:space-y-2.5 text-secondary-700 text-sm sm:text-base leading-relaxed">
                        {[
                          'Current: General Dentist practicing in Greater Vancouver, focusing on Dental Surgeries and Implants',
                          'Specialty: Dental Surgeries and Implants',
                          'Education: UBC Dentistry 2015 graduate with a background in UBC Pharmacy',
                          'Previous: Past Clinical Instructor at UBC Faculty of Dentistry and current ICOI Fellow',
                        ].map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <div className="bg-primary-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-inset ring-primary-600/10">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold tracking-tight text-secondary-900 text-lg sm:text-xl mb-3 sm:mb-4">
                        Professional Societies
                      </h3>
                      <ul className="space-y-2 sm:space-y-2.5 text-secondary-700 text-sm sm:text-base leading-relaxed">
                        {[
                          'HiOssen AIC Education Faculty',
                          'Key Opinion Leader for HiOssen and Straumann',
                          'ICOI Fellow',
                        ].map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" className="order-1 lg:order-2">
              <div className="flex justify-center lg:justify-end">
                <div className="group relative w-full max-w-[520px]">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary-500/20 via-secondary-500/10 to-transparent blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="relative aspect-[520/572] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-secondary-200 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[0.3deg]">
                    <Image src="/directors/chris_lee.png" alt="Dr. Chris Lee" fill className="object-cover" priority sizes="520px" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />

      {/* Dr. Stephen Yoon */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div data-aos="fade-right" className="order-1 lg:order-1">
              <div className="flex justify-center lg:justify-start">
                <div className="group relative w-full max-w-[520px]">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-secondary-500/20 via-primary-500/10 to-transparent blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="relative aspect-[520/572] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-secondary-200 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[0.3deg]">
                    <Image src="/directors/stephen_yoon.png" alt="Dr. Stephen Yoon" fill className="object-cover" priority sizes="520px" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" className="order-2 lg:order-2">
              <div className="space-y-5 sm:space-y-6 md:space-y-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-secondary-900 mb-2">
                      Dr. Stephen Yoon
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-primary-700 font-medium">DMD, B.Sc.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-2.5 sm:px-3 py-1 text-xs text-secondary-600 shadow-sm flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                    Director
                  </span>{/* <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" />
                    Co-Director
                  </span> */}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-inset ring-primary-600/10">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold tracking-tight text-secondary-900 text-lg sm:text-xl mb-3 sm:mb-4">
                        Career & Education
                      </h3>
                      <ul className="space-y-2 sm:space-y-2.5 text-secondary-700 text-sm sm:text-base leading-relaxed">
                        {[
                          'Current: General Dentist practicing in New Westminster and Coquitlam, focusing on Dental Surgeries and Implants',
                          'Specialty: Dental Surgeries and Implants',
                          'Education: UBC Dentistry graduate with over 4,500 implants placed',
                          'Previous: Former surgeon at an implant-focused center with extensive live surgery experience',
                        ].map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <div className="bg-primary-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-inset ring-primary-600/10">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold tracking-tight text-secondary-900 text-lg sm:text-xl mb-3 sm:mb-4">
                        Professional Societies
                      </h3>
                      <ul className="space-y-2 sm:space-y-2.5 text-secondary-700 text-sm sm:text-base leading-relaxed">
                        {[
                          'HiOssen AIC Education Faculty',
                          'Key Opinion Leader for HiOssen and Straumann/NeoDent',
                        ].map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-secondary-900 mb-4 sm:mb-6">
              Our Teaching Philosophy
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-secondary-600 leading-relaxed">
              Both directors share a commitment to practical, hands-on education that translates directly to clinical success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {teachingPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-secondary-200 bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-secondary-300"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 ring-1 ring-inset ${pillar.iconBg}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-secondary-900 mb-2 sm:mb-3 md:mb-4">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-secondary-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Recognition */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-secondary-900 mb-4 sm:mb-6">
              Industry Recognition
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-secondary-600 leading-relaxed">
              Our directors' expertise is recognized by leading dental companies and educational institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {recognitionItems.map((item) => (
              <div
                key={item.title}
                className="text-center rounded-xl border border-secondary-200 bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-secondary-300"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 ring-1 ring-inset ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-secondary-900 mb-2 sm:mb-3 md:mb-4">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-secondary-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToActionBanner
        title="Learn from the Best"
        description="Join our programs and learn directly from experienced practitioners who have placed thousands of implants."
        primaryAction={{
          label: 'View Programs',
          href: '/programs',
          icon: <ArrowRight className="h-5 w-5 text-primary-600" />,
        }}
        secondaryAction={{
          label: 'Check Schedule',
          href: '/schedule',
          icon: <Calendar className="h-5 w-5" />,
        }}
      />
    </div>
  )
}