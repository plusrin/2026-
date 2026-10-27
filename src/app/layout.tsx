import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
export const metadata: Metadata = { title: { default: '가장 먼 항해 — 나로부터 너에게', template: '%s | 가장 먼 항해' }, description: '2026년 11월 3일 창원문성고등학교 낭독회 전자 팸플릿', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="ko" data-scroll-behavior="smooth"><body><a href="#main" className="skip-link">본문으로 건너뛰기</a><Header />{children}<footer className="site-footer"><span className="footer-mark">가장 먼 항해</span><span>2026 창원문성고등학교 낭독회</span><span>나로부터 너에게</span></footer></body></html>;
}
