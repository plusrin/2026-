import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { design } from '@/data/design';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: '가장 먼 항해 — 나로부터 너에게', template: '%s | 가장 먼 항해' },
  description: '2026년 11월 3일 창원문성고등학교 낭독회 전자 팸플릿',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const landscapeStyle = {
    '--sky-image': `url("${design.skyExtension}")`,
    '--sea-image': `url("${design.seaExtension}")`,
  } as CSSProperties;

  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">본문으로 건너뛰기</a>
        <div className="voyage-landscape" style={landscapeStyle}>
          <div className="landscape-ocean" aria-hidden="true" />
          <Header />
          {children}
          <footer className="site-footer">
            <span className="footer-mark">가장 먼 항해</span>
            <span>2026 창원문성고등학교 낭독회</span>
            <span>나로부터 너에게</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
