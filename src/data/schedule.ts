import sirenParagraphs from './siren.json';

export const schedule = [
  { title: '개회 및 행사 안내', detail: '' },
  { title: '축하낭독', detail: '2학년 3반 원채영', song: '세이렌의 노래' },
  { title: '축사', detail: '' }, { title: '낭독', detail: '15개의 목소리로 만나는 문학' },
  { title: '대담', detail: '' }, { title: '폐회', detail: '' },
];
export const siren = {
  english: sirenParagraphs.english.join('\n\n'),
  korean: sirenParagraphs.korean.join('\n\n'),
};
