# 가장 먼 항해 — 나로부터 너에게

2026년 11월 3일 창원문성고등학교 낭독회 모바일 전자 팸플릿 V1.
Next.js App Router · TypeScript · Tailwind CSS 4. 로그인, DB, API 키 없이 동작하며 `out/`에 정적으로 빌드합니다.

## 실행

Node.js 24 LTS와 npm을 사용합니다. 현재 검증 환경: Node 24.19.0.

```sh
npm ci
npm run dev
```

개발 서버 기본 포트는 3000입니다. 다른 포트는 `npm run dev -- --port 3001`로 지정합니다.

```sh
npm run build
npm start
```

`npm start`는 빌드된 `out/`을 제공하는 정적 서버입니다. 개발 변경은 `npm run dev`에서 확인합니다.

```sh
npm run typecheck
npm test
```

브라우저 테스트는 시스템 `/usr/bin/chromium`이 있으면 사용합니다. 다른 컴퓨터에서는 `npx playwright install chromium`으로 브라우저를 설치하거나 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`에 실행 파일 경로를 지정합니다.

`npm test`는 포스터 기능을 확인하기 위해 **테스트 전용 합성 데이터**를 사용하는 임시 `gallery-test-fixture` 경로를 만들고 테스트 종료 후 삭제합니다. 실제 학생 정보나 작품을 생성하지 않으며 이 경로를 배포하지 않습니다. 테스트 중에는 별도 빌드를 실행하지 마세요. 강제 종료로 폴더가 남으면 내용을 확인 후 `src/app/gallery-test-fixture/`를 삭제하세요.

## 구조

```text
src/app/              홈, 식순, 원고, 이전 항해, 다음 항해 및 전역 스타일
src/components/       헤더, 페이지 틀, 모달, 원고 뷰어, 재사용 포스터 갤러리
src/data/
  event.ts            행사 소개·일시·장소·도서
  schedule.ts         식순·세이렌의 노래 원문/해석
  readings.ts         15개 구간의 낭독자·날짜·본문 블록
  archive.ts          심리테스트·학생 작품 목록
  nextVoyage.ts       다음 프로그램 내용·현재/예상 인원
  design.ts           메인 그림·페이지별 배경 경로
