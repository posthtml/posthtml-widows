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
    await process('<p prevent-widows>lorem ipsum dolor</p>')
  ).toEqual('<p>lorem ipsum&nbsp;dolor</p>')
})

test('Nested tags', async () => {
  expect(
    await process('<p prevent-widows><span>lorem ipsum dolor</span></p>')
  ).toEqual('<p><span>lorem ipsum&nbsp;dolor</span></p>')
})

test('Mixed content', async () => {
  expect(
    await process('<p prevent-widows>lorem ipsum <span>dolor</span></p>')
  ).toEqual('<p>lorem ipsum <span>dolor</span></p>')

  expect(
    await process('<p prevent-widows>lorem ipsum <span>dolor sit amet</span></p>')
  ).toEqual('<p>lorem ipsum <span>dolor sit&nbsp;amet</span></p>')
})

test('Empty content', async () => {
  expect(
    await process('<p prevent-widows></p>')
  ).toEqual('<p></p>')
})

test('Multiple nested levels', async () => {
  expect(
    await process('<div prevent-widows><p>one two</p><p>three four</p></div>')
  ).toEqual('<div><p>one&nbsp;two</p><p>three&nbsp;four</p></div>')
})

test('Attribute in nested tags only', async () => {
  expect(
    await process('<p><span prevent-widows>ipsum dolor</span></p>')
  ).toEqual('<p><span>ipsum&nbsp;dolor</span></p>')
})
