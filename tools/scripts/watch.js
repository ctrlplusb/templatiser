const rimraf = require('rimraf')
const { exec } = require('../utils')

rimraf.sync('dist')

const nodeEnv = Object.assign({}, process.env, {
  NODE_ENV: 'production',
})

exec('npx babel src --watch --out-dir dist --ignore spec.js,test.js', nodeEnv)
