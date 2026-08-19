import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const isSlim = mode === 'slim';
  const isUmd = mode === 'umd';

  let entry: string;
  let formats: ('es' | 'cjs' | 'iife')[];

  if (isSlim) {
    entry = resolve(import.meta.dirname, 'src/slim.ts');
    formats = ['es', 'cjs', 'iife'];
  } else if (isUmd) {
    entry = resolve(import.meta.dirname, 'src/entry.ts');
    formats = ['iife'];
  } else {
    // Default NPM library build for bundler consumers (Vue, React, Next.js, etc.)
    entry = resolve(import.meta.dirname, 'src/index.ts');
    formats = ['es', 'cjs'];
  }

  return {
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: !isSlim && !isUmd,
      sourcemap: true,
      minify: true,
      lib: {
        entry,
        name: 'Visua11yAgent',
        formats,
        fileName: (format) => {
          if (isSlim) {
            if (format === 'es') return 'visua11y-agent.slim.esm.js';
            if (format === 'cjs') return 'visua11y-agent.slim.cjs.js';
            return 'visua11y-agent.slim.umd.js';
          }
          if (isUmd) {
            return 'visua11y-agent.umd.js';
          }
          if (format === 'es') return 'visua11y-agent.esm.js';
          return 'visua11y-agent.cjs.js';
        },
      },
      rollupOptions: {
        output: {
          exports: 'auto',
        },
      },
    },
    esbuild: {
      legalComments: 'none',
    },
    server: {
      port: 5173,
      open: '/demo/',
      hmr: true,
    },
    plugins: [
      {
        name: 'vite-plugin-raw-assets',
        enforce: 'pre',
        resolveId(source, importer) {
          if (source.endsWith('.html') || source.endsWith('.css') || source.endsWith('.svg')) {
            const absolutePath = importer ? resolve(dirname(importer), source) : resolve(source);
            return `\0virtual-raw:${absolutePath}.js`;
          }
          return null;
        },
        load(id) {
          if (id.startsWith('\0virtual-raw:')) {
            const cleanPath = id.replace('\0virtual-raw:', '').replace(/\.js$/, '');
            this.addWatchFile(cleanPath);
            let content = fs.readFileSync(cleanPath, 'utf-8');

            // Minify raw templates
            if (cleanPath.endsWith('.css')) {
              content = content
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
                .replace(/\;(?=\})/g, '')
                .trim();
            } else if (cleanPath.endsWith('.html') || cleanPath.endsWith('.svg')) {
              content = content
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/>\s+</g, '><')
                .replace(/\s+/g, ' ')
                .trim();
            }

            return `export default ${JSON.stringify(content)};
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      window.location.reload();
    }
  });
}`;
          }
          return null;
        },
      },
    ],
  };
});
