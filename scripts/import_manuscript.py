#!/usr/bin/env python3
"""Import/check HWPv5 text without logging the manuscript.

Requires olefile (install outside the repo). Usage:
  python scripts/import_manuscript.py ORIGINAL.hwp [--check]
Only textual paragraph endings become block boundaries; source whitespace is retained.
"""
import argparse
import hashlib
import json
import re
import struct
import zlib
from pathlib import Path

import olefile

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'src/data/manuscript.json'
EXPECTED = ['김지후', '이시윤', '박예나', '안지민', '김은진', '김나현', '김민정', '이가영', '손지민', '정서영', '김보현', '황서현', '김예린', '손한나', '김지후']
BOUNDARY = re.compile(r'^\s*(\d{1,2})\.\s*\[([^\]]+)\](.*)$')
DATE = re.compile(r'(?:\d{4}년\s*)?\d{1,2}월\s*\d{1,2}일')


def extract(path):
    paragraphs = []
    with olefile.OleFileIO(path) as document:
        header = document.openstream('FileHeader').read()
        assert header.startswith(b'HWP Document File'), 'Not an HWPv5 document'
        flags = struct.unpack_from('<I', header, 36)[0]
        assert not flags & 2, 'Encrypted HWP is unsupported'
        sections = sorted((s for s in document.listdir() if len(s) == 2 and s[0] == 'BodyText' and re.fullmatch(r'Section\d+', s[1])), key=lambda s: int(s[1][7:]))
        assert sections, 'Missing BodyText sections'
        for section in sections:
            raw = document.openstream(section).read()
            if flags & 1:
                raw = zlib.decompress(raw, -15)
            offset = 0
            while offset < len(raw):
                assert offset + 4 <= len(raw), 'Truncated HWP record header'
                record = struct.unpack_from('<I', raw, offset)[0]
                offset += 4
                tag, size = record & 1023, record >> 20
                if size == 4095:
                    size = struct.unpack_from('<I', raw, offset)[0]
                    offset += 4
                payload = raw[offset:offset + size]
                offset += size
                assert len(payload) == size, 'Truncated HWP record body'
                if tag != 67:
                    continue
                assert len(payload) % 2 == 0, 'Invalid UTF-16 record'
                codes = struct.unpack('<' + 'H' * (len(payload) // 2), payload)
                text, i = [], 0
                while i < len(codes):
                    code = codes[i]
                    if code in range(1, 10) or code in (11, 12) or code in range(14, 24):
                        assert i + 8 <= len(codes), 'Truncated inline control'
                        if code == 9:
                            text.append(9)
                        i += 8  # HWP formatting/control records contain no manuscript text.
                        continue
                    if code == 13:
                        assert i == len(codes) - 1, 'Unexpected nonterminal paragraph end'
                    else:
                        assert code >= 32 or code == 10, 'Unsupported text control; inspect before importing'
                        text.append(code)
                    i += 1
                paragraphs.append(struct.pack('<' + 'H' * len(text), *text).decode('utf-16le'))
    return paragraphs


def convert(paragraphs):
    readings = []
    for paragraph in paragraphs:
        match = BOUNDARY.fullmatch(paragraph)
        if match:
            number = int(match[1])
            assert number == len(readings) + 1 and number <= 15, 'Unexpected reading boundary'
            assert match[2] == EXPECTED[number - 1], 'Unexpected reader name'
            readings.append({'id': number, 'reader': match[2], 'sourceHeading': paragraph, 'date': match[3].strip() or None, 'blocks': []})
            continue
        assert readings, 'Text outside a reading'
        heading = paragraph.strip() in ('[빌헬름의 답장]', '[사회자]')
        ranges = [{'start': m.start(), 'end': m.end()} for m in DATE.finditer(paragraph)] if not heading else []
        block = {'type': 'heading' if heading else 'paragraph', 'text': paragraph}
        if ranges:
            block['dateEmphasis'] = ranges
        readings[-1]['blocks'].append(block)
    assert len(readings) == 15 and all(r['blocks'] for r in readings), 'Incomplete readings'
    assert [r['id'] for r in readings if any(b['text'].strip() == '[사회자]' for b in r['blocks'])] == [15], 'Narrator must remain in reading 15'
    reconstructed = [p for r in readings for p in [r['sourceHeading'], *(b['text'] for b in r['blocks'])]]
    assert reconstructed == paragraphs, 'Paragraph/text loss during conversion'
    return readings


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('original', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    paragraphs = extract(args.original)
    readings = convert(paragraphs)
    result = {'source': {'fileName': args.original.name, 'sha256': hashlib.sha256(args.original.read_bytes()).hexdigest(), 'paragraphs': len(paragraphs)}, 'readings': readings}
    if args.check:
        assert json.loads(TARGET.read_text()) == result, 'Stored manuscript differs from original HWP extraction'
    else:
        TARGET.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(('Verified' if args.check else 'Imported') + ': 15 readings; every source paragraph preserved; narrator in reading 15.')
    for reading in readings:
        blocks = reading['blocks']
        digest = hashlib.sha256(json.dumps([reading['sourceHeading'], *(b['text'] for b in blocks)], ensure_ascii=False).encode()).hexdigest()
        print(f"Reading {reading['id']:02d}: {reading['reader']}; {len(blocks)} blocks; SHA-256 {digest}")


if __name__ == '__main__':
    main()
