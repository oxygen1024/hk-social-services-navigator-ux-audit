import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

const pages = ['index', 'need', 'results', 'services', 'service', 'list', 'compare'];
// 輸出到 ../docs，GitHub Pages 由 main 分支 /docs 發布；保留舊網址
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {input: Object.fromEntries(pages.map(p => [p, resolve(__dirname, `${p}.html`)]))},
  },
});
