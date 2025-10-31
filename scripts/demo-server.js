#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * Lightweight static server for the Visua11y Agent demo page.
 * Serves files from the repository root with index fallback to demo/index.html.
 */

import * as http from "http";
import * as fs from "fs";
import * as path from "path";


const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 4173);
const rootDir = process.cwd();
const demoDir = path.join(rootDir, "demo");
const distDir = path.join(rootDir, "dist");
const demoIndex = path.join(demoDir, "index.html");

const SSE_PATH = "/__hmr";
const SSE_RETRY_MS = 1000;
const HEARTBEAT_INTERVAL_MS = 15000;

const sseClients = new Set();
const fileWatchers = [];
let pendingReloadTimer = null;
let lastChangedFile = null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json"
};

function setupWatcher(dir, filter) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const watcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {
      if (!filename) {
        return;
      }

      const targetName = typeof filename === "string" ? filename : filename.toString();
      if (filter(targetName, eventType)) {
        scheduleReload(path.join(dir, targetName));
      }
    });

    fileWatchers.push(watcher);
  } catch (err) {
    console.warn(`[demo-server] Failed to watch ${dir}: ${err.message}`);
  }
}

function scheduleReload(filePath) {
  lastChangedFile = filePath;
  if (pendingReloadTimer) {
    return;
  }

  pendingReloadTimer = setTimeout(() => {
    pendingReloadTimer = null;
    broadcastReload(lastChangedFile);
    lastChangedFile = null;
  }, 120);
}

function broadcastReload(filePath) {
  if (!sseClients.size) {
    return;
  }

  const payload = JSON.stringify({ file: filePath, time: Date.now() });
  for (const { res } of sseClients) {
    res.write(`event: reload\ndata: ${payload}\n\n`);
  }
}

function handleSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  res.write(`retry: ${SSE_RETRY_MS}\n\n`);

  const client = {
    res,
    heartbeat: setInterval(() => {
      res.write(": heartbeat\n\n");
    }, HEARTBEAT_INTERVAL_MS)
  };

  sseClients.add(client);

  res.write(`event: connected\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);

  req.on("close", () => {
    clearInterval(client.heartbeat);
    sseClients.delete(client);
  });
}

function toFilePath(requestUrl) {
  const { pathname } = new URL(requestUrl, 'http://localhost');
  if (!pathname || pathname === "/") {
    return demoIndex;
  }

  const normalized = path.normalize(decodeURIComponent(pathname));
  const sanitized = normalized.replace(/^(\.\.[/\\])+/, "");

  if (sanitized === "/" || sanitized === "") {
    return demoIndex;
  }

  return path.join(rootDir, sanitized);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (readErr, data) => {
    if (readErr) {
      if (filePath !== demoIndex) {
        sendNotFound(res);
        return;
      }

      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("500 Internal Server Error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function sendNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
}

function startFileWatchers() {
  setupWatcher(distDir, (filename) => filename.endsWith(".js") || filename.endsWith(".map"));
  setupWatcher(demoDir, (filename, eventType) => {
    if (eventType === "rename") {
      return filename.endsWith(".html");
    }
    return filename.endsWith(".html") || filename.endsWith(".css") || filename.endsWith(".js");
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendNotFound(res);
    return;
  }

  if (req.url.startsWith(SSE_PATH)) {
    handleSSE(req, res);
    return;
  }

  const filePath = toFilePath(req.url);
  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      if (filePath !== demoIndex) {
        sendNotFound(res);
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Demo index not found. Run npm run build first.");
      return;
    }

    if (stats.isDirectory()) {
      sendFile(res, path.join(filePath, "index.html"));
      return;
    }

    sendFile(res, filePath);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\nVisua11y Agent demo available at http://${HOST}:${PORT}/`);
  console.log("Press Ctrl+C to stop the server.");
  startFileWatchers();
});

process.on("exit", () => {
  if (pendingReloadTimer) {
    clearTimeout(pendingReloadTimer);
  }

  for (const watcher of fileWatchers) {
    try {
      watcher.close();
    } catch (err) {
      // ignore
    }
  }
});
