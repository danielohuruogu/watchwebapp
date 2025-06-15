import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(
  {
    plugins: [react()],
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.obj', '**/*.3dm'],
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.PORT}`,
          changeOrigin: true
        }
      }
    }
  }
)
