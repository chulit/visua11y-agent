import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const demoHtmlPath = path.join(projectRoot, "demo", "index.html");
const distDir = path.join(projectRoot, "dist");
const distHtmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(demoHtmlPath)) {
  console.error(`❌ Demo HTML not found at ${demoHtmlPath}`);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.error(`❌ Build directory not found at ${distDir}. Run the build step first.`);
  process.exit(1);
}

let html = fs.readFileSync(demoHtmlPath, "utf8");

// Remove the hot-reload EventSource snippet which only works during development.
const hmrStart = html.indexOf("(function () {");
const hmrEnd = html.indexOf("})();", hmrStart);
if (hmrStart !== -1 && hmrEnd !== -1) {
  const before = html.slice(0, hmrStart).trimEnd();
  const after = html.slice(hmrEnd + "})();".length);
  html = `${before}\n\n${after.trimStart()}`;
}

// Point to the bundled script next to index.html within dist.
html = html.replace("../dist/visua11y-agent.umd.js", "./visua11y-agent.umd.js");

fs.writeFileSync(distHtmlPath, html);
console.log(`✅ Generated GitHub Pages entrypoint at ${distHtmlPath}`);
