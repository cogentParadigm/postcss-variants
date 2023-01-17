const postcss = require('postcss')
const fs = require('fs');

const variants = require('../src/')

async function run (input, output, opts = { }) {
  let result = await postcss([variants(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('does not generate any variants by default', async () => {
  await run(
    getFixture("no-variants/input.css"),
    getFixture("no-variants/output.css"),
    { }
  )
})

it('includes a responsive variant', async () => {
  await run(
    getFixture("responsive/input.css"),
    getFixture("responsive/output.css"),
    { }
  )
})

it('includes a hover variant', async () => {
  await run(
    getFixture("hover/input.css"),
    getFixture("hover/output.css"),
    { }
  )
})

it('includes a focus variant', async () => {
  await run(
    getFixture("focus/input.css"),
    getFixture("focus/output.css"),
    { }
  )
})

it('can generate multiple variants', async () => {
  await run(
    getFixture("responsive-hover/input.css"),
    getFixture("responsive-hover/output.css"),
    { }
  )
})

it('can handle nested variants', async () => {
  await run(
    getFixture("responsive-hover-nested/input.css"),
    getFixture("responsive-hover-nested/output.css"),
    { }
  )
})

it('can customize transform function', async () => {
  await run(
    getFixture("responsive-custom-transform/input.css"),
    getFixture("responsive-custom-transform/output.css"),
    { transform: (selector, suffix) => `${suffix}-${selector.value}` }
  )
})

it('will throw an error for non existant variants', async () => {
  function thrower() {
    const root = postcss.root();
    const atRule = postcss.atRule({name: "variants", params: "notreal"})
    root.append(atRule);
    variants({}).Root(root, postcss)
  }
  expect(thrower).toThrow("Variant 'notreal' does not exist.")
})

function getFixture(name) {
  return fs.readFileSync(`test/fixtures/${name}`, 'utf8');
}
