/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const fs = require('fs-extra')
const pathType = require('path-type')
const path = require('path')

const extractConfig = configPath => {
  try {
    return fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))
      : {}
  } catch (err) {
    console.log(`Config file "${configPath}" is invalid`)
  }
  return {}
}

const processDirectory = (dirPath, state, isRoot) => {
  const dirName = path.basename(dirPath)
  const config = extractConfig(path.join(dirPath, 'config.json'))
  const nextState = Object.assign({}, state, {
    relativePath: isRoot ? '' : `${state.relativePath}/${dirName}`,
  })
  if (config.template) {
    nextState.template = config.template
  }
  const directory = {
    config,
    templateName: nextState.template,
  }
  if (!isRoot) {
    directory.name = dirName
    directory.path = dirPath
    directory.relativePath = nextState.relativePath
    directory.type = 'directory'
  } else {
    directory.type = 'root'
  }
  return {
    directory,
    nextState,
  }
}

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
        const config = extractConfig(
          path.join(currentDirPath, `${name}.config.json`),
        )
        reduceAcc.files = reduceAcc.files || []
        reduceAcc.files.push({
          ext,
          config,
          name,
          path: currentDirOrFilePath,
          relativePath: state.relativePath,
          templateName: config.template || state.template,
          type: 'file',
        })
        return reduceAcc
      }

      if (pathType.dirSync(currentDirOrFilePath)) {
        reduceAcc.directories = reduceAcc.directories || []
        const { directory, nextState } = processDirectory(
          currentDirOrFilePath,
          state,
        )
        reduceAcc.directories.push(
          traverse(currentDirOrFilePath, nextState, directory),
        )
        return reduceAcc
      }

      return reduceAcc
    }, traverseAcc)
  }
  const initialState = { template: 'default', relativePath: '' }
  const { directory, nextState } = processDirectory(
    inputDir,
    initialState,
    true,
  )
  return traverse(inputDir, nextState, directory)
}

module.exports = extractMetaTree
