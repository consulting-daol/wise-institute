/**
 * 이메일 검증 - 스팸/일회용 도메인 및 의심 패턴 차단
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'fakeinbox.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
  'sharklasers.com',
  'guerrillamailblock.com',
  'ezweb.ne.jp',
]);

function getBlockedDomains(): Set<string> {
  const extra = process.env.EMAIL_BLOCKED_DOMAINS;
  if (!extra) return DISPOSABLE_DOMAINS;
  const list = new Set(DISPOSABLE_DOMAINS);
  extra.split(',').forEach((d) => list.add(d.trim().toLowerCase()));
  return list;
}

/**
 * 로컬 파트(@ 앞)에 점이 4개 이상 있으면 스팸 패턴 (예: c.sall.e.s.0.1@gmail.com)
 */
function hasSuspiciousLocalPart(email: string): boolean {
  const local = email.split('@')[0] ?? '';
  const dotCount = (local.match(/\./g) ?? []).length;
  return dotCount >= 4;
}

/**
 * 15자 이상 연속 영숫자(공백 없음) = 봇 이름 패턴 가능성
 */
function hasSuspiciousName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 15) return false;
  return /^[a-zA-Z0-9]+$/.test(trimmed) && !/\s/.test(trimmed);
}

export function validateEmailForForm(email: string, name?: string): { ok: boolean; reason?: string } {
  const lower = email.toLowerCase().trim();
  const domain = lower.split('@')[1];
  if (!domain) return { ok: false, reason: 'Invalid email format' };

  if (getBlockedDomains().has(domain)) {
    return { ok: false, reason: 'Email domain not accepted' };
  }
  if (hasSuspiciousLocalPart(lower)) {
    return { ok: false, reason: 'Email format not accepted' };
  }
  if (name && hasSuspiciousName(name)) {
    return { ok: false, reason: 'Invalid name format' };
  }
  return { ok: true };
}
