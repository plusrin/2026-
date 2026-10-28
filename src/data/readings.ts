import manuscript from './manuscript.json';
import { readingDetails } from './readingDetails';

export type ReadingBlock = {
  type: 'paragraph' | 'date' | 'heading';
  text: string;
  dateEmphasis?: { start: number; end: number }[];
};
export type Reading = {
  id: number;
  title: string;
  reader: string;
  className: string;
  summary: string;
  date: string | null;
  blocks: ReadingBlock[] | null;
};
const ordinals = ['첫 번째', '두 번째', '세 번째', '네 번째', '다섯 번째', '여섯 번째', '일곱 번째', '여덟 번째', '아홉 번째', '열 번째', '열한 번째', '열두 번째', '열세 번째', '열네 번째', '열다섯 번째'];

// Text and paragraph order come directly from the verified HWP import.
export const readings: Reading[] = manuscript.readings.map((reading, index) => ({
  id: reading.id,
  title: `${ordinals[index]} 낭독`,
  reader: reading.reader,
  className: readingDetails[index].className,
  summary: readingDetails[index].summary,
  date: reading.date,
  blocks: reading.blocks.map(block => ({
    ...block,
    type: block.type === 'heading' ? 'heading' : 'paragraph',
  })),
}));
