import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import pkg from '../package.json' with { type: 'json' };

const ROOT_URL = new URL('../', import.meta.url);
const ENTRY_POINTS = new Set([
  pkg.main,
  pkg.module,
  pkg.types,
  pkg.unpkg,
  ...Object.values(pkg.exports['.'])
]);

// Byte budgets include the license banner and source-map reference.
const BUNDLE_BUDGETS = [
  { file: 'idle-timeout.cjs.js', bytes: 4000, gzip: 1100 },
  { file: 'idle-timeout.esm.mjs', bytes: 4000, gzip: 1100 },
  { file: 'idle-timeout.umd.js', bytes: 4500, gzip: 1250 },
  { file: 'idle-timeout.cjs.min.js', bytes: 2500, gzip: 900 },
  { file: 'idle-timeout.esm.min.mjs', bytes: 2500, gzip: 900 },
  { file: 'idle-timeout.min.umd.js', bytes: 2700, gzip: 1000 }
];

const require = createRequire(import.meta.url);

// Resolve through package exports, as consumers do. Importing must work without a DOM.
const esm = await import(pkg.name);
const cjs = require(pkg.name);
assert.equal(typeof esm.default, 'function', 'ESM must provide the default factory');
assert.equal(typeof cjs, 'function', 'CommonJS must export the factory directly');

for (const entry of ENTRY_POINTS) {
  await access(new URL(entry, ROOT_URL));
}
console.info('Package exports and declared entry points are valid.');

for (const budget of BUNDLE_BUDGETS) {
  const source = await readFile(new URL(`dist/${budget.file}`, ROOT_URL));
  const compressedBytes = gzipSync(source).byteLength;
  assert.ok(
    source.byteLength <= budget.bytes,
    `${budget.file}: ${source.byteLength} bytes exceeds the ${budget.bytes}-byte budget`
  );
  assert.ok(
    compressedBytes <= budget.gzip,
    `${budget.file}: ${compressedBytes} gzip bytes exceeds the ${budget.gzip}-byte budget`
  );
  console.info(
    `${budget.file}: ${source.byteLength}/${budget.bytes} bytes, gzip ${compressedBytes}/${budget.gzip}`
  );
}
