/**
 * @file Main development webpack configuration.
 */

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

/**
 * Plugin used to set the renderer window url in main.
 */
const MainDataInjectorPlugin = require('./mainDataInjectorPlugin')
/**
 * Common configuration variables.
 * @type {Object}
 */
const config = require('./config')

/**
 * Main base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
  new MainDataInjectorPlugin([
    {
      comment: '/*INJECT-RENDERER-URL*/',
      data: `'http://localhost:${config.port}/app.html'`
    },
    {
      comment: '/*INJECT-DEVTOOLS-INSTALLER*/',
      data: `const edi = require('electron-devtools-installer')`
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
