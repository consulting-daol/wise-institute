'use client'

import Link from 'next/link'
import { Calendar, Users, BookOpen, Stethoscope, Award, Clock, MapPin, Home } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '../../components/CallToActionBanner'

export default function ProgramsPage() {
  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="Wise Institute"
        title="Our Programs"
        description="Comprehensive implant education designed for busy clinicians who want to maximize learning in minimal time."
        backgroundClassName="bg-gradient-to-br from-background to-primary/5"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Programs' },
        ]}
      />

      {/* Implant Residency */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">
                  Implant Residency
                </h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">
                <span className="font-semibold text-primary">8 day implant residency</span> with HiOssen AIC partnership, featuring 2 days of live surgery. We understand that time away from practice means time away from family & friends, so we deliver as much information in the least number of days possible.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-secondary">Duration</h3>
                    <p className="text-xs sm:text-sm text-gray-600">8 intensive days with 2 live surgery sessions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-secondary">Capacity</h3>
                    <p className="text-xs sm:text-sm text-gray-600">20 doctors per cohort for personalized attention</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-secondary">Materials</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Printed course notes included for review</p>
                  </div>
                </div>
              </div>

              <Link href="/schedule" className="btn-primary">
                Register for Upcoming Course
              </Link>
            </div>

            <div data-aos="fade-left" className="bg-primary/5 rounded-xl p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">What You'll Learn</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Surgical Techniques</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Flap reflection, bone grafting, suturing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Hands-On Practice</h4>
                    <p className="text-xs sm:text-sm text-gray-600">We use pig jaws to give more realistic feel for things like incision, flap reflection, bone grafting and suturing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Live Surgery</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Real patient cases under supervision</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Clinical Application</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Ready to apply skills in your practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Surgery Study Club */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-left" className="bg-white rounded-xl p-8 card-shadow order-2 lg:order-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">Program Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Real Patient Cases</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Dentists bring their own patients for surgery</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Paired Learning</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Perform & assist under direct supervision</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Direct Mentorship</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Learn from Dr. Lee and Dr. Yoon personally</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Confidence Building</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Return to clinic ready to apply skills</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-right" className="order-1 lg:order-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">
                  Live Surgery Study Club
                </h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">
                Doctors would bring their own patients to place implants. Surgery time was busy; Doctors would be paired up for the day and take turn performing and assisting the surgery. Occasionally, Stephen and I would step in to demonstrate certain techniques.
              </p>
              
              <div className="bg-primary/5 rounded-xl p-6 mb-8">
                <blockquote className="text-base sm:text-lg italic text-gray-700">
                  "Our ultimate goal is for you to return to your clinic and confidently apply what you've learned."
                </blockquote>
                <cite className="text-sm sm:text-base text-primary font-semibold mt-2 block">— WISE Institute Directors</cite>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-secondary">Schedule</h3>
                    <p className="text-xs sm:text-sm text-gray-600">3 sessions per year, flexible timing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-secondary">Group Size</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Small groups for personalized attention</p>
                  </div>
                </div>
              </div>

              <Link href="/schedule" className="btn-primary">
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Networking & Community */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div data-aos="fade-up" className="space-y-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">
                  Networking & Community
                </h2>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
                A big part of our WISE and HiOssen's culture is to allow doctors to network with one another. And what better way is there than to do it over food and some drinks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div data-aos="fade-up" data-aos-delay="100" className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-secondary mb-2 sm:mb-3">Shared Experiences</h3>
                  <p className="text-sm sm:text-base text-gray-600">Doctors share experiences, challenges, and successes</p>
                </div>
                
                <div data-aos="fade-up" data-aos-delay="200" className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-secondary mb-2 sm:mb-3">Meals & Laughter</h3>
                  <p className="text-sm sm:text-base text-gray-600">Learning happens over food and drinks as much as in the clinic</p>
                </div>
                
                <div data-aos="fade-up" data-aos-delay="300" className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-secondary mb-2 sm:mb-3">Lifelong Connections</h3>
                  <p className="text-sm sm:text-base text-gray-600">Build professional relationships that last beyond the program</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Comparison */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4">
              Choose Your Program
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Both programs offer comprehensive training with different focuses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div data-aos="fade-right" className="bg-white rounded-xl p-8 card-shadow">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">Implant Residency</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">8-day intensive program</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">2 days of live surgery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Daily hands-on practice</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Printed course materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">HiOssen AIC partnership</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Perfect for:</p>
                <p className="text-sm sm:text-base text-gray-600">Busy clinicians who want comprehensive training in a structured format</p>
              </div>
            </div>

            <div data-aos="fade-left" className="bg-white rounded-xl p-8 card-shadow">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 sm:mb-6">Live Surgery Study Club</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Real patient cases</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Direct mentorship</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Paired learning approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Flexible scheduling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-600">Small group size</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Perfect for:</p>
                <p className="text-sm sm:text-base text-gray-600">Dentists ready to advance with real patient experience</p>
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
