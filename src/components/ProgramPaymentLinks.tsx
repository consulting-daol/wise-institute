import Link from 'next/link';
import SquarePaymentButton from '@/components/SquarePaymentButton';
import {
  getResidencyPaymentOptions,
  getStudyClubPaymentOption,
} from '@/lib/squarePayments';

type ProgramPaymentLinksProps = {
  className?: string;
  registrationHref?: string;
};

function RegistrationNote({ href = '/schedule#registration-form' }: { href?: string }) {
  return (
    <p className="text-[11px] sm:text-xs text-secondary-500 leading-snug">
      Payment and registration are separate. Please also{' '}
      <Link href={href} className="text-primary-600 hover:text-primary-700 font-medium underline">
        complete the registration form
      </Link>{' '}
      so we can confirm your seat and follow up with prep details.
    </p>
  );
}

export function ResidencyPaymentLinks({
  className = '',
  registrationHref,
}: ProgramPaymentLinksProps) {
  const options = getResidencyPaymentOptions();
  if (options.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold">
        Pay by credit card
      </p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <SquarePaymentButton
            key={option.url}
            href={option.url}
            label={option.label}
            variant="outline"
          />
        ))}
      </div>
      <RegistrationNote href={registrationHref} />
    </div>
  );
}

export function StudyClubPaymentLink({
  className = '',
  registrationHref,
}: ProgramPaymentLinksProps) {
  const option = getStudyClubPaymentOption();
  if (!option) return null;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-secondary-600 font-semibold">
        Pay by credit card
      </p>
      <SquarePaymentButton href={option.url} label={option.label} variant="outline" />
      <RegistrationNote href={registrationHref} />
    </div>
  );
}
