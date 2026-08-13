# Rentry Opener

코드를 입력하면 `https://rentry.co/<코드>` 페이지를 새 탭으로 열어 주는 간단한 정적 웹 앱입니다.

예: `aabbcc` 입력 → `https://rentry.co/aabbcc` 열림

## 기능

- 코드 입력 시 실시간으로 최종 링크 미리보기
- **열기** 버튼: rentry 페이지를 새 탭에서 엽니다
- **링크 복사** 버튼: 만들어진 링크를 클립보드에 복사
- 전체 URL(`https://rentry.co/aabbcc`)을 붙여넣어도 코드만 자동 추출
- `?code=aabbcc` 쿼리 파라미터로 코드 자동 채움 (예: `https://내사이트/?code=aabbcc`)
- 오프라인 캐싱 및 홈 화면 설치(PWA) 지원

## 파일

- `index.html` — 앱 화면
- `styles.css` — 스타일 (라이트/다크 모드 지원)
- `app.js` — 코드 정규화 및 페이지 열기/복사 로직
- `manifest.json` — PWA 메타데이터
- `sw.js` — 오프라인 캐시 서비스 워커
- `icon-512.png` — 앱 아이콘
- `netlify.toml` — Netlify 배포 설정

## Netlify 배포

빌드 과정이 없는 정적 사이트입니다.

### 방법 1: Git 연동 (권장)

1. [Netlify](https://app.netlify.com) 로그인
2. **Add new site → Import an existing project**
3. 이 GitHub 저장소를 선택
4. 배포 설정은 `netlify.toml`에 이미 지정되어 있으므로 그대로 **Deploy**
   - Publish directory: `.`
   - Build command: 없음

### 방법 2: 드래그 앤 드롭

Netlify 대시보드의 **Sites** 화면에 이 폴더를 그대로 끌어다 놓으면 즉시 배포됩니다.

배포 후 생성된 URL을 열어 사용하면 됩니다. 아이폰 Safari에서 열고 홈 화면에 추가하면 앱처럼 사용할 수 있습니다.
