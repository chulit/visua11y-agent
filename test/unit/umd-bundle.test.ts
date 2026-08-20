import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('UMD / IIFE Standalone Bundle', () => {
  it('should not contain unhandled "exports" property definitions in IIFE mode', () => {
    const distPath = path.resolve(__dirname, '../../dist/visua11y-agent.umd.js');
    if (fs.existsSync(distPath)) {
      const code = fs.readFileSync(distPath, 'utf8');
      // The standalone IIFE bundle should not start with an unpassed exports definition
      expect(code.slice(0, 100)).not.toContain('Object.defineProperty(exports');
    }
  });
});
