'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
export const links = [{href:'/',label:'홈'},{href:'/schedule',label:'식순'},{href:'/readings',label:'원고'},{href:'/archive',label:'이전 항해'},{href:'/next',label:'다음 항해'}];
export function Header(){ const path=usePathname(); const [open,setOpen]=useState(false);
 return <header className="site-header"><div className="header-inner"><Link href="/" className="brand" onClick={()=>setOpen(false)}><span aria-hidden="true" className="brand-symbol">◈</span> 가장 먼 항해</Link><span className="header-caption">문학으로 잇는 우리들의 항해</span><button className="menu-toggle" aria-label={open?'메뉴 닫기':'메뉴 열기'} aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}>{open?'닫기 ✕':'메뉴 ☰'}</button><nav id="navigation" className={open?'navigation open':'navigation'} aria-label="주 메뉴">{links.map(l=><Link key={l.href} href={l.href} aria-current={path===l.href?'page':undefined} onClick={()=>setOpen(false)}>{l.label}</Link>)}</nav></div></header>;
}
