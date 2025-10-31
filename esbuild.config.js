import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { minify } from 'html-minifier';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const isWatch = process.argv.includes('--watch');
const isMinify = process.argv.includes('--minify');

const targetArg = process.argv.find(arg => arg.startsWith('--target='));
const targetFormat = targetArg ? targetArg.split('=')[1] : 'umd';

const baseConfig = {
  entryPoints: ['./src/entry.ts'],
  bundle: true,
  minify: isMinify,
  sourcemap: true,
  alias: { '@': './src' },
  loader: { '.html': 'text', '.svg': 'text', '.png': 'dataurl' },
  plugins: [
    {
      name: "CSSMinifyPlugin",
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
          const file = fs.readFileSync(args.path, 'utf8');
          const css = await esbuild.transform(file, { loader: "css", minify: true });
          return { loader: "text", contents: css.code };
        });
      }
    },
    {
      name: "HTMLMinifyPlugin",
      setup(build) {
        build.onLoad({ filter: /\.(html|svg)$/ }, async (args) => {
          const file = fs.readFileSync(args.path, 'utf8');
          const html = minify(file, {
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
          }).trim();
          return { loader: "text", contents: html };
        });
      }
    }
  ],
  banner: {
    js: `/*!
 * Visua11y Agent Accessibility Widget v${packageJson.version}
 * (c) ${new Date().getFullYear()} ${packageJson.author}
 * License: ${packageJson.license}
 * Home Page: ${packageJson.homepage}
 * Repository: ${packageJson.repository.url}
 */`
  }
};

// Build targets
const targets = {
  esm: { format: 'esm', outfile: 'dist/visua11y-agent.esm.js' },
  cjs: { format: 'cjs', outfile: 'dist/visua11y-agent.cjs.js' },
  umd: { format: 'iife', outfile: 'dist/visua11y-agent.umd.js', globalName: 'Visua11yAgent' }
};

const buildTarget = targets[targetFormat];

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context({ ...baseConfig, ...buildTarget });
    await ctx.watch();
    console.log(`⚡ Watching ${buildTarget.outfile}...`);
  } else {
    console.log('🏗️  Building all formats...');
    await Promise.all(Object.values(targets).map(target =>
      esbuild.build({ ...baseConfig, ...target })
    ));
    console.log(`✅ Build complete: ${buildTarget.outfile}`);
  }
}

build().catch(() => process.exit(1));
