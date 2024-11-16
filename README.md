<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Prevent Widows</h1>
  <p>PostHTML plugin for preventing widow words</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This plugin helps prevent widow words by replacing the space between the last two words in a string with a non-breaking space. By default, the string must contain at least 3 words to be processed.

Input:

```html
<div prevent-widows>
  <p>Prevent widow words</p>
</div>
```

Output:

```html
<div>
  <p>Prevent widow&nbsp;words</p>
</div>
```

## Install

```
npm i posthtml posthtml-widows
```

## Usage

```js
import posthtml from 'posthtml'
import preventWidows from 'posthtml-widows'

posthtml([
  preventWidows()
])
  .process('<div prevent-widows>Prevent widow words</div>')
  .then(result => console.log(result.html))
```

Result:

```html
<div>Prevent widow&nbsp;words</div>
```

## Options

The plugin will only handle strings inside elements that have one of the following attributes:

- `prevent-widows`
- `no-widows`

You may also specify custom attributes to use:

```js
import posthtml from 'posthtml'
import preventWidows from 'posthtml-widows'

posthtml([
  preventWidows({
    attributes: ['fix-widows']
  })
])
  .process('<div fix-widows>Prevent widow words</div>')
```

[npm]: https://www.npmjs.com/package/posthtml
[npm-version-shield]: https://img.shields.io/npm/v/posthtml.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml.svg
[github-ci]: https://github.com/posthtml/posthtml-plugin-starter/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-plugin-starter/actions/workflows/nodejs.yml/badge.svg
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml.svg
