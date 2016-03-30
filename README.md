# [IdleTimeout](https://github.com/jackmu95/idle-timeout/)

[![npm](https://img.shields.io/npm/v/idle-timeout.svg)](https://www.npmjs.com/package/idle-timeout/)
[![dependency Status](https://img.shields.io/david/jackmu95/idle-timeout.svg)](https://david-dm.org/jackmu95/idle-timeout/)
[![devDependency Status](https://img.shields.io/david/dev/jackmu95/idle-timeout.svg)](https://david-dm.org/jackmu95/idle-timeout/#info=devDependencies)

This zero dependency, ~3KB library makes idle state detection in the browser an ease. With it's simple but yet powerful API it features everything you will ever need.


## Installation

### npm
```bash
npm install idle-timeout --save
```

### Download
* [Compressed ~3kb](https://raw.github.com/jackmu95/idle-timeout/master/dist/idle-timeout.min.js)
* [Uncompressed ~13kb](https://raw.github.com/jackmu95/idle-timeout/master/dist/idle-timeout.js)


## Usage
IdleTimeout is totally easy to use. All you basically need to do is:
```javascript
new IdleTimeout(function() {
  // Do some cool stuff
});
```


## Documentation
The IdleTimeout constructor takes two arguments:
  1. `callback [Function]` - _The callback function_
  2. `options [Object]` - _An **optional** options object_
    * `timeout [Number]` - _The idle timeout (in milliseconds)_
    * `loop [Boolean]` - _Wether the timeout should be looped when idle_

```javascript
var idleTimeout = new IdleTimeout(function() {
  // Callback
}, {
  timeout: 60 * 1000 * 5,
  loop: false
});
```

### Methods
`pause()` - _Pauses the timeout_
```javascript
idleTimeout.pause();
```

`resume()` - _Resumes an paused timeout_
```javascript
idleTimeout.resume();
```

`reset()` - _Reset the timeout_
```javascript
idleTimeout.reset();
```

`destroy()` - _Destroy the instance_
```javascript
idleTimeout.destroy();
```

### Getters
`idle [Boolean]` - _Wether the current state is idle_
```javascript
idleTimeout.idle; // false
```

### Setters
`timeout = value [Number]` - _Set the timeout (in milliseconds)_
```javascript
idleTimeout.timeout = 60 * 1000;
```

`loop = value [Boolean]` - _Set wether the timeout should be looped_
```javascript
idleTimeout.loop = true;
```

`idle = value [Boolean]` - _Set the idle state_
```javascript
idleTimeout.idle = true;
```


## Browser Support
IdleTimeout works on all modern **desktop and mobile** browsers.


## License
This project is licensed under the terms of the [MIT License](LICENSE).
