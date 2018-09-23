const camelCase = require('lodash.camelcase');
const path = require('path');
const webpack = require('webpack');

const BannerPlugin = webpack.BannerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pkg = require('./package.json');

const filename = pkg.name;
const libraryName = camelCase(filename);
const entryPath = path.resolve(__dirname, pkg.index);
const outputPath = path.resolve(__dirname, path.dirname(pkg.main));

const banner = `/*! ${libraryName} v${pkg.version} | Copyright (c) 2016-2018 Jacob Müller */`;

module.exports = {
  mode: 'production',
  entry: {
    [filename]: entryPath,
    [`${filename}.min`]: entryPath
  },
  output: {
    path: outputPath,
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: { extensions: ['.js', '.ts'] },
  optimization: { minimize: false },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [new BannerPlugin({ banner, raw: true }), new UglifyJsPlugin({ include: /\.min\.js$/ })]
};
