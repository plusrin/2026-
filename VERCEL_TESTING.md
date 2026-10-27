# Vercel 테스트 배포 안내

이 V1은 원고 전문·메인 그림·부크크 폰트·학생 작품이 없는 기능 검토용입니다. 배포는 사용자의 Vercel 계정에서 진행합니다. 현재 프로젝트에는 로그인 기능이 없으므로 비공개 검토가 필요하면 Vercel의 Deployment Protection을 사용해야 합니다.

## 권장: 먼저 보호된 Preview를 생성하기

GitHub Import는 main의 첫 Production 배포를 자동 생성할 수 있습니다. 공개를 피해야 한다면 먼저 아래 CLI 방식으로 Preview를 만들고 보호 상태를 확인하세요.

본인 컴퓨터에서 Node.js 24를 설치한 다음:

```sh
git clone https://github.com/plusrin/2026-.git
cd 2026-
git switch main
npm ci
npx vercel login
npx vercel
```

- 로그인은 본인 브라우저에서 진행합니다. 토큰을 채팅에 보내지 마세요.
- 본인의 Vercel 계정/팀을 선택하고 새 프로젝트를 생성합니다.
- 프로젝트명은 예를 들어 `farthest-voyage-test`처럼 영문으로 지정합니다.
- 소스 디렉터리는 `./`, 프레임워크는 Next.js입니다.
- `--prod`는 붙이지 않습니다. 출력된 배포와 대시보드의 환경이 **Preview**인지 확인합니다.
- 설치 명령은 `npm ci`, 빌드 명령은 `npm run build`, Node.js 버전은 24.x입니다. Next.js 프리셋의 출력 경로 기본값을 사용합니다. 이 프로젝트는 `output: 'export'`로 정적 빌드합니다.
- DB·API 키·환경변수는 필요 없습니다. `npm run dev`나 `npm start`는 Vercel의 빌드 명령이 아닙니다.

Vercel 프로젝트의 **Settings → Deployment Protection → Vercel Authentication**에서 Preview 보호를 켜고 저장합니다. 보호 범위와 사용할 수 있는 옵션은 계정/요금제에 따라 다릅니다. 이후 생성된 실제 HTTPS 주소를 시크릿 창이나 로그아웃한 다른 기기에서 열어, 콘텐츠 대신 인증 화면이 표시되는지 확인하세요. 보호를 확인한 URL만 검토자에게 전달합니다. 타인에게 계정 비밀번호를 공유하지 말고 팀 접근 권한이나 지원되는 배포 공유 기능을 사용합니다.

## GitHub 연동 및 자동 배포

Preview 확인 후 프로젝트 **Settings → Git**에서 GitHub 저장소 `plusrin/2026-`를 연결합니다. GitHub 앱의 저장소 접근 권한 요청을 확인합니다. Private 저장소라면 해당 저장소에 대한 접근을 허용해야 합니다.

- main은 보통 Production Branch로 사용됩니다. main 푸시가 Production 배포를 만들 수 있습니다.
- 이후 기능 검토는 별도 브랜치와 PR을 사용하면 Preview 배포로 확인할 수 있습니다.
- Production도 비공개여야 한다면 **Production 및 프로젝트 대표 도메인을 포함하는 보호 범위**가 필요합니다. `All Deployments` 옵션이 제공되는지 확인하세요. 지원되지 않는 요금제에서는 Preview 보호만으로 Production이 비공개라고 판단하면 안 됩니다.
- 프로젝트의 실제 대표 도메인과 개별 Preview URL을 각각 로그아웃 상태로 확인합니다.
- 보호 범위가 원하는 조건을 충족하지 않으면 Production을 배포하지 말고 보호된 Preview만 사용하거나, 해당 보호 기능을 지원하는 플랜을 확인합니다.

## 공개 테스트로 충분할 때: 웹 화면으로 Import

미완성 버전의 일시적 공개가 괜찮다면 Vercel에서 **Add New → Project → Import Git Repository**를 선택하고 `plusrin/2026-`를 Import합니다. 프레임워크 Next.js, Root Directory 프로젝트 루트, Node.js 24.x, Install Command `npm ci`, Build Command `npm run build`, 출력 경로 기본값으로 Deploy합니다. 성공 후 표시되는 실제 HTTPS URL을 사용합니다.

이 경로는 초기 Production이 바로 공개될 수 있습니다. 학생 이름이 포함된 소스의 GitHub 공개 여부와 웹사이트 공개 여부는 별개입니다. 초대된 사람만 보게 하려면 공개 Import 방식 대신 앞의 보호된 Preview 절차를 사용하세요.

## 모바일 확인

배포 URL을 휴대폰 브라우저에서 열고 다음을 확인합니다.

1. 상단 메뉴의 홈·식순·원고·이전 항해·다음 항해 이동.
2. 식순의 세이렌의 노래 펼치기 및 English/한국어 해석 버튼.
3. 원고의 목차, 1~15 이전/다음 이동, 글자 크기 조절과 새로고침 후 위치 유지.
4. 이전 항해 심리테스트 링크의 새 탭 열기. 실제 포스터는 미제공이므로 전시는 비어 있습니다.
5. 다음 항해의 현재 35명과 예상 50명 구분 및 일정 미정 안내.

원고·그림·포스터가 없다는 안내는 정상입니다. 실제 자료를 받은 뒤에만 전문과 작품의 정확성을 검증할 수 있습니다. QR코드는 검토를 마친 최종 공개 URL로 나중에 만드세요.

## 검색 노출과 접근 제한

`src/app/layout.tsx`에 `robots: { index: false, follow: false }`가 적용되어 있습니다. 이는 검색 엔진에 보내는 요청이며 접근 인증이나 비공개 보장은 아닙니다. 링크를 아는 사람의 접근을 차단하려면 Deployment Protection이 필요합니다.

설정 명칭·보호 범위·요금제별 지원은 Vercel 화면과 공식 안내에서 최종 확인하세요.

- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/deployment-protection
- https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication
