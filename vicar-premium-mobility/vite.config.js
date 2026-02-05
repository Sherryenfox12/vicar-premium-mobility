import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-i18next', 'i18next'],
  },
  assetsInclude: ['**/*.glb'],
  server: {
    host: true, // Allow external connections
    port: 5174,
    hmr: {
      port: 5174,
      host: 'localhost'
    },
    allowedHosts: ['vicar.ngrok.app','*'], // ✅ allow all hosts (works with ngrok, localtunnel, etc.)
    headers: {
      // Add cache headers for video files
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  // Configure asset handling for better caching
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(mp4|webm|ogg)$/.test(assetInfo.name)) {
            return 'videos/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})





