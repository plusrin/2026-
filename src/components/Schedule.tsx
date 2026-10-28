'use client';

import { useState } from 'react';
import Link from 'next/link';
import { schedule, siren } from '@/data/schedule';

export function Schedule() {
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState<'english' | 'korean'>('english');
  return (
    <div className="schedule-list">
      {schedule.map((item, index) => (
        <section className="schedule-item" key={item.title}>
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
                <div className="segmented" aria-label="세이렌의 노래 언어">
                  {(['english', 'korean'] as const).map(language => (
                    <button key={language} aria-pressed={lang === language} onClick={() => setLang(language)}>{language === 'english' ? 'English' : '한국어 해석'}</button>
                  ))}
                </div>
                <p className="preserve" lang={lang === 'english' ? 'en' : 'ko'}>{siren[lang]}</p>
              </div>
            )}
            {index === 3 && <Link href="/readings" className="schedule-action reading-action">낭독 원고 보기</Link>}
          </div>
        </section>
      ))}
    </div>
  );
}
