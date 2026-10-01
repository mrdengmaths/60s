import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Set BASE_PATH (e.g. /60s/) when the site is served from a sub-path such as GitHub project pages.
  base: process.env.BASE_PATH || '/',
  server: {port: 3000, host: '0.0.0.0'},
  plugins: [react()]
});
