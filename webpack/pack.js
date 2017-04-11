/**
 * @file Pack script.
 */

const packager = require('electron-packager')
const yarn = require('yarn-install')

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
/**
 * Packaging configuration variables.
 * @type {Object}
 */
const packagerOptions = require(`${root}/pack.json`)

// Sets packager options.
packagerOptions.dir = config.output
packagerOptions.out = `${root}/packages`
packagerOptions.tmpdir = `${root}/tmp`
if (packagerOptions.icon === '') {
  packagerOptions.icon = null
} else {
  packagerOptions.icon = `${root}/${packagerOptions.icon}`
}

// Installs dependencies using yarn.
const yarnResult = yarn({cwd: config.output})
if (yarnResult.error) {
  throw yarnResult.error
}

// Packs the app.
packager(packagerOptions, err => {
  if (err) {
    throw err
  }
})
