import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  root: path.resolve(__dirname, 'src', 'renderer'),
  plugins: [tsconfigPaths(), vue()],
})
