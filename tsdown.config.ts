import pkg from './package.json' with { type: 'json' };
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsdown';
import type { Format, UserConfig } from 'tsdown';

// --- Helper methods ---

const toCamelCase = (value: string) => {
  return value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

const getEntryAlias = (baseName: string, format: Format, minify: boolean) => {
  const formatSuffix = format === 'umd' ? null : format;
  const minSuffix = minify ? 'min' : null;

  return [baseName, formatSuffix, minSuffix].filter(Boolean).join('.');
};

// --- Constants ---

const NAME = pkg.name;
const VERSION = pkg.version;
const LIBRARY_NAME = toCamelCase(NAME);
const CURRENT_YEAR = new Date().getFullYear();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = __dirname;
const DIST_PATH = path.resolve(BASE_PATH, 'dist');
const INPUT_PATH = path.resolve(BASE_PATH, pkg.index);

const PLATFORM = 'browser';
const FORMATS: Format[] = ['cjs', 'esm', 'umd'];

const BANNER_TEXT = `/*! ${LIBRARY_NAME} v${VERSION} | Copyright (c) 2016-${CURRENT_YEAR} Jacob Müller */`;

// --- Config ---

const createConfig = (
  format: Format,
  minify: boolean = false,
  clean: boolean = false
): UserConfig => {
  const alias = getEntryAlias(NAME, format, minify);

  return {
    // Use object entry to control output filename within `output.dir`.
    entry: { [alias]: INPUT_PATH },
    outDir: DIST_PATH,
    platform: PLATFORM,
    format,
    minify,
    sourcemap: true,
    clean,
    // Only generate types for non-minified builds to save time.
    dts: !minify,
    // Required for UMD to expose the global variable.
    globalName: format === 'umd' ? LIBRARY_NAME : undefined,
    banner: { js: BANNER_TEXT }
  };
};

export default defineConfig([
  // Non-minified bundles (clean dist on first run).
  ...FORMATS.map((format, index) => createConfig(format, false, index === 0)),

  // Minified bundles.
  ...FORMATS.map((format) => createConfig(format, true))
]);
