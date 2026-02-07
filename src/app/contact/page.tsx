'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Home, Mail, Phone, MapPin, Clock, Send, HelpCircle, Plus, Minus } from 'lucide-react'
import PageHero from '../../components/PageHero'
import CallToActionBanner from '@/components/CallToActionBanner'

function ContactFormWithParams() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    const program = searchParams.get('program')
    if (program === 'residency') {
      setFormData(prev => ({
        ...prev,
        subject: 'registration',
        message: 'I am interested in the Implant Residency program (8-day intensive program with 2 live surgery days).'
      }))
    } else if (program === 'study-club') {
      setFormData(prev => ({
        ...prev,
        subject: 'registration',
        message: 'I am interested in the Live Surgery Study Club program.'
      }))
    }
  }, [searchParams])

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
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (response.ok) {
      //   // Show success message
      //   setFormData({ name: '', email: '', subject: '', message: '' })
      // }
    } catch (error) {
      // Handle error
    }
  }

  return (
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
  )
}

export default function ContactPage() {
  const [openFAQ, setOpenFAQ] = useState<number[]>([])

  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="WISE Institute"
        title="Contact Us"
        description="Interested in joining WISE? We'd love to hear from you and answer any questions about our programs."
        backgroundImage="/gallery/WISE.017.webp"
        heightClassName="h-[40vh] min-h-[350px]"
        contentProps={{ 'data-aos': 'fade-up' }}
        breadcrumbs={[
          { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, showLabel: false },
          { label: 'Contact' },
        ]}
      />

      {/* Upcoming Events Section */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-sky-50/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 items-stretch">
            {/* PDC 2026 Live Surgery Event */}
            <div data-aos="fade-right" className="rounded-2xl border border-secondary-100 bg-white p-5 sm:p-6 md:p-8 shadow-md h-full flex flex-col">
              <div className="text-center mb-5 sm:mb-6">
                <p className="text-xs uppercase tracking-wider text-secondary-400 mb-1.5 sm:mb-2">Upcoming Event</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-1.5 sm:mb-2 leading-tight">
                  LIVE SURGERY at PDC 2026
                </h2>
                <p className="text-sm text-secondary-600">
                  VCC West – Exhibit Hall Live Stage | March 5, 2026 | 9:30–11:00 AM
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 min-w-[120px] text-center">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-sky-600 font-semibold mb-0.5">Admission</p>
                  <p className="text-sm sm:text-base font-bold text-secondary-900">Free</p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-white border border-secondary-100 min-w-[120px] text-center">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">Duration</p>
                  <p className="text-sm sm:text-base font-bold text-secondary-900">1.5 hours</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2.5 sm:mb-3">
                  Session Focus
                </h3>
                <p className="text-sm text-secondary-600 mb-3">
                  Innovative implant solutions for replacing posterior maxillary teeth—practical approaches for cases with limited vertical bone height and proximity to the maxillary sinus.
                </p>
                <ul className="space-y-2 text-sm text-secondary-700 mb-4 list-disc list-inside">
                  <li>Short implant placement techniques to minimize or avoid sinus involvement</li>
                  <li>Simplified sinus lifting and bone augmentation methods</li>
                  <li>3D guided planning and surgery for safe navigation around vital anatomy</li>
                </ul>

                <div className="mt-auto pt-4 border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600 mb-1">
                    Co-led by: <span className="font-medium">Dr. Chris Lee (DMD, B.SC. PHARM)</span> ▪ <span className="font-medium">Dr. Stephen Yoon (DMD, B.SC)</span>
                  </p>
                  <p className="text-xs text-secondary-400 text-center mt-3">
                    Co-Sponsored by Hiossen
                  </p>
                </div>
              </div>
            </div>

            {/* Foundations of Implant Dentistry */}
            <div data-aos="fade-left" className="rounded-2xl border border-secondary-100 bg-white p-5 sm:p-6 md:p-8 shadow-md h-full flex flex-col">
              <div className="text-center mb-5 sm:mb-6">
                <p className="text-xs uppercase tracking-wider text-secondary-400 mb-1.5 sm:mb-2">Spring 2025</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-1.5 sm:mb-2 leading-tight">
                  FOUNDATIONS OF IMPLANT DENTISTRY
                </h2>
                <p className="text-sm text-secondary-600">
                  Vancouver, BC | Starts March 22, 2025
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 min-w-[120px] text-center">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-sky-600 font-semibold mb-0.5">CE Credits</p>
                  <p className="text-sm sm:text-base font-bold text-secondary-900">56 CE</p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-white border border-secondary-100 min-w-[120px] text-center">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">Price</p>
                  <p className="text-sm sm:text-base font-bold text-secondary-900">From $7,500 + Tax</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2.5 sm:mb-3">
                  Course Topics Include:
                </h3>
                <ul className="space-y-2 text-sm text-secondary-700 mb-4 list-disc list-inside">
                  <li>Consultation</li>
                  <li>Suture techniques</li>
                  <li>Implant placement</li>
                  <li>Sinus lift basics</li>
                  <li>Live surgery</li>
                </ul>

                <div className="mt-auto pt-4 border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600 mb-1">
                    Co-led by: <span className="font-medium">Dr. Chris Lee (DMD, B.SC. PHARM)</span> ▪ <span className="font-medium">Dr. Stephen Yoon (DMD, B.SC)</span>
                  </p>
                  <p className="text-xs text-secondary-400 text-center mt-3">
                    Powered by HiOssen AIC Education
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <Suspense fallback={<div className="text-center py-8 text-secondary-600">Loading form...</div>}>
                <ContactFormWithParams />
              </Suspense>
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
      <section className="py-10 sm:py-14 bg-white">
        <div className="container-custom">
            <div data-aos="fade-up" className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-secondary-600">
                Common questions about our programs and registration process.
              </p>
            </div>

            {/* Contact Info Box */}
            <div data-aos="fade-up" className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <p className="text-sm sm:text-base text-secondary-700 mb-3">
                If you have any other questions, please contact us at the numbers below and we will kindly assist you.
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-secondary-700">(604) 555-0123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-secondary-700">info@wiseinstitute.ca</span>
                </div>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {[
                {
                  question: 'What experience level is required for your programs?',
                  answer: 'Our programs are designed for general dentists with varying levels of implant experience. We welcome beginners who have placed 0-5 implants, intermediate practitioners (5-50 implants), and advanced clinicians (50+ implants) looking to refine their skills.'
                },
                {
                  question: 'Do I need to bring my own patients for the Live Surgery Study Club?',
                  answer: 'Yes, for the Live Surgery Study Club, participants are encouraged to bring their own patients. This allows you to work on cases that are relevant to your practice while receiving direct mentorship from our experienced directors.'
                },
                {
                  question: 'What materials are included in the program fees?',
                  answer: 'The Implant Residency program includes comprehensive printed course notes, all hands-on training materials, and access to our online resources. All surgical instruments and materials for hands-on practice are provided.'
                },
                {
                  question: 'How do I register for upcoming programs?',
                  answer: "You can register your interest using the form on our Schedule page, or contact us directly via email or phone. We'll provide you with detailed program information and registration instructions."
                },
                {
                  question: 'What is the cancellation policy?',
                  answer: "We understand that schedules can change. Please contact us as soon as possible if you need to cancel or reschedule. We'll work with you to find the best solution, including transferring to a future program."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`border border-secondary-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                    openFAQ.includes(index) ? 'bg-sky-50/50' : 'bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpenFAQ(prev => {
                        if (prev.includes(index)) {
                          return prev.filter(i => i !== index)
                        } else {
                          return [...prev, index]
                        }
                      })
                    }}
                    className={`w-full flex items-start gap-4 p-5 sm:p-6 text-left transition-colors ${
                      openFAQ.includes(index) ? 'bg-sky-50/50' : 'hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-secondary mb-0 pr-8">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {openFAQ.includes(index) ? (
                        <Minus className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Plus className="h-5 w-5 text-secondary-400" />
                      )}
                    </div>
                  </button>
                  {openFAQ.includes(index) && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-16 sm:pl-20 bg-sky-50/50">
                      <div className="pt-4 border-t border-secondary-100">
                        <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
