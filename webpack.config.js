const camelCase = require('lodash.camelcase');
const path = require('path');
const webpack = require('webpack');

const BannerPlugin = webpack.BannerPlugin;

const pkg = require('./package.json');

const filename = pkg.name;
const libraryName = camelCase(filename);
const entryPath = path.resolve(__dirname, pkg.main);
const outputPath = path.resolve(__dirname, path.dirname(pkg.main));

const banner = `/*! ${libraryName} v${pkg.version} | Copyright (c) 2016-2018 Jacob Müller */`;

module.exports = {
  mode: 'production',
  entry: {
    [`${filename}.min`]: entryPath
  },
  output: {
    path: outputPath,
    filename: '[name].js',
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: { extensions: ['.js', '.ts'] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [new BannerPlugin({ banner, raw: true })]
};
