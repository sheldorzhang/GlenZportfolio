import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: resolve(projectDir, '../../assets/home-gradient'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(projectDir, 'src/main.jsx'),
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'home-gradient.js',
        assetFileNames: '[name][extname]'
      }
    }
  }
});
