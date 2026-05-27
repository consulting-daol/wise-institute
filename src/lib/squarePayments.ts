export type SquarePaymentOption = {
  label: string;
  url: string;
  sublabel?: string;
};

function paymentUrl(envValue: string | undefined): string | undefined {
  const url = envValue?.trim();
  return url && url.length > 0 ? url : undefined;
}

/** Public Square checkout links (set in .env.local). */
export const squarePaymentUrls = {
  residencyModules14: paymentUrl(process.env.NEXT_PUBLIC_SQUARE_RESIDENCY_MODULES_14),
  residencyModules13: paymentUrl(process.env.NEXT_PUBLIC_SQUARE_RESIDENCY_MODULES_13),
  studyClub: paymentUrl(process.env.NEXT_PUBLIC_SQUARE_STUDY_CLUB),
  sponsorship: paymentUrl(process.env.NEXT_PUBLIC_SQUARE_SPONSORSHIP),
} as const;

export function getResidencyPaymentOptions(): SquarePaymentOption[] {
  const options: SquarePaymentOption[] = [];

  if (squarePaymentUrls.residencyModules14) {
    options.push({
      label: 'Pay $9,500 (Modules 1–4)',
      sublabel: 'Includes live surgery',
      url: squarePaymentUrls.residencyModules14,
    });
  }

  if (squarePaymentUrls.residencyModules13) {
    options.push({
      label: 'Pay $7,500 (Modules 1–3)',
      sublabel: 'No live surgery',
      url: squarePaymentUrls.residencyModules13,
    });
  }

  return options;
}

export function getStudyClubPaymentOption(): SquarePaymentOption | undefined {
  if (!squarePaymentUrls.studyClub) return undefined;

  return {
    label: 'Pay $4,999',
    sublabel: 'Secure checkout via Square',
    url: squarePaymentUrls.studyClub,
  };
}

export function getSponsorshipPaymentOption(): SquarePaymentOption | undefined {
  if (!squarePaymentUrls.sponsorship) return undefined;

  return {
    label: 'Make a sponsorship payment',
    sublabel: 'Enter the amount agreed with our team',
    url: squarePaymentUrls.sponsorship,
  };
}

export function hasAnySquarePayments(): boolean {
  return Object.values(squarePaymentUrls).some(Boolean);
}

/** Maps registration form `program` field to Square checkout links. */
export function getPaymentOptionsForProgramInterest(
  programInterest: string
): SquarePaymentOption[] {
  const residency = getResidencyPaymentOptions();
  const studyClub = getStudyClubPaymentOption();

  switch (programInterest) {
    case 'residency':
      return residency;
    case 'study-club':
      return studyClub ? [studyClub] : [];
    case 'both':
      return [...residency, ...(studyClub ? [studyClub] : [])];
    default:
      return [...residency, ...(studyClub ? [studyClub] : [])];
  }
}

export function getRegistrationFormRedirectUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://wiseinstitute.com';
  return `${base}/schedule#registration-form`;
}
