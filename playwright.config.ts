import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({ testDir: './tests', fullyParallel: false, use: { baseURL: 'http://127.0.0.1:3000', viewport: {width:390,height:844}, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined) } }, webServer: {command:'npm run dev',url:'http://127.0.0.1:3000',reuseExistingServer:false,timeout:120000}, reporter:'list' });
