'use client';

import { FontIcon } from './FontIcon';
import { Fragment, useEffect, useState } from 'react';
import { readings, type ReadingBlock } from '@/data/readings';
import { Modal } from './Modal';

function SourceText({ text }: { text: string }) {
  // U+2015 is absent from both uploaded faces. Keep the original character in
  // the DOM (and copied text), drawing its bar without another font.
  return text.split('―').map((part, index) => <Fragment key={index}>
    {index > 0 && <span className="source-horizontal-bar"><span className="source-bar-text">―</span></span>}{part}
  </Fragment>);
}

function BlockText({ block }: { block: ReadingBlock }) {
  let position = 0;
  const pieces = (block.dateEmphasis ?? []).map((range, index) => {
    const before = block.text.slice(position, range.start);
    position = range.end;
    return <Fragment key={index}><SourceText text={before} /><strong className="inline-letter-date"><SourceText text={block.text.slice(range.start, range.end)} /></strong></Fragment>;
  });
  return <>{pieces}<SourceText text={block.text.slice(position)} /></>;
}

export function Reader() {
  const [index, setIndex] = useState(0);
  const [toc, setToc] = useState(false);
  const [size, setSize] = useState(18);
  const reading = readings[index];

  useEffect(() => {
    const sync = () => {
      const id = Number(new URLSearchParams(location.search).get('reading'));
      setIndex(Number.isInteger(id) && id >= 1 && id <= readings.length ? id - 1 : 0);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  function go(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= readings.length) return;
    setIndex(nextIndex);
    setToc(false);
    const url = new URL(location.href);
    url.searchParams.set('reading', String(nextIndex + 1));
    history.pushState(null, '', url);
    document.getElementById('reading-heading')?.focus();
    document.getElementById('reader-top')?.scrollIntoView({ block: 'start' });
  }

  return (
    <div className="reader" id="reader-top">
      <div className="reader-toolbar">
        <button className="button subtle" onClick={() => setToc(true)}><FontIcon kind="contents" /> 전체 목차</button>
        <span className="reader-count" aria-live="polite">{index + 1} / {readings.length}</span>
        <div className="font-controls" aria-label="원고 글자 크기">
          <button aria-label="글자 작게" disabled={size <= 16} onClick={() => setSize(s => s - 2)}>가<FontIcon kind="minus" /></button>
          <button aria-label="글자 크게" disabled={size >= 26} onClick={() => setSize(s => s + 2)}>가+</button>
        </div>
      </div>
      <article className="reading-paper" style={{ fontSize: size }}>
        <header>
          <p className="paper-eyebrow">젊은 베르테르의 슬픔</p>
          <h2 id="reading-heading" tabIndex={-1}>{reading.title}</h2>
          <p className="reader-name">{reading.className} {reading.reader}</p>
        </header>
        {reading.date && <h3 className="letter-date">{reading.date}</h3>}
        {reading.blocks ? (
          <div className="reading-body">
            {reading.id === 15 && <h3 className="speaker-heading">김지후 낭독</h3>}
            {reading.blocks.map((block, blockIndex) => block.type === 'paragraph' ? (
              <p key={blockIndex} data-source-block={blockIndex} className={block.text.length === 0 ? 'empty-source-paragraph' : undefined}><BlockText block={block} /></p>
            ) : (
              <h3 key={blockIndex} data-source-block={blockIndex} className={block.text.trim() === '[사회자]' ? 'speaker-heading narrator-heading' : undefined}>{block.text}</h3>
            ))}
          </div>
        ) : (
          <div className="missing-manuscript">
            <h3>원고를 기다리고 있습니다</h3>
            <p>원본과 대조한 텍스트를 받은 뒤 이곳에 반영합니다.</p>
            <span className="status-pill">원고 미제공</span>
          </div>
        )}
      </article>
      <div className="reader-navigation">
        <button className="button subtle" disabled={index === 0} onClick={() => go(index - 1)}>← 이전 낭독</button>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <button className="button subtle" disabled={index === readings.length - 1} onClick={() => go(index + 1)}>다음 낭독 →</button>
      </div>
      {toc && (
        <Modal title="낭독 목차" onClose={() => setToc(false)}>
          <ol className="toc-list">{readings.map((entry, entryIndex) => (
            <li key={entry.id}>
              <button aria-current={entryIndex === index ? 'true' : undefined} onClick={() => go(entryIndex)}>
                <span className="toc-number">{String(entry.id).padStart(2, '0')}</span>
                <span className="toc-details">
                  <span className="toc-title-line"><strong>{entry.title}</strong>{entry.date && <span className="toc-date">{entry.date}</span>}</span>
                  <span className="toc-summary">{entry.summary}</span>
                  <span className="toc-student">{entry.className} {entry.reader}</span>
                </span>
                {entryIndex === index && <span className="toc-current" aria-label="현재 낭독">●</span>}
              </button>
            </li>
          ))}</ol>
        </Modal>
      )}
    </div>
  );
}
