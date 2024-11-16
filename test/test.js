import {test, expect} from 'vitest'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'

const clean = html => html.replaceAll(/[^\S\r\n]+$/gm, '').trim()

const process = (input, options, log = false) => {
  return posthtml([plugin(options)])
    .process(input)
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => html)
}

test('Skips unmarked nodes', async () => {
  expect(await process('skips unmarked strings')).toEqual('skips unmarked strings')
  expect(await process('<p>skips unmarked tags</p>')).toEqual('<p>skips unmarked tags</p>')
})

test('Basic functionality', async () => {
  expect(
    await process('<p prevent-widows>lorem ipsum dolor sit amet</p>')
  ).toEqual('<p>lorem ipsum dolor sit&nbsp;amet</p>')
})

test('Nested tags', async () => {
  expect(
    await process('<p prevent-widows><span>lorem ipsum dolor sit amet</span></p>')
  ).toEqual('<p><span>lorem ipsum dolor sit&nbsp;amet</span></p>')
})

test('Mixed content', async () => {
  expect(
    await process('<p prevent-widows>lorem ipsum <span>dolor</span></p>')
  ).toEqual('<p>lorem ipsum <span>dolor</span></p>')

  expect(
    await process('<p prevent-widows>a string <span>with a bunch of words</span></p>')
  ).toEqual('<p>a string <span>with a bunch of&nbsp;words</span></p>')
})

test('Empty content', async () => {
  expect(
    await process('<p prevent-widows></p>')
  ).toEqual('<p></p>')
})

test('Multiple nested levels', async () => {
  expect(
    await process('<div prevent-widows><p>one two</p><p>three four five six</p></div>')
  ).toEqual('<div><p>one two</p><p>three four five&nbsp;six</p></div>')
})

test('Attribute in nested tags only', async () => {
  expect(
    await process('<p><span prevent-widows>lorem ipsum dolor sit</span></p>')
  ).toEqual('<p><span>lorem ipsum dolor&nbsp;sit</span></p>')
})

test('Works in MSO Comments', async () => {
  expect(
    await process('<p prevent-widows><!--[if mso]>lorem ipsum dolor sit<![endif]--></p>')
  ).toEqual('<p><!--[if mso]>lorem ipsum dolor&nbsp;sit<![endif]--></p>')
})

test('Ignore default', async () => {
  expect(
    await process('<p prevent-widows>{{lorem ipsum dolor sit}}</p>')
  ).toEqual('<p>{{lorem ipsum dolor sit}}</p>')
})

test('Custom ignore', async () => {
  expect(
    await process('<p prevent-widows>{% lorem ipsum dolor sit %}</p>', { ignore: [{ start: '{%', end: '%}' }] })
  ).toEqual('<p>{% lorem ipsum dolor sit %}</p>')
})
