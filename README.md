# [idleTimeout](https://github.com/jacobmllr95/idle-timeout/)

[![Version](https://img.shields.io/npm/v/idle-timeout)](https://www.npmjs.com/package/idle-timeout/)
[![Size](https://img.shields.io/bundlephobia/min/idle-timeout/latest)](https://bundlephobia.com/package/idle-timeout@latest)
[![Coverage](https://img.shields.io/codecov/c/github/jacobmllr95/idle-timeout)](https://app.codecov.io/github/jacobmllr95/idle-timeout)
[![License](https://img.shields.io/npm/l/idle-timeout)](https://github.com/jacobmllr95/idle-timeout/blob/main/README.md)

A zero dependency, ~3KB library to make idle state detection in the browser an ease. With it's simple but yet powerful API it features everything you will ever need.

## Installation

### Using npm

```bash
npm install idle-timeout
```

### Using pnpm

```bash
pnpm add idle-timeout
```

### Using yarn

```bash
yarn add idle-timeout
```

### Using CDN

```html
<script src="https://unpkg.com/idle-timeout/dist/idle-timeout.min.umd.js"></script>
```

## Usage

`idleTimeout` is totally easy to use. All you need to do is:

```js
import idleTimeout from 'idle-timeout';

idleTimeout(() => {
  console.log('Idle state detected.');
});
```

## Documentation

The `idleTimeout` constructor takes two arguments:

- `callback [Function]` - _The callback function (receives `element` and `timeout` as arguments)_
  - `element [Element]` - _The element that was listened for the timeout_
  - `timeout [Number]` - _The current timeout value in milliseconds_
- `options [Object]` - _An **optional** options object_
  - `element [Element]` - _The element to listen for the timeout_
  - `timeout [Number]` - _The idle timeout (in milliseconds)_
  - `loop [Boolean]` - _Whether the timeout should be looped when idle_

```js
const instance = idleTimeout(
  (element, timeout) => {
    console.log(`Idle state detected on ${element} after ${timeout} ms`);
  },
  {
    element: document,
    timeout: 1000 * 60 * 5,
    loop: false
  }
);
```

### Methods

`pause()` - _Pauses the timeout_

```js
instance.pause();
```

`resume()` - _Resumes an paused timeout_

```js
instance.resume();
```

`reset()` - _Reset the timeout_

```js
instance.reset();
```

`destroy()` - _Destroy the instance_

```js
instance.destroy();
```

### Getters

`idle [Boolean]` - _Whether the current state is idle_

```js
instance.idle; // false
```

### Setters

`timeout = value [Number]` - _Set the timeout (in milliseconds)_

```js
instance.timeout = 1000 * 60;
```

`loop = value [Boolean]` - _Set whether the timeout should be looped_

```js
instance.loop = true;
```

`idle = value [Boolean]` - _Set the idle state_

```js
instance.idle = true;
```

## License

This project is licensed under the terms of the [MIT License](LICENSE).
