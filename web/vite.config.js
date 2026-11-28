import {defineConfig} from 'vite';
import {buildPreviews} from './scripts/static-previews.mjs';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

const pages = ['index', 'need', 'results', 'services', 'service', 'list', 'compare'];
// 輸出到 ../docs，GitHub Pages 由 main 分支 /docs 發布；保留舊網址
export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'static-service-previews',
    configureServer(server) {
      const previews = new Map();
      buildPreviews(__dirname, (file, html) => previews.set('/' + file, html));
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        if (!previews.has(path)) return next();
        try {
          const xml = path.endsWith('.xml');
          res.setHeader('Content-Type', xml ? 'application/xml' : 'text/html; charset=utf-8');
          res.end(xml ? previews.get(path) : await server.transformIndexHtml(path, previews.get(path)));
        } catch (error) { next(error); }
      });
    },
    writeBundle() { buildPreviews(resolve(__dirname, '../docs')); },
  }],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {input: Object.fromEntries(pages.map(p => [p, resolve(__dirname, `${p}.html`)]))},
  },
});
