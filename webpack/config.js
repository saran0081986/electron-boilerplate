/**
 * @file Common configuration variables.
 */

/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')

module.exports = {
  debug: process.env.NODE_ENV === 'development',
  port: 8080,
  output: `${root}/build`,
  outputPublicPath: './'
}
