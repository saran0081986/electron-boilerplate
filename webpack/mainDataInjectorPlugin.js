/**
 * @file Plugin used to inject data via comments (like INJECT-RENDERER-URL) in main.
 */

const webpackSources = require('webpack-sources')

module.exports = function (injectors) {
  this.apply = compiler => {
    compiler.plugin('emit', (compilation, compileCallback) => {
      const assets = compilation.assets
      let asset = assets['main.js'].source()
                                   .toString()
      injectors.forEach(injector => {
        asset = asset.replace(injector.comment, injector.data)
      })

      assets['main.js'] = new webpackSources.RawSource(asset)

      compileCallback()
    })
  }
}
