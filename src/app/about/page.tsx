import Image from 'next/image'
import { Home } from 'lucide-react'
import PageHero from '../../components/PageHero'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <PageHero
        eyebrow="Wise Institute"
        title="About Us"
        backgroundImage="/gallery/wise.png"
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
          <div className="max-w-4xl mx-auto space-y-8" data-aos="fade-up">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 leading-relaxed">
              WISE Institute offers various educational programs for dentists who are committed to advancing their implant surgical skills through hands-on learning.
            </p>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              To all those who gather strength for the development of our programs and the bright future of our students, we once again extend our deepest respect and gratitude.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-12" data-aos="fade-up">
              Our Story
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-12 text-center" data-aos="fade-up">
              Timeline Highlights
            </h2>
            <div className="space-y-12">
              {/* November 2021 */}
              <div className="border-l-4 border-primary-600 pl-8" data-aos="fade-up">
                <div className="mb-3">
                  <span className="text-primary-700 font-bold text-xl sm:text-2xl">Nov 2021</span>
                  <span className="text-gray-500 text-sm ml-3">Foundation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-secondary-900 mb-3">
                  Started with 12 Doctors + 2 Mentors
                </h3>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Doctors would bring their own patients to place implants. We go over the cases in our waiting areas or staff rooms which got converted into classroom.
                </p>
              </div>

              {/* May 2023 */}
              <div className="border-l-4 border-secondary-600 pl-8" data-aos="fade-up" data-aos-delay="100">
                <div className="mb-3">
                  <span className="text-secondary-700 font-bold text-xl sm:text-2xl">May 2023</span>
                  <span className="text-gray-500 text-sm ml-3">Partnership</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-secondary-900 mb-3">
                  HiOssen AIC Collaboration
                </h3>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
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
              <div className="border-l-4 border-primary-600 pl-8" data-aos="fade-up" data-aos-delay="200">
                <div className="mb-3">
                  <span className="text-primary-700 font-bold text-xl sm:text-2xl">Today</span>
                  <span className="text-gray-500 text-sm ml-3">Excellence</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-secondary-900 mb-3">
                  Leading Implant Education
                </h3>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <div className="text-3xl font-bold text-primary-700 mb-1">2</div>
                    <div className="text-sm text-gray-700 font-medium">Implant Residencies / year</div>
                    <div className="text-xs text-gray-500 mt-1">(40 doctors)</div>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                    <div className="text-3xl font-bold text-secondary-700 mb-1">3</div>
                    <div className="text-sm text-gray-700 font-medium">Live Surgery Study Clubs / year</div>
                    <div className="text-xs text-gray-500 mt-1">(40 doctors)</div>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <div className="text-3xl font-bold text-primary-700 mb-1">200+</div>
                    <div className="text-sm text-gray-700 font-medium">Annual Teaching Hours</div>
                    <div className="text-xs text-gray-500 mt-1">Featured on PDC Live Stage</div>
                  </div>
                </div>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    Through WISE and HiOssen AIC education, we spend over 200 hours each year just in teaching.
                  </p>
                  <p>
                    Our highlight in our career and implant education is being on the PDC live stage surgery. The PDC scientific committee wanted us to target beginner implantologists since we are new to the PDC stage. But of course, what fun would it be if we spend an hour and a half placing one simple implant?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
