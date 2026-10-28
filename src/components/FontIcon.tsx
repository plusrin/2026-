// Decorative marks missing from the uploaded font use vectors, not system glyphs.
export function FontIcon({ kind }: { kind: 'close' | 'minus' | 'contents' | 'star' }) {
  return <svg className="font-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.4">
    {kind === 'close' && <path d="m5 5 14 14M19 5 5 19" />}
    {kind === 'minus' && <path d="M4 12h16" />}
    {kind === 'contents' && <path d="M3 6h2m3 0h13M3 12h2m3 0h13M3 18h2m3 0h13" />}
    {kind === 'star' && <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />}
  </svg>;
}
