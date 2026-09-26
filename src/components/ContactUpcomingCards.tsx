'use client';

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { StudyClubPaymentLink } from '@/components/ProgramPaymentLinks';
import { SessionDateBullet, SessionDateText } from '@/components/SessionDateText';
import {
  DEFAULT_PROGRAMS,
  isHiossenRepProgram,
  type Program,
} from '@/lib/programs';
import { isSessionCompleted } from '@/lib/sessionDates';

const FOUNDATIONS_CARD_DETAILS: Record<
  string,
  {
    seasonLabel: string;
    modulesSummary: string[];
    locationLines: string[];
  }
> = {
  'hiossen-residency-2027': {
    seasonLabel: 'Spring 2027 – Vancouver',
    modulesSummary: [
      'Modules 1–2: Surgical (hands-on & theory)',
      'Module 3: Prosthetic & Treatment Planning (hands-on & theory)',
      'Module 4: Live Surgery',
    ],
    locationLines: [
      'Modules 1–3: AIC Training Centre (#122-8337 Eastlake Dr, Burnaby, BC V5A 4W2)',
      'Module 4: New Westminster City Dentist (#240-522 Seventh St, New Westminster, BC V3M 5T5)',
    ],
  },
  'residency-2026': {
    seasonLabel: 'Spring 2026 – Vancouver',
    modulesSummary: [
      'Modules 1–2: Surgical (hands-on & theory)',
      'Module 3: Prosthetic (hands-on & theory)',
      'Module 4: Live Surgery',
    ],
    locationLines: ['AIC Training Centre, 122-8337 Eastlake Dr, Burnaby, BC'],
  },
};

function isProgramPast(program: Program): boolean {
  if (program.status === 'Completed') return true;
  const endLabel = program.endDate ?? program.timelineDates ?? program.startDate;
  return isSessionCompleted(endLabel);
}

function pickUpcomingStudyClub(programs: Program[]): Program | undefined {
  const clubs = programs.filter((p) => p.type === 'Study Club' && p.isVisible !== false);
  return clubs.find((p) => !isProgramPast(p)) ?? clubs[0];
}

function pickUpcomingFoundations(programs: Program[]): Program | undefined {
  const foundations = programs.filter(
    (p) => p.type === 'Residency' && p.isVisible !== false && isHiossenRepProgram(p)
  );
  const upcoming = foundations
    .filter((p) => !isProgramPast(p))
    .sort((a, b) => {
      // Open first, then earlier start
      if (a.status === 'Open' && b.status !== 'Open') return -1;
      if (b.status === 'Open' && a.status !== 'Open') return 1;
      return 0;
    });
  return upcoming[0] ?? foundations.find((p) => p.status !== 'Completed');
}

function seasonLabelFor(program: Program): string {
  return (
    FOUNDATIONS_CARD_DETAILS[program.id]?.seasonLabel ??
    `${program.startDate} – ${program.location.split(',')[0] ?? 'Vancouver'}`
  );
}

