'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { event } from '@/data/event';
import { design } from '@/data/design';
export const links = [{href:'/',label:'홈'},{href:'/schedule',label:'식순'},{href:'/readings',label:'원고'},{href:'/archive',label:'이전 항해'},{href:'/next',label:'다음 항해'}];
export function Header(){ const path=usePathname();
 return <header className="voyage-header">
  <div className="voyage-masthead">
   <Link href="/" className="voyage-wordmark" aria-label="THE VOYAGE 홈">THE VOYAGE</Link>
   <div className={`voyage-sea ${design.homeImage?'has-image':''}`}>
    {design.homeImage ? <img src={design.homeImage} alt="가장 먼 항해 낭독회 메인 그림"/> : <div className="art-placeholder" role="img" aria-label="달빛이 비치는 밤바다, 메인 그림 제공 전 임시 표현"><span className="moon" aria-hidden="true"/><div className="sea-lines" aria-hidden="true"/></div>}
   </div>
   <div className="voyage-title">{path==='/'?<h1>{event.title}</h1>:<Link href="/">{event.title}</Link>}</div>
   <p className="voyage-subtitle">{event.subtitle}</p>
   <p className="voyage-description">괴테 『{event.book}』 낭독회</p>
  </div>
  <nav className="voyage-tabs" aria-label="주 메뉴">{links.map(l=><Link key={l.href} href={l.href} aria-current={path===l.href?'page':undefined}>{l.label}</Link>)}</nav>
 </header>;
}
