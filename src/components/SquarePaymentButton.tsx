import { CreditCard, ExternalLink } from 'lucide-react';

type SquarePaymentButtonProps = {
  href: string;
  label: string;
  sublabel?: string;
  variant?: 'primary' | 'outline';
  className?: string;
};

export default function SquarePaymentButton({
  href,
  label,
  sublabel,
  variant = 'primary',
  className = '',
}: SquarePaymentButtonProps) {
  const baseClass =
    variant === 'primary'
      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-large shadow-medium'
      : 'border-2 border-primary-500 max-sm:bg-primary-500 max-sm:text-white sm:text-primary-700 sm:hover:bg-primary-500 sm:hover:text-white';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold transition-all duration-200 w-full ${baseClass} ${className}`.trim()}
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex flex-col items-start text-left min-w-0">
          <span className="truncate">{label}</span>
          {sublabel ? (
            <span className="text-[11px] font-normal opacity-80 mt-0.5 truncate">
              {sublabel}
            </span>
          ) : null}
        </span>
      </span>
      <ExternalLink
        className="hidden sm:block h-3.5 w-3.5 opacity-70 shrink-0 group-hover:translate-x-0.5 transition-transform"
        aria-hidden
      />
    </a>
  );
}
