/**
 * @file Main build webpack configuration.
 */

/**
 * Plugin used to set the renderer window url in main.
 */
const MainDataInjectorPlugin = require('./mainDataInjectorPlugin')

/**
 * Main base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
  new MainDataInjectorPlugin([
    {
      comment: '/*INJECT-RENDERER-URL*/',
      // eslint-disable-next-line
      data: '`file:///${__dirname}/renderer/app.html`'
    }
  ])
)

module.exports = webpackConfig
