import { client } from './contentful';

export type ProgramType = 'Event' | 'Residency' | 'Study Club';
export type ProgramStatus = 'Open' | 'Closed' | 'Completed' | 'Waitlist';

export type Program = {
  id: string;
  title: string;
  type: ProgramType;
  startDate: string;
  endDate?: string;
  duration: string;
  capacity: string;
  location: string;
  status: ProgramStatus;
  description: string;
  price?: string;
  ceCredits?: string;
  moduleDates?: string[];
  timelineDates?: string;
  isVisible: boolean;
};

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'residency-2026',
    title: 'FOUNDATIONS OF IMPLANT DENTISTRY',
    type: 'Residency',
    startDate: 'April 11, 2026',
    endDate: 'July 12, 2026',
    duration: '8 days (4 modules)',
    capacity: 'Limited seats',
    location: 'AIC Training Centre, 122-8337 Eastlake Dr, Burnaby, BC',
    status: 'Open',
    description:
      'Foundations of Implant Dentistry: A Comprehensive Residency Program – Spring 2026 Vancouver. Module 1: April 11-12 (Surgical Foundations & Guided Surgery), Module 2: May 2-3 (Sinus Lift & Basic GBR), Module 3: June 6-7 (Prosthetic & Treatment Planning), Module 4: July 11-12 (Live Surgery Days). 56 CE Credits. 6 Workshop Days + 2 Live Surgery Days. Co-led by Dr. Lee & Dr. Yoon. Powered by HiOssen AIC Education.',
    price: '$7,500 – $9,500 + Tax',
    ceCredits: '56 CE Credits',
    moduleDates: [
      'Module 1: April 11-12, 2026',
      'Module 2: May 2-3, 2026',
      'Module 3: June 6-7, 2026',
      'Module 4: July 11-12, 2026 (Live Surgery)',
    ],
    timelineDates: 'April 11 – July 12, 2026',
    isVisible: true,
  },
  {
    id: 'study-club-2026',
    title: 'LIVE SURGERY STUDY CLUB',
    type: 'Study Club',
    startDate: 'June 14, 2026',
    endDate: 'November 8, 2026',
    duration: '4 live-surgery days · 8:00 AM – 5:00 PM each',
    capacity: 'Limited seats',
    location: 'Coquitlam City Dentist',
    status: 'Open',
    description:
      'A participant-driven, case-based surgical education program led by Dr. Stephen Yoon. Bring your own patients, plan and perform implant surgeries live, and receive real-time feedback in a small-group setting. Each session covers case presentations, surgical workup, live execution & post-op review.',
    price: '$4,999 CAD',
    ceCredits: '36 CE Credits',
    moduleDates: [
      'March 22, 2026 [completed]',
      'June 14, 2026',
      'September 13, 2026',
      'November 8, 2026',
    ],
    timelineDates: 'June 14 – November 8, 2026',
    isVisible: true,
  },
];

export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await client.getEntries({
      content_type: 'programsSettings',
      limit: 1,
    });

    if (response.items.length === 0) {
      return DEFAULT_PROGRAMS;
    }

    const item = response.items[0];
    const fields = item.fields as Record<string, unknown>;
    const programsField = fields.programs as unknown;

    // The field can be either:
    // - localized: { 'en-US': Program[] }
    // - non-localized: Program[]
    // Also, some APIs may serialize arrays as object-like values.
    let programs: Program[] | undefined;
    if (Array.isArray(programsField)) {
      programs = programsField as Program[];
    } else if (programsField && typeof programsField === 'object') {
      const maybeLocalized = (programsField as Record<string, unknown>)['en-US'];
      if (Array.isArray(maybeLocalized)) {
        programs = maybeLocalized as Program[];
      } else {
        // Attempt to recover if stored as object with numeric keys
        const values = Object.values(programsField as Record<string, unknown>).filter(Boolean);
        if (values.length && values.every((v) => typeof v === 'object' && v !== null)) {
          programs = values as Program[];
        }
      }
    }

    if (!Array.isArray(programs) || programs.length === 0) return DEFAULT_PROGRAMS;

    return programs.filter((p) => p.isVisible !== false);
  } catch {
    return DEFAULT_PROGRAMS;
  }
}
