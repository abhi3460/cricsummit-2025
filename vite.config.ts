import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint src/**/*.ts',
        useFlatConfig: true, // Enable ESLint v9 flat config support
      },
    }),
  ],
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: '/src/browser-app.ts',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  publicDir: 'public',
});
