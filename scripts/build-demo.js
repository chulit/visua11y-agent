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

// Ensure the script points to a relative bundle inside the demo folder.
html = html.replace("../dist/visua11y-agent.umd.js", "./visua11y-agent.umd.js");

fs.mkdirSync(docsPublicDir, { recursive: true });
fs.writeFileSync(docsPublicHtml, html);

// Copy the built UMD bundle next to the demo HTML so it can be served statically.
fs.copyFileSync(bundlePath, path.join(docsPublicDir, "visua11y-agent.umd.js"));

console.log(`✅ Demo copied to ${docsPublicHtml}`);
