import type { NextConfig } from 'next';
const config: NextConfig = { allowedDevOrigins: ['127.0.0.1'], output: 'export', images: { unoptimized: true } };
export default config;
