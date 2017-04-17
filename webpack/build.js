/**
 * @file Build script.
 */

const fs = require('fs')
const webpack = require('webpack')

/**
 * Common configuration variables.
 * @type {Object}
 */
const config = require('./config')
/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')
const webpackConfig = [
  /**
   * Renderer build webpack configuration.
   * @type {Object}
   */
  require('./rendererWebpack.build'),
  /**
   * Main build webpack configuration.
   * @type {Object}
   */
  require('./mainWebpack.build')
]

webpack(webpackConfig, (err, stats) => {
  if (err) {
    throw err
  }

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
})

// Copies package.json file.
const packageFile = require(`${root}/package.json`)
packageFile.main = 'index.js'
packageFile.scripts = {
  start: 'electron .'
}
delete packageFile.devDependencies
fs.writeFile(`${config.output}/package.json`, JSON.stringify(packageFile, null, 4))
// Copies yarn.lock file.
fs.readFile(`${root}/yarn.lock`, (err, data) => {
  if (err) {
    throw err
  }

  fs.writeFile(`${config.output}/yarn.lock`, data)
})
