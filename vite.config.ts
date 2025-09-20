import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      // Temporarily disable ESLint to fix dev server
      // eslint: {
      //   lintCommand: 'eslint src/**/*.ts',
      // },
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
