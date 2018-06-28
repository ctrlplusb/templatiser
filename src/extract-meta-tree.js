/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const fs = require('fs-extra')
const pathType = require('path-type')
const path = require('path')

const extractMetaTree = ({ allowedFiles, inputDir }) => {
  const traverse = (currentDirPath, state, traverseAcc) => {
    const results = fs.readdirSync(currentDirPath)
    return results.reduce((reduceAcc, dirOrFileName) => {
      const currentDirOrFilePath = path.join(currentDirPath, dirOrFileName)
      const ext = path.extname(dirOrFileName)
      if (
        pathType.fileSync(currentDirOrFilePath) &&
        allowedFiles.findIndex(x => x.toLowerCase() === ext) !== -1
      ) {
        const name = path.basename(currentDirOrFilePath, ext)
        const metaPath = path.join(currentDirPath, `${name}.meta.json`)

        const extractMetaData = () => {
          try {
            return JSON.parse(fs.readFileSync(metaPath, { encoding: 'utf8' }))
          } catch (err) {
            console.log(`Meta file "${metaPath}" is invalid JSON`)
          }
          return {}
        }

        const metaData = fs.existsSync(metaPath) ? extractMetaData() : {}
        reduceAcc.files = reduceAcc.files || []
        reduceAcc.files.push({
          ext,
          metaData,
          name,
          path: currentDirOrFilePath,
          relativePath: state.relativePath,
          templateName: metaData.template || state.template,
          type: 'file',
        })
        return reduceAcc
      } else if (pathType.dirSync(currentDirOrFilePath)) {
        reduceAcc.directories = reduceAcc.directories || []
        const metaPath = path.join(currentDirOrFilePath, '_meta.json')
        const metaData = fs.existsSync(metaPath)
          ? JSON.parse(fs.readFileSync(metaPath, { encoding: 'utf8' }))
          : {}
        const nextState = Object.assign({}, state, {
          template: metaData.template,
          relativePath: `${state.relativePath}/${dirOrFileName}`,
        })
        const directory = {
          metaData,
          name: dirOrFileName,
          path: currentDirOrFilePath,
          relativePath: nextState.relativePath,
          templateName: nextState.template,
          type: 'directory',
        }
        reduceAcc.directories.push(
          traverse(currentDirOrFilePath, nextState, directory),
        )
        return reduceAcc
      }
      return reduceAcc
    }, traverseAcc)
  }
  const initialState = { template: 'default', relativePath: '' }
  return traverse(inputDir, initialState, {})
}

module.exports = extractMetaTree
