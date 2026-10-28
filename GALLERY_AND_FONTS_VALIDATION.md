# 사건현장 포스터 및 부크크 명조 연결

2026-10-28. 기존 plusrin/2026- 저장소와 Vercel Git 연동을 유지합니다.

## 포스터 파일 검증

업로드 커밋 `b20c6a4`의 신규 이미지 10개만 확인했습니다. 폴더의 `.gitkeep`은 제외했습니다. 앞면/뒷면이 모두 있는 5쌍이며 중복 면·중복 파일 내용·누락 면은 없습니다. 이미지 원본 10개의 SHA-256을 작업 전후 대조해 변경 없음을 확인했습니다. 변환·재압축·크롭·색상 수정은 하지 않았습니다.

모든 경로의 접두사는 `public/images/archive/`입니다.

| 오류 종류 | 학생 | 앞면 파일 | 뒷면 파일 |
|---|---|---|---|
| 개인화 | 안민성 | 개인화_안민성_앞면.jpg | 개인화_안민성_뒷면.jpg |
| 과잉일반화 | 김은송 | 과잉일반화_김은송_앞면.jpg | 과잉일반화_김은송_뒷면.jpg |
| 선택적 추상화 | 박유나 | 선택적 추상화_박유나_앞면.jpg | 선택적 추상화_박유나_뒷면.jpg |
| 임의적추론 | 김경민 | 임의적추론_김경민_앞면.jpg | 임의적추론_김경민_뒷면.jpg |
| 파국화 | 김세연 | 김세연_파국화_앞면.jpg | 김세연_파국화_뒷면.jpg |

마지막 쌍은 파일명 필드 순서가 반대입니다. 뒷면의 ‘파국화란?’ 해설을 육안 확인하여 오류 종류는 파국화, 파일명의 학생 이름은 김세연으로 연결했습니다. 원본 파일명은 변경하지 않았습니다. 학반은 제공되지 않아 데이터와 카드에서 생략했습니다.

## 갤러리 동작 및 범위

- `src/data/scenePosters.json`에 5개 매핑을 저장하고 scene 영역에만 연결했습니다.
- 데스크톱은 2열, 600px 이하 모바일은 1열입니다. 모든 면을 `height:auto; object-fit:contain`으로 표시합니다.
- 기본 앞면, 카드 이미지 클릭/터치 또는 별도 버튼으로 뒤집기, 작품별 독립 상태를 제공합니다. 160ms 전환과 동작 줄이기 설정을 지원합니다.
- 확대 보기는 현재 면으로 열립니다. 모달의 앞·뒷면 전환은 선택된 카드에만 동기화하며 확대/축소·원본 보기·Escape·초점 복귀를 유지합니다.
- 일상생활 영역에는 새 포스터를 넣지 않았습니다. 해당 영역의 기존 빈 상태 및 기본 카드 동작은 유지했습니다. 전시 설명·심리테스트 URL·성선혁 학생 크레딧은 변경하지 않았습니다.

## 업로드 폰트 확인

폰트 업로드 커밋 `a669e4b`에서 다음 두 원본을 가져왔습니다.

| 파일 | 형식 | 내부 굵기 | PostScript 이름 |
|---|---|---|---|
| public/fonts/BookkMyungjo_Light.ttf | TrueType | 300 Light | BookkMyungjo-Lt |
| public/fonts/BookkMyungjo_Bold.ttf | TrueType | 700 Bold | BookkMyungjo-Bd |

현재 src의 한글 749자 모두 양쪽 원본의 cmap에 존재합니다. 필요한 파일이나 굵기에 누락은 없습니다. 두 TTF는 원본 그대로 유지했습니다.

`scripts/build_webfonts.py`로 같은 글리프의 WOFF2를 생성했습니다. cmap·글리프 순서·가로 메트릭·내부 굵기가 원본과 동일함을 확인했습니다. 파일 크기는 Light 980,984바이트, Bold 794,200바이트입니다. WOFF2를 우선, 업로드 TTF를 예비 소스로 제공하며 외부 폰트 CDN이나 기기별 local() 폰트를 사용하지 않습니다.

- @font-face에 Light 300, Bold 700을 선언했습니다.
- 기존 normal/400 선언은 브라우저의 표준 굵기 매칭으로 실제 Light 300을 사용합니다. 700은 실제 Bold 파일을 사용하며 font-synthesis:none으로 가상 굵기를 막습니다.
- 명조 영역의 --font-display와 --font-reading, 기존 Georgia/serif 숫자 표시를 같은 BookkMyungjo로 통일했습니다. 기존 UI 고딕체는 유지합니다.
- 기존 font-size·font-weight·letter-spacing·line-height 선언 목록이 수정 전과 동일함을 프로그램으로 대조했습니다. 새 포스터 카드용 규칙은 별도 범위입니다.
- 원고 글자 크기 조절·아이보리 영역·본문 전문과 모든 낭독자 정보는 유지했습니다.

## 브라우저 검증 및 제한

Chromium의 390px·1440px에서 FontFaceSet의 Light/Bold 로딩을 확인했습니다. CSS 문자열 확인에 그치지 않고 DevTools Protocol의 실제 사용 폰트를 검사하여 한글 이름은 BookkMyungjo-Lt, 낭독 제목은 BookkMyungjo-Bd로 렌더링되고 시스템 폰트로 대체되지 않음을 확인했습니다.

Safari/WebKit 엔진 다운로드는 cdn.playwright.dev 및 playwright.download.prss.microsoft.com에서 403 Domain forbidden으로 차단됐습니다. **Safari 실기 또는 WebKit 실행 검증은 수행하지 못했습니다.** Safari에서도 지원하는 WOFF2+TTF와 표준 @font-face 구성을 적용했지만 Safari 테스트를 통과했다고 주장하지 않습니다.

다운로드 가능한 환경에서 `npx playwright install webkit` 후 `npx playwright test --config=playwright.webkit.config.ts`로 별도 폰트 검사를 실행할 수 있습니다. 현재 기본 npm test는 Chromium 검증입니다.

## 보존 및 배포

원고 JSON 전문, 행사·식순·학생 낭독 정보·다음 항해 데이터, 메인 및 생성 배경 이미지, 업로드 포스터·TTF 원본은 수정하지 않았습니다. 새 저장소나 사이트를 만들지 않으며 기존 main에 푸시합니다. Vercel 자동 배포 완료 상태는 현재 도구로 조회할 수 없습니다.

## 최종 실행 결과

- `npm test`: Chromium 브라우저 테스트 11개 모두 통과. 포스터 5개·10면·독립 전환·양면 확대·원본 링크·모바일 1열/데스크톱 2열, 웹폰트 실제 사용 검사와 기존 원고·메뉴·식순·책 표지 검사를 포함합니다.
- `npm run build`: 정적 빌드 통과.
- `npm run typecheck`: 타입 검사 통과.
- 390px 포스터 및 원고 폰트, 1440px 포스터 캡처를 확인했습니다.
- Safari/WebKit 검사는 브라우저 다운로드 403 차단으로 미실행이며 위 통과 수에 포함하지 않습니다.
