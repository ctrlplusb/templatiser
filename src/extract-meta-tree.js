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

const processDirectory = (dirPath, parentState, isRoot) => {
  const dirName = path.basename(dirPath)
  const config = Object.assign(
    {},
    parentState.config.directories && parentState.config.directories[dirName]
      ? parentState.config.directories[dirName]
      : {},
    extractConfig(path.join(dirPath, 'config.json')),
  )
  const state = Object.assign({}, parentState, {
    config,
    relativePath: isRoot ? '' : `${parentState.relativePath}/${dirName}`,
    depth: parentState.depth + 1,
  })
  if (config.template) {
    state.template = config.template
  }
  const directory = {
    config,
    depth: state.depth,
    templateName: state.template,
  }
  if (!isRoot) {
    directory.name = dirName
    directory.path = dirPath
    directory.relativePath = state.relativePath
    directory.type = 'directory'
  } else {
    directory.type = 'root'
  }
  return {
    directory,
    state,
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
        const config = Object.assign(
          {},
          state.config.files && state.config.files[dirOrFileName]
            ? state.config.files[dirOrFileName]
            : {},
          extractConfig(path.join(currentDirPath, `${name}.config.json`)),
        )
        reduceAcc.files = reduceAcc.files || []
        reduceAcc.files.push({
          ext,
          config,
          depth: state.depth,
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
        const { directory, state: dirState } = processDirectory(
          currentDirOrFilePath,
          state,
        )
        reduceAcc.directories.push(
          traverse(currentDirOrFilePath, dirState, directory),
        )
        return reduceAcc
      }

      return reduceAcc
    }, traverseAcc)
  }
  const initialState = {
    config: {},
    depth: -1,
    template: 'default',
    relativePath: '',
  }
  const { directory, state } = processDirectory(inputDir, initialState, true)
  return traverse(inputDir, state, directory)
}

module.exports = extractMetaTree
