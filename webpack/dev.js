/**
 * @file Dev script.
 */

const chokidar = require('chokidar')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

/**
 * Common configuration variables.
 * @type {Object}
 */
const config = require('./config')
/**
 * Renderer configuration variables.
 * @type {Object}
 */
const rendererConfig = require('./rendererConfig')
/**
 * Renderer development webpack configuration.
 * @type {Object}
 */
const rendererWebpackConfig = require('./rendererWebpack.dev.js')
/**
 * Main development webpack configuration.
 * @type {Object}
 */
const mainWebpackConfig = require('./mainWebpack.dev.js')
/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')

// Reloads browser if updated file is HTML.
rendererWebpackConfig.plugins.push(function () {
  this.plugin('after-emit', (compilation, compileCallback) => {
    for (const assetName in compilation.assets) {
      if (compilation.assets.hasOwnProperty(assetName) &&
        assetName.match(/\.html$/) && compilation.assets[assetName].emitted) {
        hotMiddleware.publish({action: 'reload'})
      }
    }

    compileCallback()
  })
})

const compiler = webpack(rendererWebpackConfig)
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log () { /* No-op block */ }
})

// Webpack server is used for development.
const server = new WebpackDevServer(compiler, {
  contentBase: config.output,
  hot: true,
  historyApiFallback: rendererConfig.historyApiFallback,
  quiet: true,
  noInfo: false,
  publicPath: rendererWebpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

server.use(hotMiddleware)

server.listen(config.port, err => {
  if (err) {
    throw err
  }

  process.stdout.write(`Listening on ${config.port} \n\n`)
})

// Rebuilds main on modifications.
chokidar.watch(`${root}/src/main/**/*.js`)
        .on('all', () => {
          webpack(mainWebpackConfig, err => {
            if (err) {
              throw err
            }
          })
        })
