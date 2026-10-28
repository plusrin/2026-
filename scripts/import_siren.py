"""Import or verify the supplied congratulatory HWPX without changing its text."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from zipfile import ZipFile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
ns = {'hp': 'http://www.hancom.co.kr/hwpml/2011/paragraph'}
with ZipFile(args.source) as archive:
    sections = [name for name in archive.namelist() if re.fullmatch(r'Contents/section\d+\.xml', name)]
    if sections != ['Contents/section0.xml']:
        raise SystemExit('Unexpected section structure; review source before import.')
    paragraphs = []
    for paragraph in ET.fromstring(archive.read(sections[0])).findall('.//hp:p', ns):
        fragments = []
        for element in paragraph.iter():
            tag = element.tag.rsplit('}', 1)[-1]
            if tag == 't':
                fragments.append(element.text or '')
            elif tag == 'lineBreak':
                fragments.append('\n')
            elif tag == 'tab':
                fragments.append('\t')
        paragraphs.append(''.join(fragments))
    preview = archive.read('Preview/PrvText.txt').decode('utf-8-sig')
    if [p for p in preview.splitlines() if p.strip()] != [p for p in paragraphs if p.strip()]:
        raise SystemExit('HWPX body/preview differ; review source before import.')
if len(paragraphs) != 8 or paragraphs[:2] != ['축하 낭독', ''] or paragraphs[6:] != ['', '']:
    raise SystemExit('Unexpected paragraph structure; review language boundaries.')
content = {'english': paragraphs[2:5], 'korean': paragraphs[5:6]}
if any(re.search('[가-힣]', p) for p in content['english']) or any(re.search('[A-Za-z]', p) for p in content['korean']):
    raise SystemExit('Unexpected mixed-language text; review source.')
target = Path(__file__).resolve().parents[1] / 'src/data/siren.json'
if args.check:
    if json.loads(target.read_text()) != content:
        raise SystemExit('Stored paragraphs differ from HWPX source.')
else:
    target.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n')
print('Verified original paragraphs:', {key: {'paragraphs': len(value), 'characters': sum(map(len, value))} for key, value in content.items()})
print('Source SHA256:', hashlib.sha256(args.source.read_bytes()).hexdigest())
