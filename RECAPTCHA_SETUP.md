# Google reCAPTCHA v3 설정 가이드

Contact 폼과 Schedule 등록 폼에 reCAPTCHA v3가 적용되어 있습니다.

> **스팸 방지를 위해 프로덕션에서는 반드시 두 키를 설정해야 합니다.** Vercel 등 배포 환경의 Environment Variables에도 추가하세요.

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
- **점수 임계값 (선택)**: `RECAPTCHA_MIN_SCORE=0.5` (기본값, 0~1, 낮을수록 엄격)

## 3. 동작 방식

- **개발(localhost)**: `RECAPTCHA_SECRET_KEY`가 없어도 폼이 동작합니다.
- **프로덕션**: 두 키가 **반드시** 설정되어야 합니다. 하나라도 없으면 제출이 거부됩니다.
- **점수 임계값**: 0.6 미만 점수(봇 의심)는 자동 차단됩니다. `RECAPTCHA_MIN_SCORE=0.5` 등으로 완화 가능합니다.
- **허니팟**: 숨겨진 필드에 값을 넣으면 봇으로 판단해 이메일을 보내지 않고 성공 응답만 반환합니다.

## 4. 적용된 페이지

- `/contact` – Contact 폼
- `/schedule` – Registration 폼
