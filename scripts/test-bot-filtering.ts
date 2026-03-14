/**
 * 봇 필터링 테스트 스크립트
 * Usage: npx tsx scripts/test-bot-filtering.ts
 *
 * 로컬 dev 서버가 실행 중이어야 합니다 (npm run dev)
 */

const BASE = 'http://localhost:3000';

async function test(name: string, url: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    const status = res.status;
    const ok = status >= 200 && status < 300;
    const hint = body.website ? '(허니팟→200이지만 이메일 안 감)' : ok ? '(통과)' : '(차단)';
    console.log(ok ? '✅' : '❌', name, '|', status, hint, data.error ? `| ${data.error}` : '');
  } catch (e) {
    console.log('❌', name, '| 에러:', (e as Error).message);
  }
}

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'program-info',
  message: '테스트 문의입니다.',
};

async function run() {
  console.log('\n=== 봇 필터 테스트 (localhost:3000) ===\n');

  // 1. 허니팟: website 필드에 값이 있으면 차단 (이메일不发送)
  console.log('1. 허니팟 테스트');
  await test('Contact + 허니팟 채움', `${BASE}/api/contact`, {
    ...validPayload,
    website: 'https://spam-bot.com',
  });
  await test('Registration + 허니팟 채움', `${BASE}/api/registration`, {
    name: 'Bot',
    email: 'bot@spam.com',
    clinic: '',
    experience: 'beginner',
    program: 'residency',
    message: '스팸',
    website: 'http://bot.net',
  });
  console.log('   → 200 반환하지만 이메일은 발송 안 됨 (봇으로 간주)\n');

  // 2. reCAPTCHA 토큰 없음 (로컬에서는 개발 모드라 통과할 수 있음)
  console.log('2. reCAPTCHA 토큰 없음');
  await test('Contact (토큰 없음)', `${BASE}/api/contact`, validPayload);
  await test('Registration (토큰 없음)', `${BASE}/api/registration`, {
    name: 'Test',
    email: 'test@example.com',
    clinic: '',
    experience: 'beginner',
    program: 'residency',
    message: '',
  });
  console.log(
    '   → 로컬(개발): 통과 가능 | 프로덕션: 400 (reCAPTCHA verification required)\n'
  );

  // 3. 잘못된 reCAPTCHA 토큰
  console.log('3. 잘못된 reCAPTCHA 토큰');
  await test('Contact (가짜 토큰)', `${BASE}/api/contact`, {
    ...validPayload,
    recaptchaToken: 'invalid-fake-token-12345',
  });
  await test('Registration (가짜 토큰)', `${BASE}/api/registration`, {
    name: 'Test',
    email: 'test@example.com',
    clinic: '',
    experience: 'beginner',
    program: 'residency',
    message: '',
    recaptchaToken: 'invalid-fake-token-12345',
  });
  console.log('   → 400 (reCAPTCHA verification failed)\n');

  console.log('=== 테스트 완료 ===\n');
}

run();
