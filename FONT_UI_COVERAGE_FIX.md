# 부크크 명조 UI 누락 범위 수정

2026-10-28. 원인은 웹폰트 파일 자체가 아니라 일부 UI 요소가 body의 --font-ui(고딕체)를 상속하고 있었던 것입니다.

## 공통 CSS 적용

- 5개 상단 메뉴 링크에 기존 --font-reading을 지정했습니다. 활성 메뉴의 원래 700 굵기·배경·색상은 그대로 유지합니다.
- 원고 설명 문구, 목차 버튼과 글자 크기 버튼, 이전/다음 버튼에 같은 폰트를 지정했습니다.
- FIFTEEN VOICES, ONE VOYAGE의 기존 영문 eyebrow 폰트는 유지했습니다.
- 목차의 .toc-date / .toc-summary / .toc-student 전체에 BookkMyungjo와 실제 Light의 300 굵기를 공통 지정했습니다. 항목별 예외나 인라인 덮어쓰기를 추가하지 않았습니다.
- 기존 명조 제목·순서 번호·페이지 번호·원고 본문은 이미 정상 적용되어 있어 변경하지 않았습니다.

## 보존과 검증

기존 globals.css를 수정하지 않고 font-family와 해당 목차 정보의 font-weight 선언만 추가했습니다. 기존 글자 크기·자간·행간·gap·padding·margin·color·overflow·max-height 선언 목록이 수정 전후 일치함을 프로그램으로 확인했습니다. 팝업 스크롤 관련 코드와 레이아웃, 컴포넌트·원고 데이터·이미지·폰트 파일은 변경하지 않았습니다.

390px 및 1440px Chromium에서 다음을 검증했습니다.

- 15개 요약 + 15개 학생 정보 + 실제 날짜가 있는 13개 날짜, 총 43개 요소의 computed font-family 및 font-weight 300.
- 각 요소의 실제 사용 글꼴을 DevTools Protocol로 조회: BookkMyungjo-Lt custom font가 글리프를 렌더링하고 시스템 폰트 대체가 없음.
- 날짜 없는 1·15번에는 날짜를 새로 만들지 않음.
- 5개 메뉴·원고 설명·도구 버튼·페이지 번호의 명조체 적용과 영문 eyebrow의 기존 Arial 유지.
- 팝업 overflow-y:auto 유지, 실제 하단 스크롤, 마지막 15번 선택·이동·팝업 닫힘.
- 기존 원고 전문·글자 크기 조절·포스터 전환·모든 메뉴 기능.

기존에 업로드된 Light/Bold TTF 및 WOFF2를 그대로 사용합니다. Light 300 / Bold 700 매핑과 한글 글리프 검증은 GALLERY_AND_FONTS_VALIDATION.md에 기록되어 있습니다.

## 제한

Safari/WebKit 엔진 다운로드가 현재 환경의 네트워크 정책에서 403으로 차단되어 Safari 실기·WebKit 실행 검증은 수행하지 못했습니다. Safari 테스트를 통과했다고 주장하지 않습니다. 다운로드 가능한 환경에서는 `npx playwright install webkit` 후 `npx playwright test --config=playwright.webkit.config.ts`로 동일한 두 폰트 검사를 실행할 수 있습니다.

## 최종 검사

- `npm test`: Chromium 테스트 12개 모두 통과.
- `npm run build`: 정적 빌드 통과.
- `npm run typecheck`: 통과.
- 기존 main에 반영하며 새 저장소나 사이트는 만들지 않습니다. Vercel 자동 배포 완료 상태는 현재 도구로 조회할 수 없습니다.
