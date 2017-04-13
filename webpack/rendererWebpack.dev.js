/**
 * @file Renderer development webpack configuration.
 */

const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const concat = require('friendly-errors-webpack-plugin/src/utils').concat // Tool for custom Friendly Errors Webpack
                                                                          // Plugin formatter.
const StyleLintPlugin = require('stylelint-webpack-plugin')

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
 * Renderer base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./rendererWebpack.base')

webpackConfig.output.publicPath = `http://localhost:${config.port}/`

// Adds special browser code as entry point, see dev-client.js.
for (const key in webpackConfig.entry) {
  if (webpackConfig.entry.hasOwnProperty(key)) {
    webpackConfig.entry[key] = [`${root}/webpack/dev-client`, ...webpackConfig.entry[key]]
  }
}

webpackConfig.plugins.push(
  new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    compilationSuccessInfo: {
      messages: ['Renderer \n']
    },
    additionalTransformers: [
      function (error) { // StyleLint transformer.
        // Detects if error is thrown by StyleLint, may be unstable.
        if (typeof error.webpackError === 'string' &&
          (error.webpackError.indexOf('css') !== -1 || error.webpackError.indexOf('scss') !== -1)) {
          return Object.assign({}, error, {
            name: 'StyleLint error',
            type: 'stylelint-error'
          })
        }
        return error
      }
    ],
    additionalFormatters: [ // StyleLint formatter.
      function (errors) {
        const styleLintErrors = errors.filter(e => e.type === 'stylelint-error')
        // Formats error if it has been identified as a StyleLint error.
        if (styleLintErrors.length > 0) {
          const flatten = (accum, curr) => accum.concat(curr)
          return concat(
            styleLintErrors
            .map(error => [error.webpackError, ''])
            .reduce(flatten, [])
          )
        }
        return []
      }
    ]
  }),
  new StyleLintPlugin({
    emitErrors: false
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
)

webpackConfig.module.rules.forEach(rule => {
  // Adds style-loader to automatically inject styles in HTML.
  if (rule.use && rule.use.includes('css-loader')) {
    rule.use = ['style-loader', ...rule.use]
  }
})
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
