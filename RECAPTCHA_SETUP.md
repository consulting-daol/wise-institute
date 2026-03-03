# Google reCAPTCHA v3 설정 가이드

Contact 폼과 Schedule 등록 폼에 reCAPTCHA v3가 적용되어 있습니다.

## 1. reCAPTCHA 사이트 생성

1. [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) 접속
2. **등록** 클릭
3. **표시 이름**: `WISE Institute` (또는 원하는 이름)
4. **reCAPTCHA 유형**: **reCAPTCHA v3** (점수 기반)
5. **도메인** 추가:
   - `localhost` (개발용)
   - `wiseinstitute.com` (프로덕션)
   - 배포 도메인이 있다면 추가
6. 동의 체크 후 **제출**

## 2. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# reCAPTCHA v3 (클라이언트 - 공개 키)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here

# reCAPTCHA v3 (서버 검증용 - 비공개)
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

- **사이트 키 (Site Key)**: Admin Console에서 복사 → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **비밀 키 (Secret Key)**: Admin Console에서 복사 → `RECAPTCHA_SECRET_KEY`

## 3. 동작 방식

- **키 미설정 시**: reCAPTCHA 검증이 건너뛰어지고 폼이 정상 동작합니다 (개발 시 편의).
- **비밀 키만 설정된 경우**: 토큰이 없으면 서버에서 400 에러를 반환합니다.
- **둘 다 설정된 경우**: 클라이언트에서 토큰을 받아 서버에서 Google API로 검증 후 처리합니다.

## 4. 적용된 페이지

- `/contact` – Contact 폼
- `/schedule` – Registration 폼
