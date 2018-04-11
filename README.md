# [idleTimeout](https://github.com/jackmu95/idle-timeout/)

[![Version](https://img.shields.io/npm/v/idle-timeout.svg)](https://www.npmjs.com/package/idle-timeout/)
[![License](https://img.shields.io/npm/l/idle-timeout.svg)](https://www.npmjs.com/package/idle-timeout/)

A zero dependency, ~3KB library to make idle state detection in the browser an ease. With it's simple but yet powerful API it features everything you will ever need.


## Installation

### Using npm
```bash
npm install idle-timeout
```

### Using yarn
```bash
yarn add idle-timeout
```

### Using CDN
```html
<script src="https://unpkg.com/idle-timeout/dist/idle-timeout.min.js"></script>
```


## Usage
idleTimeout is totally easy to use. All you basically need to do is:
```javascript
idleTimeout(() => {
  // Do some cool stuff
});
```


## Documentation
The idleTimeout constructor takes two arguments:
  * `callback [Function]` - _The callback function_
  * `options [Object]` - _An **optional** options object_
    * `element [Element]` - _The element to listen for the timeout_
    * `timeout [Number]` - _The idle timeout (in milliseconds)_
    * `loop [Boolean]` - _Wether the timeout should be looped when idle_

```javascript
const instance = idleTimeout(
  () => {
    // Callback
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
```javascript
instance.pause();
```

`resume()` - _Resumes an paused timeout_
```javascript
instance.resume();
```

`reset()` - _Reset the timeout_
```javascript
instance.reset();
```

`destroy()` - _Destroy the instance_
```javascript
instance.destroy();
```

### Getters
`idle [Boolean]` - _Wether the current state is idle_
```javascript
instance.idle; // false
```

### Setters
`timeout = value [Number]` - _Set the timeout (in milliseconds)_
```javascript
instance.timeout = 1000 * 60;
```

`loop = value [Boolean]` - _Set wether the timeout should be looped_
```javascript
instance.loop = true;
```

`idle = value [Boolean]` - _Set the idle state_
```javascript
instance.idle = true;
```


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 8+ ✔ |


## License
This project is licensed under the terms of the [MIT License](LICENSE).
