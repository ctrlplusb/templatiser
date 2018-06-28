const path = require('path')
const exec = require('../src/exec')

describe('exec', () => {
  it('should produce the expected meta data', () => {
    const actual = exec({
      templatesDir: path.join(__dirname, 'templates'),
      inputDir: path.join(__dirname, 'example'),
      outputDir: path.join(__dirname, 'output'),
      allowedFiles: ['.txt'],
      preprocessSource: x => `preprocessed-${x}`,
    })
    expect(actual).toMatchSnapshot()
  })
})
