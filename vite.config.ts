/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile({ removeViteModuleLoader: true })],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/.git/**', 'tests/**'],
    coverage: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      reporter: ['text', 'html'],
    }
  }
})
