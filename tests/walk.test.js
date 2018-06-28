const exec = require('../src')
const walk = require('../src/walk')

describe('walk', () => {
  it('should respect accumulator', () => {
    const tree = exec({
      templatesDir: 'tests/templates',
      inputDir: 'tests/example',
      outputDir: 'tests/output',
      allowedFiles: ['.txt'],
      preprocessSource: x => `preprocessed-${x}`,
    })
    const actual = walk(tree, (acc, { name }) => [...acc, name], [])
    expect(actual).toMatchSnapshot()
  })
})
