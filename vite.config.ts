import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const isSlim = mode === 'slim';
  const entry = resolve(import.meta.dirname, isSlim ? 'src/slim.ts' : 'src/entry.ts');

  return {
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: !isSlim,
      sourcemap: true,
      minify: 'esbuild',
      lib: {
        entry,
        name: 'Visua11yAgent',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          const prefix = isSlim ? 'visua11y-agent.slim' : 'visua11y-agent';
          if (format === 'es') return `${prefix}.esm.js`;
          if (format === 'cjs') return `${prefix}.cjs.js`;
          return `${prefix}.umd.js`;
        },
      },
      rollupOptions: {
        output: {
          exports: 'named',
        },
      },
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
            const content = fs.readFileSync(cleanPath, 'utf-8');
            return `export default ${JSON.stringify(content)};`;
          }
          return null;
        },
      },
    ],
  };
});
