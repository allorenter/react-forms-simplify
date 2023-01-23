/// <reference types="vitest" />
/// <reference types="vite/client" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'react-forms-simplify',
      fileName: 'react-forms-simplify',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
