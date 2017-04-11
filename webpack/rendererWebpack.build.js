/**
 * @file Webpack renderer build configuration.
 */

const webpackSources = require('webpack-sources')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

/**
 * Renderer configuration variables.
 * @type {Object}
 */
const rendererConfig = require('./rendererConfig')
/**
 * Renderer base webpack configuration.
 * @type {Object}
 */
const webpackConfig = require('./rendererWebpack.base')

webpackConfig.plugins.push(
  new ExtractTextPlugin('css/[name].css'), // Extracts CSS chunks.
  function () {
    this.plugin('emit', (compilation, compileCallback) => {
      // Generates CSS load code for each extracted CSS chunks.
      const assets = compilation.assets

      let cssChunksLoad = ''
      compilation.chunks.forEach(chunk => {
        cssChunksLoad += `<link rel="stylesheet" type="text/css" href="css/${chunk.name}.css">`
      })

      // Looks for HTML assets.
      const htmlAssetNames = []
      for (const assetName in assets) {
        if (assets.hasOwnProperty(assetName) && assetName.match(/\.html$/)) {
          htmlAssetNames.push(assetName)
        }
      }

      // Adds CSS load code to each HTML assets.
      htmlAssetNames.forEach(htmlAssetName => {
        const asset = assets[htmlAssetName]
        const processedHtml = asset.source()
                                   .toString()
                                   .replace('<!--CSS-CHUNKS-LOAD-->', cssChunksLoad)
        assets[htmlAssetName] = new webpackSources.RawSource(processedHtml)
      })

      compileCallback()
    })
  },
  new ImageminPlugin(rendererConfig.optimize.imagemin),
  new ProgressBarPlugin()
)

webpackConfig.module.rules.forEach(rule => {
  // Marks all CSS rules to extract their result.
  if (rule.use && rule.use.includes('css-loader')) {
    rule.loader = ExtractTextPlugin.extract({use: rule.use})
    delete rule['use']
  }
  // Fixes the path to url-loaded assets since by default it is relative to the HTML files (now it's relative to the
  // CSS files).
  if (rule.loader && rule.loader === 'url-loader') {
    rule.query.publicPath = `../`
  }
})

module.exports = webpackConfig
