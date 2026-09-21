/**
 * Helpers for marking program/session dates as completed once the day has passed.
 * Parses labels like:
 * - "June 14, 2026"
 * - "March 22, 2026 [completed]"
 * - "Module 1: April 17-18, 2027 — Hiossen Implant Canada"
 * - "Dates: April 11-12, 2026"
 * - "July 11-12, 2026 (Live Surgery Days)"
 * - "April 11 – July 12, 2026" / "April 11, 2026 – July 12, 2026"
 */

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseUsDate(month: string, day: string, year: string): Date | null {
  const parsed = new Date(`${month} ${day}, ${year}`);
  return Number.isNaN(parsed.getTime()) ? null : startOfLocalDay(parsed);
}

/** Normalize a date label before parsing. */
export function cleanSessionDateLabel(label: string): string {
  return label
    .replace(/\s*\[completed\]/gi, '')
    .replace(/^Dates:\s*/i, '')
    .replace(/^Starts\s+/i, '')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim();
}

/** End calendar day of a session label, or null if unparseable. */
export function parseSessionEndDate(label: string): Date | null {
  const withoutMarker = cleanSessionDateLabel(label);
  const withoutLocation = withoutMarker.split(/\s+[—]\s+/)[0]?.trim() ?? withoutMarker;
  const withoutModule = withoutLocation.replace(/^Module\s+\d+:\s*/i, '').trim();

  // Long range with both full dates: "April 11, 2026 – July 12, 2026"
  const longRange = withoutModule.match(
    /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*[-–]\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
  );
  if (longRange) {
    const [, , , , endMonth, endDay, endYear] = longRange;
    return parseUsDate(endMonth, endDay, endYear);
  }

  // Span with single year: "April 11 – July 12, 2026"
  const spanRange = withoutModule.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
  );
  if (spanRange) {
    const [, , , endMonth, endDay, year] = spanRange;
    return parseUsDate(endMonth, endDay, year);
  }

  // Same-month range: "April 17-18, 2027" or "April 17 – 18, 2027"
  const rangeMatch = withoutModule.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*(\d{1,2}),\s*(\d{4})$/
  );
  if (rangeMatch) {
    const [, month, , endDay, year] = rangeMatch;
    return parseUsDate(month, endDay, year);
  }

  // Single day: "June 14, 2026"
  const singleMatch = withoutModule.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (singleMatch) {
    const [, month, day, year] = singleMatch;
    return parseUsDate(month, day, year);
  }

  const fallback = new Date(withoutModule);
  return Number.isNaN(fallback.getTime()) ? null : startOfLocalDay(fallback);
}

export function isSessionCompleted(label: string, now: Date = new Date()): boolean {
  if (/\b\[completed\]/i.test(label)) return true;
  const end = parseSessionEndDate(label);
  if (!end) return false;
  // Completed once the calendar day after the session end begins.
  return startOfLocalDay(now) > end;
}

export function formatSessionLabel(
  label: string,
  completed: boolean,
  suffix: 'none' | 'completed-label' | 'check' = 'completed-label'
): string {
  // Keep module/location wording; only strip the manual [completed] marker.
  const display = label.replace(/\s*\[completed\]/gi, '').trim();
  if (!completed) return display;
  if (/—\s*Completed\b/i.test(display)) return display;
  if (suffix === 'check') return `${display} ✓`;
  if (suffix === 'completed-label') return `${display} — Completed`;
  return display;
}

export function sessionDateClassName(
  completed: boolean,
  options?: { activeClassName?: string; completedClassName?: string }
): string {
  if (completed) {
    return options?.completedClassName ?? 'line-through text-secondary-400';
  }
  return options?.activeClassName ?? '';
}
