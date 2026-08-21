import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const demoSource = path.join(projectRoot, "demo", "index.html");
const docsPublicDir = path.join(projectRoot, "docs", "public", "demo");
const docsPublicHtml = path.join(docsPublicDir, "index.html");
const distDir = path.join(projectRoot, "dist");
const bundlePath = path.join(distDir, "visua11y-agent.umd.js");

if (!fs.existsSync(demoSource)) {
  console.error(`❌ Missing demo source at ${demoSource}`);
  process.exit(1);
}

if (!fs.existsSync(bundlePath)) {
  console.error(`❌ Missing UMD bundle at ${bundlePath}. Run npm run build first.`);
  process.exit(1);
}

let html = fs.readFileSync(demoSource, "utf8");

// Remove the hot reload EventSource script block used in dev.
html = html.replace(
  /\s*<script>\s*\(function\s*\(\)\s*{[\s\S]+?window\.location\.reload\(\);\s*}\s*\)\(\);\s*<\/script>/,
  ""
);

const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
html = html.replace(/id="demoVersionBadge">[^<]*<\/span>/g, `id="demoVersionBadge">v${packageJson.version}</span>`);

// Ensure the script points to a relative bundle inside the demo folder.
html = html.replace(/<script type="module" src="\/src\/entry\.ts"/, '<script src="./visua11y-agent.umd.js"');
html = html.replace("../dist/visua11y-agent.umd.js", "./visua11y-agent.umd.js");
html = html.replaceAll('/src/icons/logo-title.avif', './logo-title.avif');
html = html.replaceAll('/src/icons/logo-256x256.avif', './logo-256x256.avif');
html = html.replaceAll('/src/icons/logo.avif', './logo.avif');

fs.mkdirSync(docsPublicDir, { recursive: true });
fs.writeFileSync(docsPublicHtml, html);

// Copy the built UMD bundle next to the demo HTML so it can be served statically.
fs.copyFileSync(bundlePath, path.join(docsPublicDir, "visua11y-agent.umd.js"));

// Copy logo assets next to the demo HTML.
const logoFiles = [
  'logo.avif',
  'logo-256x256.avif',
  'logo-title.avif',
];

for (const fileName of logoFiles) {
  const source = path.join(projectRoot, 'src', 'icons', fileName);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(docsPublicDir, fileName));
  }
}

console.log(`✅ Demo copied to ${docsPublicHtml}`);
