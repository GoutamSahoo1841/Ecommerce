import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:3002'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        { find: '@/components/ui/Card', replacement: path.resolve(__dirname, './src/components/ui/card.jsx') },
        { find: '@/components/ui/Button', replacement: path.resolve(__dirname, './src/components/ui/button.jsx') },
        { find: '@/components/ui/Badge', replacement: path.resolve(__dirname, './src/components/ui/badge.jsx') },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: backendUrl,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})


