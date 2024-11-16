import {test, expect} from 'vitest'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'

const clean = html => html.replaceAll(/[^\S\r\n]+$/gm, '').trim()

const process = (input, options, posthtmlOptions, log = false) => {
  return posthtml([plugin(options)])
    .process(input, posthtmlOptions)
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

test('Custom attribute', async () => {
  expect(
    await process('<p fix-widows>lorem ipsum dolor sit amet</p>', { attributes: ['fix-widows'] })
  ).toEqual('<p>lorem ipsum dolor sit&nbsp;amet</p>')
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

test('`ignore` defaults', async () => {
  expect(
    await process(`<p prevent-widows>{{ 'lorem ipsum dolor sit' }}</p>`)
  ).toEqual(`<p>{{ 'lorem ipsum dolor sit' }}</p>`)

  expect(
    await process(`<p prevent-widows>Hi{% if user.name %} user.name{% endif %}!</p>`)
  ).toEqual(`<p>Hi{% if user.name %} user.name{% endif %}!</p>`)

  expect(
    await process(`<p prevent-widows>Using the option to {{ 'ignore an expression block' }} is being tested here</p>`)
  ).toEqual(`<p>Using the option to {{ 'ignore an expression block' }} is being tested&nbsp;here</p>`)

  expect(
    await process(
      `<p no-widows>Hi <?php echo $user->name; ?>, thanks for signing up!</p>`,
      {},
      {
        directives: [
          { name: '?php', start: '<', end: '>' },
        ],
      }
    )
  ).toEqual(`<p>Hi <?php echo $user->name; ?>, thanks for signing&nbsp;up!</p>`)
})

test('Custom `ignore`', async () => {
  expect(
    await process('<p prevent-widows>[[ one two there four ]] five six seven eight</p>', { ignore: [{ start: '[[', end: ']]' }] })
  ).toEqual('<p>[[ one two there four ]] five six seven&nbsp;eight</p>')
})

test('`createWidows` option', async () => {
  expect(
    await process(
      `<p create-widows>lorem ipsum dolor {{ 'leave this part&nbsp;alone' }} sit amet consectetur adipiscing&nbsp;elit</p>`,
      {
        createWidows: true,
        attributes: ['create-widows']
      }
    )
  ).toEqual(`<p>lorem ipsum dolor {{ 'leave this part&nbsp;alone' }} sit amet consectetur adipiscing elit</p>`)
})
