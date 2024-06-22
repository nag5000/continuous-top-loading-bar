# A stupidly simple Continuous Top Loader Bar component

- Vanilla JS, powered by Web Animations API
- No dependencies
- Extremely lightweight: 100 lines of source code, 1.17 KB minified, 0.5 KB gzipped
- Completely customizable: style it with CSS, define custom animation with your own `KeyframeEffect`

## Installation

```sh
npm i continuous-top-loading-bar
```

## Usage

```html
<body>
  <div id="progress-bar"></div>
  <main>...</main>
</body
```

```js
const bar = document.getElementById('progress-bar')
const loader = new ContinuousTopLoadingBar(bar)
// loader.start()
// loader.done()
```

# API

See here https://nag5000.github.io/continuous-top-loading-bar

# Demo

TBD
