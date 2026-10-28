'use client';

import { useState } from 'react';
import { type Poster } from '@/data/archive';
import { Modal } from './Modal';

type Side = 'front' | 'back';
const sideLabel = (side: Side) => side === 'front' ? '앞면' : '뒷면';
const credit = (poster: Poster) => [poster.className, poster.student].filter(Boolean).join(' ');

export function Gallery({ items, label, interactiveCards = false }: { items: Poster[]; label: string; interactiveCards?: boolean }) {
  const [selected, setSelected] = useState<Poster | null>(null);
  const [side, setSide] = useState<Side>('front');
  const [zoom, setZoom] = useState(1);
  const [cardSides, setCardSides] = useState<Record<string, Side>>({});

  function open(poster: Poster, currentSide: Side = 'front') {
    setSelected(poster);
    setSide(currentSide);
    setZoom(1);
  }
  function flipCard(id: string) {
    setCardSides(previous => ({ ...previous, [id]: previous[id] === 'back' ? 'front' : 'back' }));
  }
  function changeSide(next: Side) {
    setSide(next);
    setZoom(1);
    if (interactiveCards && selected) setCardSides(previous => ({ ...previous, [selected.id]: next }));
  }

  return <>
    <div className={`gallery-grid${interactiveCards ? ' scene-gallery' : ''}`}>
      {items.map(poster => {
        const currentSide = cardSides[poster.id] ?? 'front';
        if (!interactiveCards) return (
          <button key={poster.id} className="poster-card" onClick={() => open(poster)}>
            <span className="poster-owner">{credit(poster)}</span>
            <img src={poster.front} alt={poster.title ?? `${poster.student} 학생 포스터 앞면`} />
            <span>{poster.title ?? '포스터 보기'} ↗</span>
          </button>
        );
        return (
          <article key={poster.id} className="poster-card interactive-poster" data-poster-id={poster.id}>
            <header className="poster-card-heading">
              <h3>{poster.title}</h3>
              <p className="poster-owner">{poster.student}</p>
            </header>
            <button className="poster-flip" aria-label={`${poster.title} ${poster.student} ${sideLabel(currentSide)}, 눌러서 뒤집기`} aria-pressed={currentSide === 'back'} onClick={() => flipCard(poster.id)}>
              <img key={currentSide} src={poster[currentSide]} alt={`${poster.title} ${poster.student} ${sideLabel(currentSide)}`} loading="lazy" decoding="async" />
            </button>
            <div className="poster-card-controls">
              <button className="button subtle" onClick={() => flipCard(poster.id)}>{currentSide === 'front' ? '뒷면 보기' : '앞면 보기'}</button>
              <button className="button subtle" aria-label={`${poster.title} ${poster.student} ${sideLabel(currentSide)} 확대 보기`} onClick={() => open(poster, currentSide)}>확대 보기</button>
            </div>
          </article>
        );
      })}
    </div>
    {items.length === 0 && <div className="empty-gallery"><span aria-hidden="true">▧</span><h3>작품이 도착할 자리</h3><p>학생 작품은 아직 제공되지 않았습니다.<br />앞면과 뒷면 이미지를 받은 후 전시합니다.</p></div>}
    {selected && <Modal wide title={selected.title ?? `${credit(selected)}의 포스터`} onClose={() => setSelected(null)}>
      <p className="poster-credit">{credit(selected)} · {label}</p>
      <div className="poster-controls">
        <div className="segmented">{(['front', 'back'] as const).map(value => <button key={value} aria-pressed={side === value} onClick={() => changeSide(value)}>{sideLabel(value)}</button>)}</div>
        <div className="zoom-controls">
          <button aria-label="포스터 축소" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))}>−</button>
          <span aria-live="polite">{zoom * 100}%</span>
          <button aria-label="포스터 확대" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .5))}>+</button>
        </div>
        <a href={selected[side]} target="_blank" rel="noopener noreferrer" className="text-link">원본 보기 ↗</a>
      </div>
      <p className="quiet-note">이미지를 누르면 앞면과 뒷면이 전환됩니다. 확대 후 좌우로 스크롤할 수 있습니다.</p>
      <div className="poster-viewport">
        <button aria-label={`${sideLabel(side)} 이미지, 눌러서 뒤집기`} style={{ width: `${zoom * 100}%` }} onClick={() => changeSide(side === 'front' ? 'back' : 'front')}>
          <img src={selected[side]} alt={`${selected.title ?? selected.student + ' 포스터'} ${sideLabel(side)}`} />
        </button>
      </div>
      {selected.description && <p>{selected.description}</p>}
    </Modal>}
  </>;
}
