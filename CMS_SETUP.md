# CMS Setup Guide

WISE Institute CMS는 Contentful을 기반으로 한 이미지 및 동영상 관리 시스템입니다.

## 📋 목차

1. [Contentful 계정 및 Space 생성](#1-contentful-계정-및-space-생성)
2. [Content Type 생성](#2-content-type-생성)
3. [API 토큰 생성](#3-api-토큰-생성)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [의존성 설치](#5-의존성-설치)
6. [사용 방법](#사용-방법)

---

## 필수 설정

### 1. Contentful 계정 및 Space 생성

1. [Contentful](https://www.contentful.com) 접속
2. **"Get started"** 또는 **"Sign up"** 클릭하여 계정 생성
3. 계정 생성 후 **"Create space"** 클릭
4. Space 이름 입력 (예: "WISE Institute")
5. **"Create space"** 클릭

### 2. Content Type 생성

Contentful Space에서 다음 **3개의 Content Type**을 생성합니다:

#### 📸 MediaItem Content Type

**생성 방법:**
1. Contentful Space에서 **"Content model"** 메뉴 클릭
2. **"Add content type"** 버튼 클릭
3. **Name**: `Media Item` 입력
4. **API identifier**: `mediaItem` (자동 생성되지만 확인 필요)
5. **"Create"** 클릭

**필드 추가:**
각 필드를 **"Add field"** 버튼으로 추가합니다:

| 필드 이름 | 필드 ID | 타입 | 필수 여부 | 설명 |
|---------|---------|------|----------|------|
| Title | `title` | Short text | ✅ Required | 미디어 제목 |
| Category | `category` | Short text | ❌ Optional | 카테고리 |
| Description | `description` | Long text | ❌ Optional | 설명 |
| Thumbnail | `thumbnail` | Media | ❌ Optional | 썸네일 이미지 (Multiple 선택) |
| Images | `images` | Media | ❌ Optional | 프로젝트 이미지들 (Multiple 선택) |
| Videos | `videos` | Media | ❌ Optional | 동영상 파일들 (Multiple 선택) |
| Order | `order` | Number (Integer) | ❌ Optional | 정렬 순서 |

**중요:** 
- `thumbnail`, `images`, `videos` 필드는 **"Allow multiple values"** 체크박스를 활성화해야 합니다
- `title` 필드는 **"Set as entry title"** 체크박스를 활성화하세요

#### 🏠 LandingPageSettings Content Type

**생성 방법:**
1. **"Add content type"** 버튼 클릭
2. **Name**: `Landing Page Settings` 입력
3. **API identifier**: `landingPageSettings` 확인
4. **"Create"** 클릭

**필드 추가:**

| 필드 이름 | 필드 ID | 타입 | 필수 여부 | 설명 |
|---------|---------|------|----------|------|
| Hero Slides | `heroSlides` | JSON Object | ❌ Optional | Hero 슬라이더 설정 (배열) |
| Campaign Items | `campaignItems` | JSON Object | ❌ Optional | Campaign 섹션 설정 (배열) |

**중요 설정 단계:**

1. **Hero Slides 필드 추가:**
   - **"Add field"** 버튼 클릭
   - 필드 타입 선택 화면에서 **"JSON object"** 선택
   - 필드 이름: `Hero Slides` 입력
   - Field ID: `heroSlides` 확인
   - **"Create and configure"** 클릭
   - **Settings** 탭으로 이동
   - "Required field"는 체크하지 않음 (Optional)
   - **"Create"** 클릭

2. **Campaign Items 필드 추가:**
   - **"Add field"** 버튼 클릭
   - 필드 타입 선택 화면에서 **"JSON object"** 선택
   - 필드 이름: `Campaign Items` 입력
   - Field ID: `campaignItems` 확인
   - **"Create and configure"** 클릭
   - **Settings** 탭으로 이동
   - "Required field"는 체크하지 않음 (Optional)
   - **"Create"** 클릭

**✅ 중요:**
- **"Allow multiple values"** 옵션이 없어도 정상입니다!
- Contentful의 JSON Object 필드는 배열을 직접 저장할 수 있습니다
- 코드에서 API를 통해 배열을 저장하면 자동으로 배열로 저장됩니다
- 예: `heroSlides: { 'en-US': [{...}, {...}] }` 형태로 저장하면 배열로 저장됩니다
- Contentful UI에서는 단일 JSON 객체처럼 보일 수 있지만, API를 통해 배열을 저장하면 정상 작동합니다

**JSON 구조 예시:**
```json
// heroSlides는 배열입니다 (여러 개의 객체)
[
  {
    "mediaItemId": "entry_id_here",
    "title": "Slide Title",
    "subtitle": "Subtitle",
    "description": "Description",
    "ctaText": "Learn More",
    "ctaLink": "/programs",
    "slideLabel": "Slide 1"
  },
  {
    "mediaItemId": "another_entry_id",
    "title": "Another Slide",
    "subtitle": "Another Subtitle",
    "description": "Another Description",
    "ctaText": "View More",
    "ctaLink": "/about",
    "slideLabel": "Slide 2"
  }
]

// campaignItems도 배열입니다 (여러 개의 객체)
[
  {
    "mediaItemId": "entry_id_here",
    "title": "Campaign Title 1"
  },
  {
    "mediaItemId": "another_entry_id",
    "title": "Campaign Title 2"
  }
]
```

**참고:**
- Contentful UI에서는 JSON Object 필드에 배열을 직접 입력할 수 없을 수 있습니다
- 하지만 **관리자 패널(`/admin`)을 통해 저장하면 자동으로 배열로 저장**됩니다
- 또는 API를 통해 직접 배열을 저장할 수 있습니다

#### 📰 NewsItem Content Type

**생성 방법:**
1. **"Add content type"** 버튼 클릭
2. **Name**: `News Item` 입력
3. **API identifier**: `newsItem` 확인
4. **"Create"** 클릭

**필드 추가:**

| 필드 이름 | 필드 ID | 타입 | 필수 여부 | 설명 |
|---------|---------|------|----------|------|
| Title | `title` | Short text | ✅ Required | 뉴스 제목 |
| Category | `category` | Short text | ✅ Required | 카테고리 (예: "Institute News", "Press Release") |
| Category Color | `categoryColor` | Short text | ✅ Required | 카테고리 색상 ("blue", "teal", "gray") |
| Description | `description` | Long text | ✅ Required | 뉴스 설명 |
| Date | `date` | Date & time | ✅ Required | 발행일 |
| Href | `href` | Short text | ❌ Optional | 링크 URL (기본값: "/news") - URL validation 권장 |
| Image | `image` | Media | ❌ Optional | 뉴스 이미지 (Single) |
| Order | `order` | Number (Integer) | ❌ Optional | 정렬 순서 |

**중요:**
- `title` 필드는 **"Set as entry title"** 체크박스를 활성화하세요
- `date` 필드는 **Date & time** 타입을 선택하세요
- `image` 필드는 **Single** (Multiple 아님)로 설정하세요
- `href` 필드 설정 (선택사항이지만 권장):
  - **Validation** 탭으로 이동
  - **"Match a specific pattern"** 체크박스 활성화
  - 드롭다운에서 **"URL"** 선택
  - 이렇게 하면 URL 형식만 입력할 수 있어 데이터 무결성을 보장합니다

### 3. API 토큰 생성

#### 3.1 Management API Token (관리자용)

이 토큰은 콘텐츠 생성/수정/삭제에 사용됩니다.

1. Contentful Space에서 **"Settings"** 메뉴 클릭
2. 왼쪽 메뉴에서 **"API keys"** 클릭
3. **"Content management tokens"** 탭 클릭
4. **"Generate personal token"** 버튼 클릭
5. 토큰 이름 입력 (예: "WISE Institute Admin")
6. **"Generate token"** 클릭
7. ⚠️ **토큰을 복사하여 안전한 곳에 저장** (한 번만 표시됩니다!)
8. 이 토큰을 `.env.local`의 `CONTENTFUL_MANAGEMENT_TOKEN`에 설정

#### 3.2 Content Delivery API Token (프론트엔드용)

이 토큰은 콘텐츠 조회에 사용됩니다.

1. **"Content delivery / preview tokens"** 탭 클릭
2. 기본 토큰이 이미 생성되어 있습니다
3. 또는 **"Add API key"** 버튼으로 새로 생성
4. 토큰 이름 입력 (예: "WISE Institute Frontend")
5. **"Create"** 클릭
6. **"Content delivery API - access token"** 값을 복사
7. 이 토큰을 `.env.local`의 `CONTENTFUL_ACCESS_TOKEN`에 설정

**Space ID 확인:**
- 같은 페이지에서 **"Space ID"** 값도 확인하세요
- 이 값을 `.env.local`의 `CONTENTFUL_SPACE_ID`에 설정

### 4. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.

**파일 위치:** `/Users/ryanback/Documents/GitHub/wise-institute-backup/.env.local`

**파일 내용:**
```env
# Contentful 설정
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master

# 관리자 인증
ADMIN_USERNAME=info@wiseinstitute.com
ADMIN_PASSWORD=your_secure_password_here
```

**각 값 설정 방법:**
- `CONTENTFUL_SPACE_ID`: Contentful Settings > API keys에서 확인
- `CONTENTFUL_MANAGEMENT_TOKEN`: 3.1에서 생성한 토큰
- `CONTENTFUL_ACCESS_TOKEN`: 3.2에서 생성한 토큰
- `CONTENTFUL_ENVIRONMENT`: `master` (기본값)
- `ADMIN_USERNAME`: 관리자 로그인 이메일
- `ADMIN_PASSWORD`: 관리자 로그인 비밀번호

**⚠️ 보안 주의사항:**
- `.env.local` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)
- 프로덕션 환경에서는 환경 변수를 서버 설정에서 관리하세요

### 5. 의존성 설치

터미널에서 프로젝트 루트 디렉토리로 이동 후 실행:

```bash
npm install
```

필요한 패키지들이 설치됩니다:
- `contentful` - Contentful Delivery API
- `contentful-management` - Contentful Management API
- `sharp` - 이미지 처리
- `@dnd-kit/*` - 드래그 앤 드롭
- 기타 의존성들

---

## 사용 방법

### 🚀 시작하기

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. 브라우저에서 `http://localhost:3000` 접속

3. 관리자 페이지 접근:
   - `/login` 페이지에서 로그인
   - 로그인 성공 시 `/admin` 페이지로 자동 리다이렉트

### 🔐 관리자 페이지 접근

1. 브라우저에서 `http://localhost:3000/login` 접속
2. `.env.local`에 설정한 `ADMIN_USERNAME`과 `ADMIN_PASSWORD`로 로그인
3. 로그인 성공 시 `/admin` 페이지로 자동 이동
4. 네비게이션 바에 초록색 "Admin" 배지가 표시되면 로그인 성공

### 📸 미디어 항목 관리

**접근:** 어드민 페이지에서 **"Media Management"** 탭 (기본 선택됨)

**생성:**
1. "Title" 필드에 제목 입력 (필수)
2. "Category" 필드에 카테고리 입력 (선택)
3. "Description" 필드에 설명 입력 (선택)
4. "Thumbnails"에서 썸네일 이미지 업로드 (최대 2개, 선택)
5. "Images"에서 이미지 업로드 (여러 개 가능, 선택)
6. "Videos"에서 동영상 업로드 (여러 개 가능, 선택)
7. **"Create Media"** 버튼 클릭

**수정:**
1. 미디어 목록에서 수정할 항목 찾기
2. 항목 옆 **"Edit"** 버튼 클릭
3. 필드 수정
4. **"Update Media"** 버튼 클릭

**삭제:**
1. 항목 옆 **"Delete"** 버튼 클릭
2. 확인 대화상자에서 **"OK"** 클릭

**순서 변경:**
1. 항목을 드래그하여 원하는 위치로 이동
2. **"Save Order"** 버튼 클릭 (우측 상단)

### 🏠 랜딩 페이지 설정

**접근:** 어드민 페이지에서 **"Landing Page"** 탭 클릭

**Hero Slider 설정:**
1. **"Add Slide"** 버튼 클릭
2. **"Select Media Item"** 드롭다운에서 미디어 선택
3. **"Title"** 입력 (필수)
4. **"Subtitle"**, **"Description"**, **"CTA Text"**, **"CTA Link"**, **"Slide Label"** 입력 (선택)
5. 드래그 앤 드롭으로 슬라이드 순서 변경
6. 슬라이드 삭제: 슬라이드 옆 **"X"** 버튼 클릭

**Campaign Section 설정:**
1. **"Add Item"** 버튼 클릭
2. **"Select Media Item"** 드롭다운에서 미디어 선택
3. **"Title"** 입력 (선택)
4. 드래그 앤 드롭으로 아이템 순서 변경
5. 아이템 삭제: 아이템 옆 **"X"** 버튼 클릭

**저장:**
1. **"Save Landing Page Settings"** 버튼 클릭
2. 저장 완료 메시지 확인
3. 메인 페이지(`/`)에서 변경사항 확인 (새로고침 필요할 수 있음)

### 📰 뉴스 관리

**접근:** 어드민 페이지에서 **"News"** 탭 클릭

**생성:**
1. **"Title"** 입력 (필수)
2. **"Category"** 입력 (필수, 예: "Institute News", "Press Release")
3. **"Category Color"** 선택 (필수, "blue", "teal", "gray")
4. **"Description"** 입력 (필수)
5. **"Date"** 선택 (필수)
6. **"Link"** 입력 (선택, 기본값: "/news")
7. **"Image"** 업로드 (선택)
8. **"Create"** 버튼 클릭

**수정:**
1. 뉴스 목록에서 수정할 항목 찾기
2. 항목 옆 **"Edit"** 버튼 클릭
3. 필드 수정
4. **"Update"** 버튼 클릭

**삭제:**
1. 항목 옆 **"Delete"** 버튼 클릭
2. 확인 대화상자에서 **"OK"** 클릭

**순서 변경:**
1. 항목을 드래그하여 원하는 위치로 이동
2. **"Save Order"** 버튼 클릭

**확인:**
- 랜딩 페이지(`/`)의 News 섹션에서 확인
- 뉴스 페이지(`/news`)에서 전체 목록 확인

### 🖼️ 이미지 최적화

- **자동 변환**: 모든 이미지는 자동으로 WebP 형식으로 변환됩니다
- **품질**: quality=100 (최고 품질)
- **최대 크기**: 2000px (비율 유지)
- **파일 크기**: 최대 2MB (압축 후)
- **처리**: 클라이언트에서 `browser-image-compression`으로 압축 후 서버에서 `sharp`로 WebP 변환

### 🎥 동영상 업로드

- 동영상 파일은 Contentful에 직접 업로드됩니다
- **지원 형식**: MP4, WebM, MOV 등 모든 비디오 형식
- **크기 제한**: Contentful의 제한에 따름 (일반적으로 1GB)
- **처리**: WebP 변환 없이 원본 그대로 업로드

## API 엔드포인트

### 공개 API

- `GET /api/media` - 모든 미디어 항목 조회
- `GET /api/news` - 모든 뉴스 항목 조회
- `GET /api/landing-page-settings` - 랜딩 페이지 설정 조회 (미디어 URL 포함)

### 관리자 API (인증 필요)

**미디어 관리:**
- `POST /api/admin/media` - 새 미디어 항목 생성
- `PUT /api/admin/media/[id]` - 미디어 항목 수정
- `DELETE /api/admin/media/[id]` - 미디어 항목 삭제
- `POST /api/admin/media/reorder` - 미디어 항목 순서 변경

**랜딩 페이지 설정:**
- `GET /api/admin/landing-page-settings` - 랜딩 페이지 설정 조회
- `POST /api/admin/landing-page-settings` - 랜딩 페이지 설정 저장

**뉴스 관리:**
- `POST /api/admin/news` - 새 뉴스 항목 생성
- `PUT /api/admin/news/[id]` - 뉴스 항목 수정
- `DELETE /api/admin/news/[id]` - 뉴스 항목 삭제
- `POST /api/admin/news/reorder` - 뉴스 항목 순서 변경

## 보안

- 관리자 페이지는 세션 기반 인증을 사용합니다
- 세션은 7일간 유효합니다
- 모든 관리자 API는 인증이 필요합니다

---

## 문제 해결

### ❌ Contentful 연결 오류

**증상:** 콘솔에 "CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN are required" 에러

**해결 방법:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 정확한지 확인 (대소문자 구분)
3. 개발 서버를 재시작 (`npm run dev`)
4. Contentful Settings > API keys에서 Space ID 확인
5. Management API Token과 Access Token이 올바른지 확인

### ❌ 이미지 업로드 실패

**증상:** 이미지 업로드 시 에러 발생

**해결 방법:**
1. 이미지 파일 크기 확인 (원본이 너무 크면 압축 후에도 실패할 수 있음)
2. 네트워크 연결 확인
3. Contentful API 할당량 확인 (무료 플랜: 월 100,000 API calls)
4. 브라우저 콘솔에서 에러 메시지 확인
5. 이미지 형식 확인 (JPG, PNG, WebP 등 지원)

### ❌ 인증 오류

**증상:** 로그인 실패 또는 "Authentication required" 에러

**해결 방법:**
1. `.env.local`의 `ADMIN_USERNAME`과 `ADMIN_PASSWORD` 확인
2. 세션 쿠키가 만료되었는지 확인 (다시 로그인 필요)
3. 브라우저 쿠키 삭제 후 다시 로그인
4. 개발 서버 재시작

### ❌ Content Type을 찾을 수 없음

**증상:** "Content type not found" 에러

**해결 방법:**
1. Contentful Space에서 Content Type이 생성되었는지 확인
2. Content Type ID가 정확한지 확인:
   - `mediaItem` (대소문자 구분)
   - `landingPageSettings` (대소문자 구분)
   - `newsItem` (대소문자 구분)
3. Content Type이 Published 상태인지 확인
4. 올바른 Space와 Environment를 사용하는지 확인

### ❌ 드래그 앤 드롭이 작동하지 않음

**증상:** 순서 변경이 안 됨

**해결 방법:**
1. 브라우저 콘솔에서 에러 확인
2. `@dnd-kit` 패키지가 설치되었는지 확인 (`npm install`)
3. 개발 서버 재시작
4. 브라우저 캐시 삭제

---

## 📊 Contentful 무료 플랜 제한

현재 구조는 **무료 플랜으로 충분**합니다:

- ✅ **Content Types**: 25개까지 가능 (현재 3개 사용)
- ✅ **API Calls**: 월 100,000회
- ✅ **Bandwidth**: 50GB/월
- ✅ **Users**: 5명

**현재 사용률:**
- Content Types: 3/25 (12%)
- 여유 공간: 22개 추가 가능

---

## 🎉 완료!

이제 CMS 설정이 완료되었습니다. 다음 단계:

1. ✅ Contentful Space 생성
2. ✅ 3개 Content Type 생성
3. ✅ API 토큰 생성
4. ✅ 환경 변수 설정
5. ✅ 의존성 설치
6. 🚀 개발 서버 실행 및 테스트

문제가 발생하면 위의 "문제 해결" 섹션을 참고하세요.

