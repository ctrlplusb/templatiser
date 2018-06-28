const exec = require('../src/exec')

describe('exec', () => {
  it('should produce the expected meta data', () => {
    const actual = exec({
      templatesDir: 'tests/templates',
      inputDir: 'tests/example',
      outputDir: 'tests/output',
      allowedFiles: ['.txt'],
      preprocessSource: x => `preprocessed-${x}`,
    })
    expect(actual).toMatchSnapshot()
  })
})
