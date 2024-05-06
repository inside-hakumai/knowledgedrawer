import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: './',
  root: path.resolve(__dirname, 'src', 'renderer'),
  plugins: [tsconfigPaths(), vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src', 'renderer'),
      '@shared': path.resolve(__dirname, 'src', 'shared'),
    },
  },
})
