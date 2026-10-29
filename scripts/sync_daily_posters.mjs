// Regenerate filename-based daily credits without OCR or a separate student list.
import { readdir, readFile, writeFile } from 'node:fs/promises';
const folder = new URL('../public/images/archive/daily/', import.meta.url);
const target = new URL('../src/data/dailyPosters.json', import.meta.url);
const files = (await readdir(folder)).filter(name => /\.(png|jpe?g|webp)$/i.test(name)).sort();
const invalid = files.filter(name => !/^\d+학년 \d+반 .+\.[^.]+$/.test(name));
if (invalid.length) throw new Error(`학반·이름 확인 필요: ${invalid.join(', ')}`);
const data = files.map((filename, index) => ({
  id: `daily-${String(index + 1).padStart(2, '0')}`,
  student: filename.replace(/\.[^.]+$/, ''),
  front: `/images/archive/daily/${filename}`,
}));
const serialized = JSON.stringify(data, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== serialized) throw new Error('Daily manifest differs from uploaded filenames. Run node scripts/sync_daily_posters.mjs.');
} else await writeFile(target, serialized);
console.log(`Daily gallery: ${files.length} single-face works; all filename credits verified.`);
