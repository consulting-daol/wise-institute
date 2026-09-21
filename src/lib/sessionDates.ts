/**
 * Helpers for marking program/session dates as completed once the day has passed.
 * Parses labels like:
 * - "June 14, 2026"
 * - "March 22, 2026 [completed]"
 * - "Module 1: April 17-18, 2027 — Hiossen Implant Canada"
 */

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** End calendar day of a session label, or null if unparseable. */
export function parseSessionEndDate(label: string): Date | null {
  const withoutMarker = label.replace(/\s*\[completed\]/gi, '').trim();
  const withoutLocation = withoutMarker.split(/\s+[—–-]\s+/)[0]?.trim() ?? withoutMarker;
  const withoutModule = withoutLocation.replace(/^Module\s+\d+:\s*/i, '').trim();

  // Range: "April 17-18, 2027" or "April 17 – 18, 2027"
  const rangeMatch = withoutModule.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*(\d{1,2}),\s*(\d{4})$/
  );
  if (rangeMatch) {
    const [, month, , endDay, year] = rangeMatch;
    const parsed = new Date(`${month} ${endDay}, ${year}`);
    return Number.isNaN(parsed.getTime()) ? null : startOfLocalDay(parsed);
  }

  // Single day: "June 14, 2026"
  const singleMatch = withoutModule.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (singleMatch) {
    const [, month, day, year] = singleMatch;
    const parsed = new Date(`${month} ${day}, ${year}`);
    return Number.isNaN(parsed.getTime()) ? null : startOfLocalDay(parsed);
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

export function formatSessionLabel(label: string, completed: boolean): string {
  const clean = label.replace(/\s*\[completed\]/gi, '').trim();
  if (!completed) return clean;
  if (/completed/i.test(clean)) return clean;
  return `${clean} — Completed`;
}
