'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { event } from '@/data/event';
import { design } from '@/data/design';

export const links = [
  { href: '/', label: '홈' },
  { href: '/schedule', label: '식순' },
  { href: '/readings', label: '원고' },
  { href: '/archive', label: '이전 항해' },
  { href: '/next', label: '다음 항해' },
];

export function Header() {
  const path = usePathname();
  const title = event.title;
  return (
    <header className="voyage-header">
      <div className="voyage-hero">
        <div className="voyage-hero-copy">
          <p className="voyage-event-heading">{event.heading}</p>
          <div className="voyage-title">
            {path === '/' ? <h1>{title}</h1> : <Link href="/" aria-label="가장 먼 항해 홈">{title}</Link>}
          </div>
          <p className="voyage-subtitle">{event.subtitle}</p>
        </div>
        <div className="voyage-hero-art">
          <div className="voyage-sea">
            {design.homeImage && <img
              src={design.homeImage}
              alt="달빛 아래 돛단배와 배 위의 인물이 있는 밤바다"
              width={1374}
              height={1145}
              fetchPriority="high"
            />}
          </div>
        </div>
      </div>
      <nav className="voyage-tabs" aria-label="주 메뉴">
        {links.map(link => <Link key={link.href} href={link.href} aria-current={path === link.href ? 'page' : undefined}>{link.label}</Link>)}
      </nav>
    </header>
  );
}
