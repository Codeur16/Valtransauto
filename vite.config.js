import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    server: {
    port: 5173
  },
  base: '/', // nécessaire pour un bon routing sur Vercel
  plugins: [
    react(),

    // --- PWA CONFIGURATION ---
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png'
      ],
      manifest: {
        name: 'Valtransauto',
        short_name: 'Valtransauto',
        description: 'Application web Valtransauto',
        theme_color: '#4CAF50',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'Logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  devOptions: {
  enabled: false
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})







// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   base: '/', // indispensable pour Vercel, sinon assets introuvables
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src')
//     }
//   },
//   build: {
//     sourcemap: false, // allège le build
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           'vendor': ['react', 'react-dom', 'react-router-dom'],
//           'supabase': ['@supabase/supabase-js']
//         }
//       }
//     }
//   }
// })
