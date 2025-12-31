"use client";

import Image from 'next/image'
import { useState } from 'react'
import { Home } from 'lucide-react'
import PageHero from '../../components/PageHero'

const COMMUNITY_PHOTOS = [
  { src: '/gallery/about1.webp', alt: 'WISE Live Surgery Study Club - shared meals' },
  { src: '/gallery/about2.webp', alt: 'WISE Live Surgery Study Club - community moments' },
  { src: '/gallery/about3.webp', alt: 'WISE Live Surgery Study Club - hands-on learning' },
]

const PDC_PHOTOS = [
  { src: '/gallery/WISE.015.webp', alt: 'PDC live stage announcement' },
  { src: '/gallery/WISE.016.webp', alt: 'WISE live surgery plan presentation' },
  { src: '/gallery/WISE.017.webp', alt: 'Live surgery audience and setup' },
  { src: '/gallery/WISE.018.webp', alt: 'Clinical close-up during live demo' },
  { src: '/gallery/WISE.019.webp', alt: 'Full audience view of PDC live stage' },
]

export default function AboutPage() {
  const [activePhoto, setActivePhoto] = useState<{ src: string; alt: string } | null>(null)

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="WISE Institute"
        title="About Us"
        backgroundImage="/gallery/about1.webp"
        heightClassName="h-[50vh] min-h-[400px]"
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'About', href: '/about' },
          { label: 'About Us' },
        ]}
      />

      {/* Main Content Section - Introduction Text */}
      <section id="about-overview" className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-6 sm:space-y-8" data-aos="fade-up">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-900 leading-relaxed">
              WISE Institute offers various educational programs for dentists who are committed to advancing their implant surgical skills through hands-on learning.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              To all those who gather strength for the development of our programs and the bright future of our students, we once again extend our deepest respect and gratitude.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-8 sm:mb-10 md:mb-12" data-aos="fade-up">
              Our Story
            </h2>
            <div className="space-y-5 sm:space-y-6 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
              <p>
                Back in 2021, Dr. Yoon and I had a vision. We wanted to create an implant academy where we can share our knowledge and passion with our fellow dentists.
              </p>
              <p>
                We felt that our strength was on live surgery, so on Nov 2021, we formed our very first live surgery study club with 12 doctors. Basically 6 of my friends and 6 of his friends who had nothing better to do.
              </p>
              <p>
                Doctors would bring their own patients to place implants. We go over the cases in our waiting areas or staff rooms which got converted into classrooms.
              </p>
              <p>
                Surgery time was busy. Doctors would be paired up for the day and take turns performing and assisting the surgery. Occasionally, Stephen and I would step in to demonstrate certain techniques.
              </p>
              <p>
                Over the years, Stephen and I helped doctors placing their first implants, first PRFs, or even first lateral sinus lifts.
              </p>
              <p>
                But as time went on, doctors were asking for us to run various lectures so they can learn more details and expand their scope within implant dentistry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-8 sm:mb-10 md:mb-12 text-center" data-aos="fade-up">
              Timeline Highlights
            </h2>
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {/* November 2021 */}
              <div className="border-l-4 border-primary-600 pl-4 sm:pl-6 md:pl-8" data-aos="fade-up">
                <div className="mb-2 sm:mb-3">
                  <span className="text-primary-700 font-bold text-lg sm:text-xl md:text-2xl">Nov 2021</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-2 sm:ml-3">Foundation</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-900 mb-2 sm:mb-3">
                  Started with 12 Doctors + 2 Mentors
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Doctors would bring their own patients to place implants. We go over the cases in our waiting areas or staff rooms which got converted into classrooms.
                </p>
              </div>

              {/* May 2023 */}
              <div className="border-l-4 border-secondary-600 pl-4 sm:pl-6 md:pl-8" data-aos="fade-up" data-aos-delay="100">
                <div className="mb-2 sm:mb-3">
                  <span className="text-secondary-700 font-bold text-lg sm:text-xl md:text-2xl">May 2023</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-2 sm:ml-3">Partnership</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-900 mb-2 sm:mb-3">
                  HiOssen AIC Collaboration
                </h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  <p>
                    So on May 2023, we began collaborating with HiOssen AIC and started teaching the 8-day implant residency which includes 2 days of live surgery.
                  </p>
                  <p>
                    We understand that time for the courses meant time away from your practice and family & friends. So we wanted to deliver as much information in the least number of days possible.
                  </p>
                  <p>
                    In order to make that possible, we have fully printed notes where you can review at home as needed.
                  </p>
                  <p>
                    Our ultimate goal is to allow you to go back to your clinics and be able to apply the knowledge you've gained to your practice. In order to do that, hands-on learning is so crucial. We are proud to say that our residency has hands-on learning on every single day.
                  </p>
                </div>
              </div>

              {/* Today */}
              <div className="border-l-4 border-primary-600 pl-4 sm:pl-6 md:pl-8" data-aos="fade-up" data-aos-delay="200">
                <div className="mb-2 sm:mb-3">
                  <span className="text-primary-700 font-bold text-lg sm:text-xl md:text-2xl">Today</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-2 sm:ml-3">Excellence</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-900 mb-2 sm:mb-3">
                  Leading Implant Education
                </h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  <p>
                    On one of the days, we would use pig jaws to give more realistic feel for things like incision, flap reflection, bone grafting, and suturing.
                  </p>
                  <p>
                    A big part of our WISE and HiOssen's culture is to allow doctors to network with one another. And what better way is there than to do it over food and some drinks?
                  </p>
                  <p>
                    These photos are from WISE Live Surgery Study Club. In between patient care and after patient care is the fun time.
                  </p>
                </div>
              <div className="mb-6">
                <div className="sm:hidden flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory">
                  {COMMUNITY_PHOTOS.map((photo) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setActivePhoto(photo)}
                      className="relative min-w-[75%] snap-start rounded-2xl overflow-hidden border border-secondary-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="80vw" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                  {COMMUNITY_PHOTOS.map((photo) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setActivePhoto(photo)}
                      className="relative w-full rounded-2xl overflow-hidden border border-secondary-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                    >
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(min-width:1280px) 320px, (min-width:768px) 260px, 33vw"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-primary-50 rounded-lg p-3 sm:p-4 border border-primary-200">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-700 mb-1">2</div>
                    <div className="text-xs sm:text-sm text-gray-700 font-medium">Implant Residencies / year</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">(40 doctors)</div>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3 sm:p-4 border border-secondary-200">
                    <div className="text-2xl sm:text-3xl font-bold text-secondary-700 mb-1">3</div>
                    <div className="text-xs sm:text-sm text-gray-700 font-medium">Live Surgery Study Clubs / year</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">(40 doctors)</div>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 sm:p-4 border border-primary-200">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-700 mb-1">200+</div>
                    <div className="text-xs sm:text-sm text-gray-700 font-medium">Annual Teaching Hours</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Featured on PDC Live Stage</div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  <p>
                    Through WISE and HiOssen AIC education, we spend over 200 hours each year just in teaching.
                  </p>
                  <p>
                    Our highlight in our career and implant education is being on the PDC live stage surgery. The PDC scientific committee wanted us to target beginner implantologists since we are new to the PDC stage. But of course, what fun would it be if we spend an hour and a half placing one simple implant?
                  </p>
                </div>
                <div className="mb-6">
                  <div className="sm:hidden flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory">
                    {PDC_PHOTOS.map((photo) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => setActivePhoto(photo)}
                        className="relative min-w-[75%] snap-start rounded-2xl overflow-hidden border border-secondary-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                      >
                        <div className="relative aspect-[4/3]">
                          <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="80vw" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                    {PDC_PHOTOS.map((photo) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => setActivePhoto(photo)}
                        className="relative w-full rounded-2xl overflow-hidden border border-secondary-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                      >
                        <div className="relative aspect-[3/2]">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width:1280px) 320px, (min-width:768px) 260px, 33vw"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activePhoto && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center px-4">
          <div className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close photo"
            >
              ×
            </button>
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <div className="p-4 text-center text-sm text-secondary-600 bg-white">
              {activePhoto.alt}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
