import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('zxing') || id.includes('html5-qrcode') || id.includes('jsbarcode') || id.includes('qrcode')) {
              return 'vendor-scanners';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
})

