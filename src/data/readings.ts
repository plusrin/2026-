export type ReadingBlock = { type: 'paragraph' | 'date' | 'heading'; text: string };
export type Reading = { id: number; title: string; reader: string; className: string | null; date: string | null; blocks: ReadingBlock[] | null };
const ordinals = ['첫 번째','두 번째','세 번째','네 번째','다섯 번째','여섯 번째','일곱 번째','여덟 번째','아홉 번째','열 번째','열한 번째','열두 번째','열세 번째','열네 번째','열다섯 번째'];
const people = ['김지후','이시윤','박예나','안지민','김은진','김나현','김민정','이가영','손지민','정서영','김보현','황서현','김예린','손한나','김지후'];
const dates = [null,'1771년 6월 16일','1771년 6월 16일 (이어서)','1771년 7월 30일','1771년 8월 12일','1771년 8월 18일','1771년 8월 28일','1771년 12월 24일','1772년 3월 15일','1772년 5월 5일','1772년 10월 12일','1772년 12월 6일~12일 (추정)','1772년 12월 20일','1772년 12월 21일',null];
// 원본 대조 전에는 blocks를 채우지 않습니다. 15번째의 사회자 낭독도 같은 blocks에 포함합니다.
export const readings: Reading[] = people.map((reader, i) => ({ id: i + 1, title: `${ordinals[i]} 낭독`, reader, className: null, date: dates[i], blocks: null }));
