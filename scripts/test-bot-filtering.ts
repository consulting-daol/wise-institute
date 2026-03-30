/**
 * 봇 필터링 테스트 스크립트
 * Usage: npx tsx scripts/test-bot-filtering.ts
 *
 * - 로컬 dev 서버 실행 필요 (npm run dev)
 * - Upstash 설정 시 rate limit 테스트 후 70초 대기 (sliding window 리셋)
 */

const BASE = 'http://localhost:3000';

async function sendRequestAndCheck(
  name: string,
  url: string,
  body: Record<string, unknown>,
  expectStatus?: number
): Promise<number> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    const status = res.status;
    const expected =
      expectStatus !== undefined
        ? status === expectStatus
        : status >= 200 && status < 300;
    const hint = body.website ? '(허니팟→200이지만 이메일 안 감)' : expected ? '(통과)' : '(차단)';
    console.log(expected ? '✅' : '❌', name, '|', status, hint, data.error ? `| ${data.error}` : '');
    return status;
  } catch (e) {
    console.log('❌', name, '| 에러:', (e as Error).message);
    return 0;
  }
}

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'program-info',
  message: '테스트 문의입니다.',
};

const regPayload = {
  name: 'Test',
  email: 'test@example.com',
  clinic: '',
  experience: 'beginner',
  program: 'residency',
  message: '',
};

async function run() {
  console.log('\n=== 봇 필터 테스트 (localhost:3000) ===\n');

  // 0. Rate Limit: 6회 연속 요청 → 6번째 429
  console.log('0. Rate Limit (5회/분, Upstash 설정 시)');
  const rateLimitPayload = { ...validPayload, website: 'x' };
  let rateLimited = false;
  for (let i = 0; i < 6; i++) {
    const status = await sendRequestAndCheck(`  요청 ${i + 1}/6`, `${BASE}/api/contact`, rateLimitPayload);
    if (status === 429) {
      rateLimited = true;
      console.log('   → 429 도달, rate limit 정상 동작 ✅\n');
      break;
    }
  }
  if (!rateLimited) {
    console.log('   → 6회 모두 200 (Upstash 미설정 시 rate limit 비활성화)\n');
  }
  if (rateLimited) {
    console.log('   (rate limit 윈도우 리셋 대기 70초...)');
    await new Promise((r) => setTimeout(r, 70000));
    console.log('');
  }

  // 1. 허니팟: website 필드에 값이 있으면 차단 (이메일不发送)
  console.log('1. 허니팟 테스트');
  await sendRequestAndCheck('Contact + 허니팟 채움', `${BASE}/api/contact`, {
    ...validPayload,
    website: 'https://spam-bot.com',
  });
  await sendRequestAndCheck('Registration + 허니팟 채움', `${BASE}/api/registration`, {
    name: 'Bot',
    email: 'bot@spam.com',
    clinic: '',
    experience: 'beginner',
    program: 'residency',
    message: '스팸',
    website: 'http://bot.net',
  });
  console.log('   → 200 반환하지만 이메일은 발송 안 됨 (봇으로 간주)\n');

  // 2. reCAPTCHA 토큰 없음
  console.log('2. reCAPTCHA 토큰 없음');
  await sendRequestAndCheck('Contact (토큰 없음)', `${BASE}/api/contact`, validPayload, 400);
  await sendRequestAndCheck('Registration (토큰 없음)', `${BASE}/api/registration`, regPayload, 400);
  console.log(
    '   → 로컬(개발): 통과 가능 | 프로덕션: 400 (reCAPTCHA verification required)\n'
  );

  // 3. 잘못된 reCAPTCHA 토큰
  console.log('3. 잘못된 reCAPTCHA 토큰');
  await sendRequestAndCheck('Contact (가짜 토큰)', `${BASE}/api/contact`, {
    ...validPayload,
    recaptchaToken: 'invalid-fake-token-12345',
  }, 400);
  await sendRequestAndCheck('Registration (가짜 토큰)', `${BASE}/api/registration`, {
    ...regPayload,
    recaptchaToken: 'invalid-fake-token-12345',
  }, 400);
  console.log('   → 400 (reCAPTCHA verification failed)\n');

  // 4. 이메일·이름 검증 (RECAPTCHA_SKIP_DEV=true일 때 검증 도달)
  console.log('4. 이메일·이름 검증');
  await sendRequestAndCheck('Contact (봇 이름 rH0XCxMmz...)', `${BASE}/api/contact`, {
    ...validPayload,
    name: 'rH0XCxMmzHRdgoCvDLtkSLN',
  });
  await sendRequestAndCheck('Registration (일회용 mailinator.com)', `${BASE}/api/registration`, {
    ...regPayload,
    email: 'test@mailinator.com',
  });
  await sendRequestAndCheck('Contact (점 과다 c.sall.e.s.0.1@gmail.com)', `${BASE}/api/contact`, {
    ...validPayload,
    email: 'c.sall.e.s.0.1@gmail.com',
  });
  await sendRequestAndCheck('Registration (ezweb.ne.jp 스팸 도메인)', `${BASE}/api/registration`, {
    ...regPayload,
    email: 'spam@ezweb.ne.jp',
  });
  console.log('   → 400 (Invalid name/email) 기대\n');

  // 5. 요약
  console.log('=== 테스트 완료 ===');
  console.log('필터: Rate Limit → Honeypot → reCAPTCHA → 점수 → 이메일·이름 검증');
  console.log('');
}

run();
