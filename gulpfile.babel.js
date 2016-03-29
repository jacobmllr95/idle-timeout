'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import fs from 'fs';
import del from 'del';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

const plugins = gulpLoadPlugins();
const pkg = JSON.parse(fs.readFileSync('./package.json'));

const PATHS = {
  src: './src/',
  dist: './dist/'
};

const GLOB = {
  index: 'index.js',
  idleTimeout: 'idle-timeout.js',
  js: '**/*.js'
};

// Clean up the `dist` directory
gulp.task('dist:clean', callback => {
  del(`${PATHS.dist}*`).then(() => {
    callback();
  });
});

// Lint the JavaScript files
gulp.task('dist:lint-js', ['dist:clean'], () => {
  gulp.src(`${PATHS.src}${GLOB.js}`)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());
});

// Compile the ES6 JavaScript files to ES5
gulp.task('dist:js', ['dist:lint-js'], () => {
  return browserify(`${PATHS.src}${GLOB.index}`, {debug: true})
      .transform(babelify).bundle()
      .pipe(source(GLOB.idleTimeout))
      .pipe(gulp.dest(`${PATHS.dist}`));
});

// Minify the JavaScript files
gulp.task('dist:minify-js', ['dist:js'], () => {
  let banner = '/*! ' +
      `IdleTimeout v${pkg.version} | ` +
      `${pkg.repository.url} | ` +
      `(c) 2016 ${pkg.maintainers[0].name} ` +
      '*/';

  gulp.src(`${PATHS.dist}${GLOB.idleTimeout}`)
      .pipe(plugins.uglify())
      .pipe(plugins.header(`${banner}\n`))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(gulp.dest(PATHS.dist));
});

// Rerun the depending task when a file changes
gulp.task('watch', () => {
  gulp.watch(`${PATHS.src}${GLOB.js}`, ['dist']);
});

// The distribution task
gulp.task('dist', ['dist:clean', 'dist:lint-js', 'dist:js', 'dist:minify-js']);

// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['dist']);
