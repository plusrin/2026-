'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { schedule, siren } from '@/data/schedule';
import { FontIcon } from './FontIcon';

export function Schedule() {
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState<'english' | 'korean'>('english');
  const [size, setSize] = useState(18);
  return (
    <div className="schedule-list">
      {schedule.map((item, index) => (
        <Fragment key={item.title}>
        {(index === 3 || index === 4) && <div className="schedule-part schedule-number" role="separator" aria-label={`${index - 2}부`}><span>{index - 2}부</span></div>}
        <section className={`schedule-item${index === 2 || index === 3 ? ' before-part' : ''}`}>
          <span className="schedule-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="schedule-content">
            <h2>{item.title}</h2>
            {item.song && (
              <div className="song-heading">
                <span className="song-title">{item.song}</span>
                <button className="schedule-action" aria-expanded={expanded} aria-controls="siren-text" onClick={() => setExpanded(!expanded)}>
                  {expanded ? '원문 닫기' : '원문 보기'}
                </button>
              </div>
            )}
            {item.detail && <p>{item.detail}</p>}
            {item.song && expanded && (
              <div className="song-panel" id="siren-text">
                <div className="song-toolbar">
                <div className="segmented" aria-label="세이렌의 노래 언어">
                  {(['english', 'korean'] as const).map(language => (
                    <button key={language} aria-pressed={lang === language} onClick={() => setLang(language)}>{language === 'english' ? 'English' : '한국어 해석'}</button>
                  ))}
                </div>
                <div className="font-controls" role="group" aria-label="축하낭독 글자 크기">
                  <button aria-label="축하낭독 글자 작게" disabled={size <= 16} onClick={() => setSize(value => Math.max(16, value - 2))}>A<FontIcon kind="minus" /></button>
                  <button aria-label="축하낭독 글자 크게" disabled={size >= 26} onClick={() => setSize(value => Math.min(26, value + 2))}>A+</button>
                </div>
                </div>
                <p className="preserve siren-body" style={{ fontSize: size }} lang={lang === 'english' ? 'en' : 'ko'}>{siren[lang]}</p>
              </div>
            )}
            {index === 3 && <Link href="/readings" className="schedule-action reading-action">낭독 원고 보기</Link>}
          </div>
        </section>
        </Fragment>
      ))}
    </div>
  );
}
