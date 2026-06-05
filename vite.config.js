import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['busicon.png'],
      manifest: {
        name: 'শেরপুর বাস সময়সূচী',
        short_name: 'শেরপুর বাস',
        description: 'ঢাকা-শেরপুর বাস সময়সূচী ও যোগাযোগ',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/busicon.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/busicon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
})