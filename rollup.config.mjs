import pluginBabel from '@rollup/plugin-babel';
import pluginCleanup from 'rollup-plugin-cleanup';
import pluginCommonJs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginTerser from '@rollup/plugin-terser';
import pluginTypescript from '@rollup/plugin-typescript';
import path from 'path';
import typescript from 'typescript';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };

// --- Helper methods ---

const toCamelCase = (value) =>
  value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());

const getFileName = (baseName, format, minify) =>
  [baseName, format !== 'umd' ? format : null, minify ? 'min' : null, 'js']
    .filter(Boolean)
    .join('.');

// --- Constants ---

const NAME = pkg.name;
const LIBRARY_NAME = toCamelCase(NAME);

const VERSION = pkg.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = path.resolve(__dirname);
const DIST_PATH = path.resolve(BASE_PATH, 'dist');
const INPUT_PATH = path.resolve(BASE_PATH, pkg.index);

const FORMATS = ['umd', 'cjs', 'esm'];

const BANNER_TEXT = `/*! ${LIBRARY_NAME} v${VERSION} | Copyright (c) 2016-2025 Jacob Müller */`;

// --- Config ---

const banner = (text) => ({
  name: 'banner',
  renderChunk: (code) => ({ code: `${text}\n${code}`, map: null })
});

const createConfig = (format, minify = false) => ({
  input: INPUT_PATH,
  output: {
    format,
    name: LIBRARY_NAME,
    file: path.resolve(DIST_PATH, getFileName(NAME, format, minify)),
    sourcemap: true
  },
  plugins: [
    pluginNodeResolve(),
    format === 'umd' ? pluginCommonJs() : null,
    pluginTypescript({
      typescript,
      cacheDir: `.cache/typescript`
    }),
    pluginBabel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx']
    }),
    pluginCleanup({ comments: 'none' }),
    minify
      ? pluginTerser({
          compress: { passes: 10 },
          ecma: 5,
          toplevel: format === 'cjs',
          warnings: true
        })
      : null,
    banner(BANNER_TEXT)
  ].filter(Boolean)
});

export default [
  ...FORMATS.map((format) => createConfig(format)),
  ...FORMATS.map((format) => createConfig(format, true))
];