public/images/        home/, backgrounds/, archive/
public/fonts/         제공받을 부크크 폰트
tests/               모바일·데스크톱 브라우저 기능 검증
```

## 제공 자료와 미완성 항목

현재 받은 파일은 제작 지시서 TXT뿐입니다. 미제공 자료를 원본으로 간주하거나 임의로 채우지 않았습니다.

- 메인 그림 `베르테르 사진 원본.png`: 미제공. 현재 CSS 밤바다 그라데이션과 명시적인 안내를 표시합니다.
- `낭독회 원고_261022_1952버전.hwp`: 미제공. 15개 탐색 구간과 낭독자·날짜만 등록되어 있고 **원고 전문은 없습니다**. 원본 또는 TXT/DOCX 변환본을 받아 대조해야 합니다.
- `BookkMyungjo_Light.ttf`, `BookkMyungjo_Bold.ttf`: 미제공. 시스템 명조로 임시 표시합니다.
- 5개 디자인 시안: 미제공. 지시서의 임시 팔레트와 레이아웃 요구사항으로 구현했습니다.
- 세이렌의 노래 영어 원문·한국어 해석: 미제공. 각 언어의 미제공 안내만 표시합니다.
- 학생 포스터 앞·뒷면과 학반·성명: 미제공. 실제 전시는 빈 구조입니다.
- 낭독자 학반·학번: 미제공.
- 다음 행사의 일시·장소: 미정으로 표시합니다.

**행사 사용 전 원고 전문, 그림, 폰트와 작품을 반영하고 원본 대조 및 학교의 공개 기준을 확인해야 합니다.** 현재 상태는 기능을 갖춘 V1이며 콘텐츠 완성본이 아닙니다.

## 원고 등록과 원본 대조

`src/data/readings.ts`의 각 `blocks: null`을 실제 원고 블록 배열로 교체합니다. 문단·문장·대화문을 그대로 보존합니다.

```ts
// 구조 설명용입니다. 실제 내용은 원본에서 그대로 옮깁니다.
blocks: [
  { type: 'date', text: '원본 날짜' },
  { type: 'paragraph', text: '원본 문단' },
  { type: 'heading', text: '[빌헬름의 답장]' },
]
```

본문은 HTML이 아닌 텍스트로 렌더링하며 줄바꿈을 유지합니다. 날짜·내부 소제목 블록은 굵게 표시합니다. 원고 시작 날짜는 `date`에 등록되어 있으므로 중복 표기를 피하세요.

필수 대조 항목:

- 정확히 15개 구간을 유지하고 구간별 전문·문장·문단·대화문을 대조.
- 7번 중간 `10월 20일`, 8번 중간 `1772년 2월 17일`, 10번 중간 `9월 6일`을 실제 위치의 `date` 블록으로 반영.
- `[빌헬름의 답장]`은 해당 원고 위치의 `heading` 블록이며 별도 낭독으로 분리하지 않음.
- 15번은 `김지후 낭독`과 `사회자 낭독`을 내부 제목으로 나누되 같은 `blocks`에 전부 포함. 사회자 원고를 삭제·요약·별도 16번으로 분리하지 않음.
- 12번 날짜의 `(추정)`은 원본 확인 후만 확정.

## 그림·배경·폰트 교체

1. 메인 그림을 `public/images/home/`에 넣고 `src/data/design.ts`의 `homeImage`에 `/images/home/파일명.png`를 등록합니다. 원본 비율과 전체 그림을 유지하도록 `object-fit: contain`을 사용합니다.
2. 페이지별 배경은 `backgrounds.home / schedule / readings / archive / next`에 독립적인 경로를 등록합니다. 배경 등록 여부와 콘텐츠·인터랙션은 분리되어 있습니다. 원고 종이에는 배경 이미지를 넣지 않습니다.
3. 임시 색상은 `src/app/globals.css`의 `:root` 변수에서 변경합니다.
4. 실제 폰트를 `public/fonts/`에 넣은 후 `globals.css`에 아래 선언을 추가합니다. 파일이 없을 때는 추가하지 마세요.

```css
@font-face {
  font-family: 'BookkMyungjo';
  src: url('/fonts/BookkMyungjo_Light.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'BookkMyungjo';
  src: url('/fonts/BookkMyungjo_Bold.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}
```

원고는 `--font-reading`, 나머지 제목은 `--font-display`, UI는 `--font-ui`로 분리되어 있습니다.

## 학생 포스터 등록

파일을 `public/images/archive/`에 넣고 `src/data/archive.ts`의 `posters` 배열에 실제 정보를 등록합니다.

```ts
// 아래는 필드 형식 설명입니다. 실제 학생 데이터로 교체해 등록하세요.
{
  id: '고유-ID',
  category: 'scene', // 'scene': 사건 현장 / 'daily': 일상생활
  className: '실제 학반',
  student: '실제 성명',
  title: '실제 작품 제목', // 선택
  front: '/images/archive/앞면-파일명.png',
  back: '/images/archive/뒷면-파일명.png',
  description: '실제 설명', // 선택
}
```

모바일 2열이며 작품 수에 따라 행이 추가됩니다. 클릭 확대, 이미지 클릭 뒤집기, 앞·뒷면 버튼, 100~300% 확대/축소, 원본 보기, Escape 닫기와 초점 복귀를 지원합니다. 데이터와 파일만 추가하면 됩니다.

## Vercel 배포

1. 소스와 `package-lock.json`을 GitHub 저장소에 커밋·푸시합니다.
2. Vercel에서 해당 저장소를 Import하고 프레임워크는 Next.js, 루트는 이 프로젝트 폴더를 선택합니다.
3. Node.js 24, 설치 `npm ci`, 빌드 `npm run build`를 사용합니다. `output: 'export'`에 따라 정적 파일이 생성됩니다. 별도 서버·환경변수·DB는 필요 없습니다.
4. 배포된 HTTPS 주소에서 5개 메뉴·원고 이동·포스터를 재검증하고, **확정된 배포 URL**로 행사 QR코드를 만듭니다.

현재 배포는 수행하지 않았습니다. 검색 노출은 콘텐츠 미완성 상태를 고려해 `layout.tsx`에서 `robots: noindex`로 설정되어 있습니다. 공개본 확정 후 필요하면 변경하세요.

## 검증 범위

실행 결과는 `VALIDATION.md`에 기록합니다. 브라우저 테스트는 390px 메뉴 이동·가로 넘침, 행사 정보, 15개 원고 구간·경계 버튼·목차·URL 복원·글자 크기, 노래 언어 전환, 외부 링크 속성, 빈 전시, 1440px 레이아웃과 테스트 전용 포스터 앞뒤 전환·확대·원본 링크·Escape·초점 복귀를 검사합니다.

원고 원본 일치·누락 여부, 실제 포스터 화질과 실제 메인 그림의 크롭, 제공 예정 폰트의 모양은 **자료 미제공으로 검증하지 못했습니다**. 외부 사이트의 실제 가용성은 별도 확인이 필요합니다.
