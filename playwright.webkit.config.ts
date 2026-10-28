import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// Run separately after `npx playwright install webkit` in an environment that can download it.
export default defineConfig({
 ...base,
 testMatch: 'fonts.spec.ts',
 use: { ...base.use, browserName: 'webkit', launchOptions: {}, viewport: {width:390,height:844}, isMobile: true, hasTouch: true },
});
