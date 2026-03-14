const DEFAULT_MIN_SCORE = 0.6;

/**
 * Server-side reCAPTCHA v3 verification.
 * Call this in API routes before processing form submissions.
 * Rejects low-score submissions (likely bots).
 */
export async function verifyRecaptchaToken(token: string): Promise<{
  success: boolean;
  score?: number;
  action?: string;
  errorCodes?: string[];
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('RECAPTCHA_SECRET_KEY not set in production – rejecting to prevent spam.');
      return { success: false, errorCodes: ['missing-secret-key'] };
    }
    console.warn('RECAPTCHA_SECRET_KEY not set; skipping verification (development only)');
    return { success: true };
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
  });

  const data = (await response.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    'error-codes'?: string[];
  };

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || DEFAULT_MIN_SCORE;
  const score = data.score ?? 0;
  const passesScore = score >= minScore;

  return {
    success: data.success && passesScore,
    score: data.score,
    action: data.action,
    errorCodes: data['error-codes'],
  };
}
