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
* [Compressed ~3kb](https://raw.github.com/jackmu95/IdleTimeout/master/dist/idle-timeout.min.js)
* [Uncompressed ~13kb](https://raw.github.com/jackmu95/IdleTimeout/master/dist/idle-timeout.js)


## Usage
IdleTimeout is totally easy to use. All you basically need to do is:
```javascript
new IdleTimeout(function() {
  // Do some cool stuff
});
```


## Documentation
The IdleTimeout constructor takes two arguments:
  1. `callback [Function]` - *The callback function*
  2. `options [Object]` - *An **optional** options object*
    * `timeout [Number]` - *The idle timeout (in milliseconds)*

```javascript
var idleTimeout = new IdleTimeout(function() {
  // Callback
}, {
  timeout: 60 * 1000 * 5
});
```

### Methods
`reset()` - *Reset the timeout*
```javascript
idleTimeout.reset();
```

`destroy()` - *Destroy the instance*
```javascript
idleTimeout.destroy();
```

### Getters
`idle()` - *Wether the current state is idle*
```javascript
idleTimeout.idle(); // false
```

### Setters
`idle(value [Boolean])` - *Set the current idle state*
```javascript
idleTimeout.idle(true);
```


## Browser Support
IdleTimeout works on all modern **desktop and mobile** browsers.


## License
This project is licensed under the terms of the [MIT License](LICENSE).
