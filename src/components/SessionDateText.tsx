import {
  formatSessionLabel,
  isSessionCompleted,
  sessionDateClassName,
} from '@/lib/sessionDates';

type SessionDateTextProps = {
  date: string;
  className?: string;
  activeClassName?: string;
  completedClassName?: string;
  /** How to annotate completed dates in the visible text */
  suffix?: 'none' | 'completed-label' | 'check';
  as?: 'p' | 'span';
};

/** Renders a date label, auto grayed + completed once the session day has passed. */
export function SessionDateText({
  date,
  className = '',
  activeClassName,
  completedClassName,
  suffix = 'completed-label',
  as: Tag = 'p',
}: SessionDateTextProps) {
  const completed = isSessionCompleted(date);
  const statusClass = sessionDateClassName(completed, { activeClassName, completedClassName });

  return (
    <Tag className={`${statusClass} ${className}`.trim()}>
      {formatSessionLabel(date, completed, suffix)}
    </Tag>
  );
}

type SessionDateBulletProps = {
  date: string;
  className?: string;
};

/** Bullet row matching the Study Club “Upcoming Sessions” pattern. */
export function SessionDateBullet({ date, className = '' }: SessionDateBulletProps) {
  const completed = isSessionCompleted(date);

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          completed ? 'bg-gray-300' : 'bg-emerald-500'
        }`}
      />
      <span
        className={
          completed
            ? 'text-sm text-secondary-400 line-through'
            : 'text-sm text-secondary-700 font-medium'
        }
      >
        {formatSessionLabel(date, completed, 'completed-label')}
      </span>
    </div>
  );
}
