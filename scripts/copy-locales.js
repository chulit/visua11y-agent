import fs from 'fs';
import path from 'path';

const srcDir = './src/locales';
const distDir = './dist/locales';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith('.json')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  }
});
console.log('✅ Locales copied to dist/locales/');
