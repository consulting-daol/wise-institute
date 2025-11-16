'use client'

import { useState } from 'react'
import { Home, Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '@/components/CallToActionBanner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        title="Contact Us"
        description="Interested in joining WISE? We'd love to hear from you and answer any questions about our programs."
        backgroundClassName="bg-gradient-to-br from-background to-primary/5"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Contact' },
        ]}
      />

      {/* Contact Information */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2">
            {/* Contact Details */}
            <div data-aos="fade-right" className="rounded-3xl border border-secondary-100 bg-white p-6 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Contact</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-secondary leading-tight">
                  We’re here to guide you through every step
                </h2>
                <p className="text-sm sm:text-base text-secondary-600">
                  Reach out for cohort availability, registration details, or just to talk through which program fits your clinic best.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary/15">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary">Email</h3>
                    <p className="text-sm text-secondary-700">info@wiseinstitute.ca</p>
                    <p className="text-xs text-secondary-500">We’ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary/15">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary">Phone</h3>
                    <p className="text-sm text-secondary-700">(604) 555-0123</p>
                    <p className="text-xs text-secondary-500">Monday – Friday, 9 AM – 5 PM PST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary/15">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary">Location</h3>
                    <p className="text-sm text-secondary-700">Western Canada</p>
                    <p className="text-xs text-secondary-500">Programs anchored across our Western Canada hub</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary/15">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary">Office Hours</h3>
                    <p className="text-sm text-secondary-700">Monday – Friday</p>
                    <p className="text-xs text-secondary-500">9:00 AM – 5:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div data-aos="fade-left" className="rounded-3xl border border-secondary-100 bg-background p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-4 sm:mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="program-info">Program Information</option>
                    <option value="registration">Registration Inquiry</option>
                    <option value="schedule">Schedule Questions</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your goals and any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-lg w-full flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div data-aos="fade-right" className="rounded-3xl border border-secondary-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Western Hub</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-secondary">
                Programs anchored in Western Canada
              </h2>
              <p className="text-sm sm:text-base text-secondary-600">
                Easily reachable from anywhere in Western Canada, with modern clinic setups, live surgery suites, and hands-on stations.
              </p>
              <div className="space-y-3 text-sm">
                <p className="text-secondary-500">Western Canada · Vancouver, BC anchor point</p>
                <p className="text-secondary-500">Programs rotate across our Western hub venues</p>
              </div>
            </div>

            <div data-aos="fade-left" className="rounded-3xl border border-secondary-100 overflow-hidden shadow-lg bg-white">
              <iframe
                title="WISE Institute Vancouver Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83327.511174602!2d-123.123904!3d49.25773545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673f143a94fb3%3A0xbb9196ea9b81f38b!2sVancouver%2C%20BC!5e0!3m2!1sen!2sca!4v1763330748548!5m2!1sen!2sca"
                width="100%"
                height="380"
                loading="lazy"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div data-aos="fade-up" className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Common questions about our programs and registration process.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div data-aos="fade-up" data-aos-delay="100" className="bg-background rounded-xl p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  What experience level is required for your programs?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our programs are designed for general dentists with varying levels of implant experience. We welcome beginners who have placed 0-5 implants, intermediate practitioners (5-50 implants), and advanced clinicians (50+ implants) looking to refine their skills.
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="200" className="bg-background rounded-xl p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  Do I need to bring my own patients for the Live Surgery Study Club?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Yes, for the Live Surgery Study Club, participants are encouraged to bring their own patients. This allows you to work on cases that are relevant to your practice while receiving direct mentorship from our experienced directors.
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="300" className="bg-background rounded-xl p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  What materials are included in the program fees?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  The Implant Residency program includes comprehensive printed course notes, all hands-on training materials, and access to our online resources. All surgical instruments and materials for hands-on practice are provided.
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="400" className="bg-background rounded-xl p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  How do I register for upcoming programs?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You can register your interest using the form on our Schedule page, or contact us directly via email or phone. We'll provide you with detailed program information and registration instructions.
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="500" className="bg-background rounded-xl p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  What is the cancellation policy?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We understand that schedules can change. Please contact us as soon as possible if you need to cancel or reschedule. We'll work with you to find the best solution, including transferring to a future program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <CallToActionBanner
        title="Still Have Questions?"
        description="Our team is here to help. Reach out to us directly for personalized assistance."
        primaryAction={{
          label: 'Email Us',
          href: 'mailto:info@wiseinstitute.ca',
          icon: <Mail className="h-5 w-5 text-primary-600" />,
        }}
        secondaryAction={{
          label: 'Call Us',
          href: 'tel:+16045550123',
          icon: <Phone className="h-5 w-5 text-white" />,
        }}
      />
    </div>
  )
}
