import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import siteFiles from './vite/site-files'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // index.html, sitemap.xml and robots.txt all derive from SITE_URL in
    // src/lib/site.js, and the sitemap lists every published article.
    siteFiles({ docsDir: fileURLToPath(new URL('./docs', import.meta.url)) }),
  ],
  build: {
    // Split heavy, rarely-changing vendor code from app code so browsers
    // can cache it across deploys. Keeps first-load JS smaller.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
