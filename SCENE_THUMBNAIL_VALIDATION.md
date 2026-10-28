# Scene gallery mobile thumbnails

- Scene gallery only: up to 600px, three equal columns; five supplied works occupy two rows without an empty sixth card. Adding a sixth entry to the existing manifest fills the remaining position.
- Front-face thumbnails and student names; desktop retains two-column cards and independent flips. Source files and pair mapping unchanged. No unavailable class information added.
- Shared responsive image/button avoids duplicate hidden poster images. Synchronous image decoding fixes blank painted thumbnails observed during real Chromium screenshot review.
- Thumbnail opens the existing native dialog on the front; original links, front/back controls, 100–300% zoom, overflow panning, Escape/X/backdrop close and focus return retained. At normal zoom, mobile image height leaves room for controls.
- 13 Chromium tests passed, including 320/390/430px three-column geometry, all five pairs, zoom/panning/focus return and existing site regression checks. Final production 390px touch emulation confirmed open/back/zoom/close; all five painted thumbnails visually reviewed.
- Production build and explicit typecheck passed. Real iOS Safari was not available.
- Captures: `/workspace/shared/downloads/voyage-scene-mobile/gallery-390.png`, `modal-390.png`, `gallery-1440.png`.
