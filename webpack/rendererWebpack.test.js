/**
 * @file Renderer testing webpack configuration.
 */

/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')
/**
 * Base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./rendererWebpack.base')

delete webpackConfig.entry
delete webpackConfig.output
delete webpackConfig.plugins

webpackConfig.devtool = 'inline-source-map'

webpackConfig.module.rules.push(
  // Add coverage report generation configuration.
  {
    enforce: 'post',
    test: /\.js$/,
    loader: 'istanbul-instrumenter-loader',
    include: `${root}/src/renderer/js`,
    exclude: [/node_modules/]
  },
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
