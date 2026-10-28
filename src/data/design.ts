// Art assets are separate from event/manuscript content and can be replaced independently.
export const design: {
 homeImage: string | null;
 bookCover: string | null;
 skyExtension: string;
 seaExtension: string;
 backgrounds: Record<string, string | null>;
} = {
 homeImage: '/images/home/main-voyage.jpg',
 bookCover: null, // Exact uploaded cover file/URL is still needed; never substitute another edition.
 skyExtension: '/images/backgrounds/voyage-sky-extension.webp',
 seaExtension: '/images/backgrounds/voyage-ocean-extension.webp',
 backgrounds: { home: null, schedule: null, readings: null, archive: null, next: null },
};
