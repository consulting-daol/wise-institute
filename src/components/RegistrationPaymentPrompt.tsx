import Link from 'next/link';
import SquarePaymentButton from '@/components/SquarePaymentButton';
import { getPaymentOptionsForProgramInterest } from '@/lib/squarePayments';

type RegistrationPaymentPromptProps = {
  programInterest: string;
};

export default function RegistrationPaymentPrompt({
  programInterest,
}: RegistrationPaymentPromptProps) {
  const paymentOptions = getPaymentOptionsForProgramInterest(programInterest);

  if (paymentOptions.length === 0) {
    return (
      <div
        className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2"
        role="status"
      >
        <p className="text-sm font-semibold text-secondary-900">Registration received</p>
        <p className="text-xs sm:text-sm text-secondary-600">
          When you&apos;re ready to pay, use the payment buttons in the program cards above, or{' '}
          <Link href="#payments" className="text-primary-600 font-medium underline hover:text-primary-700">
            view all payment options
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border-2 border-primary/25 bg-gradient-to-br from-primary/5 to-white p-4 sm:p-5 space-y-3"
      role="status"
    >
      <div>
        <p className="text-sm sm:text-base font-bold text-secondary-900">
          Next step: complete your payment
        </p>
        <p className="text-xs sm:text-sm text-secondary-600 mt-1">
          Your registration was received. Continue to Square to pay tuition securely. Use the same
          name and email you entered above so we can match your payment to your seat.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {paymentOptions.map((option) => (
          <SquarePaymentButton
            key={option.url}
            href={option.url}
            label={option.label}
            variant="primary"
          />
        ))}
      </div>
      <p className="text-[11px] sm:text-xs text-secondary-500">
        You can also pay later from the program cards above. Tax is calculated at checkout.
      </p>
    </div>
  );
}
