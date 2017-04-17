/**
 * @file Plugin used to inject data via comments (like INJECT-RENDERER-URL).
 */

const webpackSources = require('webpack-sources')

module.exports = function (assetName, injectors) {
  this.apply = compiler => {
    compiler.plugin('emit', (compilation, compileCallback) => {
      const assets = compilation.assets
      let asset = assets[assetName].source()
                                   .toString()
      injectors.forEach(injector => {
        asset = asset.replace(injector.comment, injector.data)
      })

      assets[assetName] = new webpackSources.RawSource(asset)

      compileCallback()
    })
  }
}
