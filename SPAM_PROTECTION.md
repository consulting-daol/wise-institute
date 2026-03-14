# 스팸 방지 설정 가이드

## 적용된 필터 (6단계)

| 순서 | 필터 | 설명 |
|------|------|------|
| 1 | **Rate Limit** | IP당 분당 5회 제한 |
| 2 | **Honeypot** | 숨김 필드 → 봇 차단 |
| 3 | **reCAPTCHA v3** | 토큰 없음/가짜 → 차단 |
| 4 | **reCAPTCHA 점수** | 0.6 미만 → 차단 |
| 5 | **이메일 검증** | 일회용/스팸 도메인, 의심 패턴 차단 |
| 6 | **이름 검증** | 15자+ 랜덤 문자열 → 차단 |

---

## Rate Limit (Upstash)

**필요 시** Upstash Redis를 설정하면 분당 5회 제한이 적용됩니다.

### 설정 방법

1. [Upstash Console](https://console.upstash.com/)에서 Redis DB 생성
2. Vercel Environment Variables에 추가:

```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

- **미설정 시**: Rate limit 건너뛰고 다음 필터로 진행

---

## 이메일 검증

### 기본 차단
- 일회용 도메인: mailinator, guerrillamail, 10minutemail, yopmail 등
- `ezweb.ne.jp` (스팸 크롤러로 확인)
- 로컬 파트에 점 4개 이상 (예: `c.sall.e.s.0.1@gmail.com`)
- 이름 15자 이상 + 영숫자만 (예: `rH0XCxMmzHRdgoCvDLtkSLN`)

### 추가 차단 도메인

`.env` / Vercel에 추가:

```
EMAIL_BLOCKED_DOMAINS=spam.com,bot.net
```

쉼표로 구분해 여러 도메인 추가 가능.

---

## 환경변수 요약

| 변수 | 필수 | 용도 |
|------|------|------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | reCAPTCHA |
| `RECAPTCHA_SECRET_KEY` | ✅ | reCAPTCHA |
| `EMAIL_USER` | ✅ | SMTP 발신 |
| `APP_PASSWORD` | ✅ | Gmail 앱 비밀번호 |
| `UPSTASH_REDIS_REST_URL` | 선택 | Rate limit |
| `UPSTASH_REDIS_REST_TOKEN` | 선택 | Rate limit |
| `EMAIL_BLOCKED_DOMAINS` | 선택 | 추가 차단 도메인 |
