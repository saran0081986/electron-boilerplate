/**
 * @file Main build webpack configuration.
 */

const DataInjectorPlugin = require('./dataInjectorPlugin')

/**
 * Main base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
  new DataInjectorPlugin('index.js', [
    {
      comment: '/*INJECT-RENDERER-URL*/',
      // eslint-disable-next-line
      data: '`file:///${__dirname}/renderer/index.html`'
    }
  ])
)

module.exports = webpackConfig
