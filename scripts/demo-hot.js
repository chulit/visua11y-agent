#!/usr/bin/env node
/**
 * Runs esbuild in watch mode alongside the demo server to simulate hot reload.
 */
import { spawn } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processes = [];

function run(command, args, name) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    shell: process.platform === 'win32',
  });

  processes.push(child);

  child.on('exit', (code, signal) => {
    if (signal) {
      return;
    }

    if (code !== 0) {
      console.error(`\n${name} exited with code ${code}. Shutting down...`);
      shutdown();
    }
  });

  return child;
}

function shutdown() {
  while (processes.length) {
    const child = processes.pop();
    if (child && !child.killed) {
      child.kill('SIGINT');
    }
  }

  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run('node', ['esbuild.config.js', '--watch', '--target=umd'], 'esbuild --watch');

// Slight delay to make sure the first build kicks off before the server starts.
setTimeout(() => {
  run('node', ['scripts/demo-server.js'], 'demo server');
}, 200);
