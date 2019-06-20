import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import camelCase from 'lodash/camelCase';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import pkg from './package.json';

const FORMATS = ['umd', 'cjs', 'esm'];

const name = pkg.name;
const libraryName = camelCase(name);

const basePath = path.resolve(__dirname);
const distPath = path.resolve(basePath, 'dist');
const inputPath = path.resolve(basePath, pkg.index);

const bannerText = `/*! ${libraryName} v${pkg.version} | Copyright (c) 2016-2019 Jacob Müller */`;
const banner = text => ({
  name: 'banner',
  renderChunk: code => ({ code: `${text}\n${code}`, map: null })
});

const getFileName = (baseName, format, minify) =>
  [baseName, format !== 'umd' ? format : null, minify ? 'min' : null, 'js']
    .filter(Boolean)
    .join('.');

const createConfig = (format, minify = false) => ({
  input: inputPath,
  output: {
    format,
    name: libraryName,
    file: path.resolve(distPath, getFileName(name, format, minify)),
    sourcemap: true
  },
  plugins: [
    resolve(),
    format === 'umd' ? commonjs() : null,
    typescript({
      typescript: require('typescript'),
      cacheRoot: `.cache/typescript`
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx']
    }),
    sourceMaps(),
    cleanup({ comments: 'none' }),
    minify
      ? terser({
          sourcemap: true,
          compress: { passes: 10 },
          ecma: 5,
          toplevel: format === 'cjs',
          warnings: true
        })
      : null,
    banner(bannerText)
  ].filter(Boolean)
});

export default [
  ...FORMATS.map(format => createConfig(format)),
  ...FORMATS.map(format => createConfig(format, true))
];
