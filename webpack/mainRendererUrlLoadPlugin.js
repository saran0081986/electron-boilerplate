const webpackSources = require('webpack-sources')

module.exports = function (url) {
    this.apply = compiler => {
        compiler.plugin('emit', (compilation, compileCallback) => {
            const assets         = compilation.assets
            const asset          = assets['main.js']
            const processedAsset = asset.source()
                                        .toString()
                                        .replace('/*RENDERER-URL-LOAD*/', url)
            
            assets['main.js'] = new webpackSources.RawSource(processedAsset)
            
            compileCallback()
        })
    }
}
