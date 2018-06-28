const { inInstall } = require('in-publish')
const rimraf = require('rimraf')
const { exec } = require('../utils')

if (inInstall()) {
  process.exit(0)
}

rimraf.sync('dist')

const nodeEnv = Object.assign({}, process.env, {
  NODE_ENV: 'production',
})

exec('npx babel src --out-dir dist --ignore spec.js,test.js', nodeEnv)
