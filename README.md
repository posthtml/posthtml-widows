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

This plugin helps prevent widow words by replacing the space between the last two words in a string with a non-breaking space. By default, the string must contain at least 4 words to be processed.

Input:

```html
<div prevent-widows>
  <p>The quick brown fox</p>
</div>
```

Output:

```html
<div>
  <p>The quick brown&nbsp;fox</p>
</div>
```

- [x] configurable attribute names
- [x] set the minimum number of words
- [x] ignore templating logic or expressions
- [x] reverse it: create widow words

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
  .process('<p prevent-widows>The quick brown fox</p>')
  .then(result => console.log(result.html))
```

Result:

```html
<p>The quick brown&nbsp;fox</p>
```

## Attributes

The plugin will only handle strings inside elements that have one of the following attributes:

- `prevent-widows`
- `no-widows`

You may also specify custom attributes to use:

```js
posthtml([
  preventWidows({
    attributes: ['fix-widows']
  })
])
  .process('<p fix-widows>The quick brown fox</p>')
```

## Options

### `minWords`

Type: `number`\
Default: `4`

The minimum number of words a string must contain to be processed.

```js
posthtml([
  preventWidows({
    minWords: 3,
  })
])
  .process('<p prevent-widows>Prevent widow words</p>')
```

### `ignore`

Type: `Array`\
Default: (array of objects)

An array of objects that specify the `start` and `end` delimiters of strings to ignore. Used to avoid processing templating logic or expressions.

By default, the following templating delimiters are ignored:

- `{{ }}` -  Handlebars, Liquid, Nunjucks, Twig, Jinja2, Mustache
- `{% %}` -  Liquid, Nunjucks, Twig, Jinja2
- `<%= %>` - EJS, ERB
- `<% %>` -  EJS, ERB
- `{$ }` - Smarty
- `<?php ?>` - PHP
- `<?= ?>` - PHP
- `#{ }` - Pug

You may add custom delimiters to ignore:

```js
posthtml([
  preventWidows({
    ignore: [
      { start: '[[', end: ']]' },
      // Inside MSO comments
      { start: '<!--[', end: ']>' },
      { start: '<![', end: ']--><' }, // <![endif]-->
    ]
  })
])
  .process(
    `<p prevent-widows>Using the option to <!--[if mso]> ignore this MSO comment <![endif]--> is being tested here.</p>`
  )
```

Result:

```html
<p>Using the option to <!--[if mso]> ignore this MSO comment <![endif]--> is being tested&nbsp;here.</p>
```

### `createWidows`

Type: `boolean`\
Default: `false`

You may also use the plugin to do the opposite of preventing widow words by replacing the `&nbsp;` between the last two words with a regular space.

```js
posthtml([
  preventWidows({
    attributes: ['create-widows'],
    createWidows: true,
  })
])
  .process('<p create-widows>The quick brown&nbsp;fox</p>')
```

Result:

```html
<p>The quick brown fox</p>
```

## License

[MIT](./LICENSE)

[npm]: https://www.npmjs.com/package/posthtml-widows
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-widows.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-widows
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-widows.svg
[github-ci]: https://github.com/posthtml/posthtml-widows/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-widows/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-widows.svg
