/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const fs = require('fs-extra')
const createTemplate = require('lodash.template')
const rimraf = require('rimraf')
const path = require('path')
const extractMetaTree = require('./extract-meta-tree')
const walkMetaTree = require('./walk')

const templates = {}

const resolveTemplate = (templatesDir, name = 'default') => {
  if (!templates[name]) {
    const templatePath = path.join(templatesDir, name)
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Could not resolve template: ${name}`)
    }
    const templateSrc = fs.readFileSync(templatePath, {
      encoding: 'utf8',
    })
    templates[name] = {
      apply: createTemplate(templateSrc),
      ext: path.extname(templatePath),
    }
  }
  return templates[name]
}

module.exports = ({ templatesDir, outputDir, inputDir, allowedFiles }) => {
  const metaTree = extractMetaTree({ inputDir, allowedFiles })

  fs.ensureDirSync(outputDir)

  const cwd = process.cwd()

  walkMetaTree(
    metaTree,
    (acc, { name, path: fileOrDirPath, relativePath, templateName, type }) => {
      if (type === 'directory') {
        const targetPath = path.join(outputDir, relativePath)
        rimraf.sync(targetPath)
        fs.ensureDirSync(targetPath)
      } else if (type === 'file') {
        const source = fs.readFileSync(fileOrDirPath, {
          encoding: 'utf8',
        })
        const template = resolveTemplate(templatesDir, templateName)
        const targetPath = path.join(
          outputDir,
          relativePath,
          `${name}${template.ext}`,
        )
        fs.writeFileSync(
          targetPath,
          template.apply({
            pathToRoot: path.relative(targetPath, cwd).replace(/\.\.$/, ''),
            source: source.replace(/`/g, '\\`'),
          }),
          {
            encoding: 'utf8',
          },
        )
        console.log('Generated file at', targetPath)
      }
    },
  )

  return metaTree
}
