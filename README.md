# babel-helper-remap-koa2-async-to-generator

Turn async functions into ES2015 generators (Koav2 -> Koav1).

## Installation

```sh
$ npm install babel-helper-remap-koa2-async-to-generator
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-koa2-async-to-generator"]
}
```

### Via CLI

```sh
$ babel --plugins transform-koa2-async-to-generator script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-koa2-async-to-generator"]
});
```