export default function ContactUpcomingCards() {
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    fetch('/api/programs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPrograms(data);
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  const studyClub = pickUpcomingStudyClub(programs);
  const foundations = pickUpcomingFoundations(programs);
  const foundationsDetails = foundations
    ? FOUNDATIONS_CARD_DETAILS[foundations.id]
    : undefined;
  const foundationsPast = foundations ? isProgramPast(foundations) : false;
  const studyClubPast = studyClub ? isProgramPast(studyClub) : false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 items-stretch">
      {studyClub && (
        <div
          data-aos="fade-right"
          className={`rounded-2xl border border-secondary-100 bg-white p-5 sm:p-6 md:p-8 shadow-md h-full flex flex-col ${
            studyClubPast ? 'opacity-60 grayscale-[0.2]' : ''
          }`}
        >
          <div className="text-center mb-5 sm:mb-6">
            <p className="text-xs uppercase tracking-wider text-secondary-400 mb-1.5 sm:mb-2">
              {studyClubPast ? 'Completed Series' : 'Upcoming Event'}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-1.5 sm:mb-2 leading-tight">
              {studyClub.title}
            </h2>
            <p className="text-sm text-secondary-600 mb-2">
              {studyClub.location} · 8:00 AM – 5:00 PM
            </p>
            <div className="space-y-1.5 inline-flex flex-col items-start text-left mx-auto">
              {(studyClub.moduleDates ?? []).map((sessionDate) => (
                <SessionDateBullet key={sessionDate} date={sessionDate} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            {studyClub.price && (
              <div className="px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 min-w-[120px] text-center">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">
                  Price
                </p>
                <p className="text-sm sm:text-base font-bold text-secondary-900">{studyClub.price}</p>
              </div>
            )}
            <div className="px-4 py-3 rounded-xl bg-white border border-secondary-100 min-w-[120px] text-center">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">
                Duration
              </p>
              <p className="text-sm sm:text-base font-bold text-secondary-900">8:00 AM – 5:00 PM</p>
            </div>
            {studyClub.ceCredits && (
              <div className="px-4 py-3 rounded-xl bg-white border border-secondary-100 min-w-[120px] text-center">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">
                  CE Credits
                </p>
                <p className="text-sm sm:text-base font-bold text-secondary-900">
                  {studyClub.ceCredits.replace(/Credits/i, '').trim()}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2.5 sm:mb-3">
              What you&apos;ll do
            </h3>
            <p className="text-sm text-secondary-600 mb-3">
              Work on your own clinical cases and perform implant surgeries with real-time guidance in a
              small-group setting.
            </p>
            <ul className="space-y-2 text-sm text-secondary-700 mb-4 list-disc list-inside">
              <li>Case planning, workup, execution & recap</li>
              <li>Live surgical execution with expert feedback</li>
              <li>Real-time mentorship from Dr. Stephen Yoon</li>
              <li>Small group — spots are limited</li>
            </ul>

            {!studyClubPast && <StudyClubPaymentLink className="mb-4" />}

            <div className="mt-auto pt-4 border-t border-secondary-100">
              <p className="text-xs sm:text-sm text-secondary-600 mb-1">
                Led by: <span className="font-medium">Dr. Stephen Yoon</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {foundations && (
        <div
          data-aos="fade-left"
          className={`rounded-2xl border border-secondary-100 bg-white p-5 sm:p-6 md:p-8 shadow-md h-full flex flex-col ${
            foundationsPast ? 'opacity-60 grayscale-[0.2]' : ''
          }`}
        >
          <div className="text-center mb-5 sm:mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-1.5 sm:mb-2">
              <p className="text-xs uppercase tracking-wider text-secondary-400">
                {seasonLabelFor(foundations)}
              </p>
              {foundationsPast && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                  Completed
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-1.5 sm:mb-2 leading-tight">
              {foundations.title}
            </h2>
            <p className="text-sm text-secondary-600 mb-2">{foundations.location}</p>
            <p className="text-sm text-secondary-600 mb-1">
              <SessionDateText
                as="span"
                date={`Starts ${foundations.startDate}`}
                activeClassName="text-secondary-600"
              />
            </p>
            <div className="space-y-1 text-left inline-flex flex-col mx-auto mt-2">
              {(foundations.moduleDates ?? []).map((date) => (
                <SessionDateText
                  key={date}
                  date={date}
                  className="text-xs sm:text-sm"
                  activeClassName="text-secondary-700"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            {foundations.ceCredits && (
              <div className="px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 min-w-[120px] text-center">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-sky-600 font-semibold mb-0.5">
                  CE Credits
                </p>
                <p className="text-sm sm:text-base font-bold text-secondary-900">
                  {foundations.ceCredits.replace(/Credits/i, '').trim()}
                </p>
              </div>
            )}
            {foundations.price && (
              <div className="px-4 py-3 rounded-xl bg-white border border-secondary-100 min-w-[120px] text-center">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-500 font-semibold mb-0.5">
                  Price
                </p>
                <p className="text-sm sm:text-base font-bold text-secondary-900">{foundations.price}</p>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2.5 sm:mb-3">
              Registration details
            </h3>
            <p className="text-sm text-secondary-700 mb-2">
              {foundations.ceCredits ?? '56 CE Credits'} | Up to 4 Modules | 8 Days
            </p>
            <ul className="space-y-1.5 text-sm text-secondary-700 mb-3 list-disc list-inside">
              {(foundations.pricingOptions ?? []).map((option) => (
                <li key={option.amount}>
                  {option.amount} {option.note.replace(/^—\s*/, '').replace(/^\+\s*/, '+ ')}
                </li>
              ))}
              <li>Registration: 8:30 am | Course: 9:00 am – 5:00 pm</li>
            </ul>

            {foundationsDetails?.locationLines && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2 mt-2">Locations</h3>
                <ul className="space-y-1.5 text-sm text-secondary-700 mb-3 list-disc list-inside">
                  {foundationsDetails.locationLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-2 mt-2">Modules</h3>
            <ul className="space-y-1.5 text-sm text-secondary-700 mb-4 list-disc list-inside">
              {(
                foundationsDetails?.modulesSummary ?? [
                  'Modules 1–2: Surgical (hands-on & theory)',
                  'Module 3: Prosthetic & Treatment Planning (hands-on & theory)',
                  'Module 4: Live Surgery',
                ]
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {!foundationsPast && (
              <div className="mb-4 rounded-2xl border border-secondary-200 bg-secondary-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white shadow-sm ring-1 ring-secondary-200 flex items-center justify-center flex-shrink-0">
                    <Info className="h-4 w-4 text-primary" aria-hidden />
                  </div>
                  <p className="text-sm sm:text-base text-secondary-800 leading-relaxed">
                    To register for this program, please contact your Hiossen Representative.
                    {foundations.id === 'hiossen-residency-2027' && (
                      <>
                        {' '}
                        To learn more, please visit:{' '}
                        <a
                          href="https://www.aiceducation.ca/product/foundations-of-implant-dentistry-a-comprehensive-residency-program-spring-2027-vancouver/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary underline underline-offset-2 hover:text-primary-700"
                        >
                          Foundations of Implant Dentistry: A Comprehensive Residency Program – Spring
                          2027- Vancouver
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-secondary-100">
              <p className="text-xs sm:text-sm text-secondary-600 mb-1">
                Co-led by:{' '}
                <span className="font-medium">Dr. Lee (B.SC. PHARM, DMD)</span> ▪{' '}
                <span className="font-medium">Dr. Yoon (B.SC., DMD)</span>
              </p>
              <p className="text-xs text-secondary-400 text-center mt-3">Powered by HiOssen AIC Education</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
