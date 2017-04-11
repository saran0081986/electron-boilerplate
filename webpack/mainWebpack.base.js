/**
 * @file Main base webpack configuration.
 */

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

module.exports = {
  target: 'electron',
  node: { // Do not export these variables.
    __dirname: false,
    __filename: false
  },
  externals: [require('webpack-node-externals')()], // Do not export node dependencies.
  entry: {
    main: `${root}/src/main/index.js`
  },
  output: {
    path: config.output,
    filename: '[name].js',
    publicPath: config.outputPublicPath
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [],
  performance: {
    hints: config.debug ? false : 'warning'
  }
}
