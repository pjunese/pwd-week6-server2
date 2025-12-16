# PWD Week 6 – Ajou Campus Foodmap API

아주대 캠퍼스 맛집 앱의 백엔드입니다. Express 5 + MongoDB로 세션 기반 인증(로컬/구글/네이버), 맛집 CRUD, 인기 조회, 제보 수집·승인, 사용자 관리 기능을 제공합니다.

## 주요 기능
- 세션/쿠키 기반 인증: 로컬 로그인·회원가입, 소셜(OAuth) 지원 여부 자동 노출, `/api/auth/me`로 세션 복구.
?- 사용자 관리: 프로필 조회/수정, 비밀번호 변경(로컬), 계정 비활성화, 관리자 전용 전체 사용자 조회/권한 변경.
- 맛집 도메인: 목록/상세, 인기 TOP N(기본 5), 관리자 CRUD, 정적 이미지(`/images/*`) 제공.
- 제보 플로우: 제보 생성 → 상태별 필터링/조회 → 승인 시 맛집 등록, 제보 수정/삭제.
- 시드/헬스체크: 최초 기동 시 `src/data/restaurants.json` 자동 시딩, `/health`로 DB 연결 상태 확인.

## API 라우트 요약
- `GET /health` : 서버/DB 상태.
- `POST /api/auth/register|login|logout`, `GET /api/auth/me`, `GET /api/auth/config`, `GET /api/auth/google|naver` (환경 변수 설정 시 활성).
- `GET /api/restaurants`, `GET /api/restaurants/popular?limit=5`, `GET /api/restaurants/:id`, `POST|PUT|DELETE /api/restaurants/:id` (관리자).
- `GET /api/submissions[?status=pending|approved|rejected]`, `GET /api/submissions/:id`, `POST /api/submissions`, `PUT|DELETE /api/submissions/:id` (관리자).
- `GET /api/users/profile`, `PUT /api/users/profile`, `PUT /api/users/password`, `DELETE /api/users/account`.
- `GET /api/users/all`, `PUT /api/users/:userId/type` (관리자).

## 빠른 시작
```bash
npm install
cp .env.example .env   # 없으면 아래 예시를 참고해 .env 생성
npm run dev            # nodemon 개발 서버
# 프로덕션
npm start
```

### 환경 변수(.env 예시)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster/db
DB_NAME=foodmap-db
SESSION_SECRET=replace_me

# 클라이언트 도메인 (쉼표로 복수 가능)
CLIENT_URL=http://localhost:5173
PRODUCTION_CLIENT_URL=https://pwd-week6-client.vercel.app
DEFAULT_CLIENT_URL=https://pwd-week6-client.vercel.app

# 쿠키 옵션 강제 설정(선택): true/false/none
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=none
FORCE_SECURE_COOKIE=true

# OAuth(선택)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=/api/auth/google/callback
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_CALLBACK_URL=/api/auth/naver/callback
```
- 쿠키는 기본적으로 프로덕션/외부 도메인 접속 시 `Secure`+`SameSite=None`가 강제되므로 HTTPS에서 접근해야 합니다.
- `CLIENT_URL`/`PRODUCTION_CLIENT_URL`에 해시/프런트 주소를 정확히 넣어야 CORS와 쿠키가 정상 동작합니다.

## 스크립트
- `npm run dev` : nodemon 개발 서버
- `npm start` : 서버 실행
- `npm test` : Jest + Supertest 통합 테스트 (in-band)
- `npm run create-admin` : 관리자 계정 생성 CLI
- `npm run change-user-type` : 특정 사용자의 user/admin 전환 CLI

## 디렉터리 메모
- `src/app.js` : Express 설정, 세션·CORS, 라우트 매핑, `/health`
- `src/config/db.js` : MongoDB 연결/종료
- `src/config/passport.config.js` : 로컬/구글/네이버 전략
- `src/routes/*.routes.js` : 인증/맛집/제보/사용자 라우트
- `src/services/*` : 도메인 로직, 시드(`ensureSeededOnce`), ID 증가 로직
- `src/data/restaurants.json` : 초기 맛집 시드 데이터
- `cors-config.js` : 환경별 CORS 허용 도메인 계산

## 배포 노트
- 프록시(예: Render, Vercel) 뒤에서 동작할 때 `app.set('trust proxy', 1)`로 secure 쿠키가 활성화됩니다.
- 클라이언트는 `withCredentials`가 필요한 호출을 하므로, CORS 허용 목록과 쿠키 옵션을 배포 환경에 맞게 설정하세요.
