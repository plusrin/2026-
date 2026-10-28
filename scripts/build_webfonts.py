#!/usr/bin/env python3
"""Losslessly package uploaded Bookk Myungjo outlines as WOFF2 (TTFs stay untouched).
Requires fonttools and brotli. Not required to run the website.
"""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1] / 'public/fonts'
for style, weight in [('Light', 300), ('Bold', 700)]:
    source = root / f'BookkMyungjo_{style}.ttf'
    target = source.with_suffix('.woff2')
    font = TTFont(source, recalcTimestamp=False)
    assert font['OS/2'].usWeightClass == weight
    cmap, metrics, glyph_order = font.getBestCmap(), dict(font['hmtx'].metrics), font.getGlyphOrder()
    font.flavor = 'woff2'
    font.save(target)
    packaged = TTFont(target)
    assert packaged.getBestCmap() == cmap
    assert packaged['hmtx'].metrics == metrics
    assert packaged.getGlyphOrder() == glyph_order
    assert packaged['OS/2'].usWeightClass == weight
    print(f'{source.name} → {target.name}: {weight}, cmap/metrics/glyph order unchanged, {target.stat().st_size:,} bytes')
