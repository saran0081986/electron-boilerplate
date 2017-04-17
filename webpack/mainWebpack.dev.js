/**
 * @file Main development webpack configuration.
 */

const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const DataInjectorPlugin = require('./dataInjectorPlugin')

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
 * Main base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
  new DataInjectorPlugin('index.js', [
    {
      comment: '/*INJECT-RENDERER-URL*/',
      data: `'http://localhost:${config.port}/index.html'`
    },
    {
      comment: '/*INJECT-DEVTOOLS-INSTALLER*/',
      data: `require('electron').BrowserWindow
                                .addDevToolsExtension(
                                  '${path.normalize(root + '/node_modules/devtron').replace(/\\/g, '\\\\')}')
             const edi = require('electron-devtools-installer')`
    }
  ]),
  new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    compilationSuccessInfo: {
      messages: ['Main \n']
    }
  })
)

webpackConfig.module.rules.push(
  // Adds ESLint linting.
  {
    enforce: 'pre',
    test: /\.js$/,
    loader: 'eslint-loader',
    options: {
      emitWarning: true,
      formatter: require('eslint-formatter-pretty')
    },
    exclude: [/node_modules/]
  })

module.exports = webpackConfig
