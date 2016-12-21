const webpack          = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config        = require('./config')
const webpackConfig = require('./webpack.dev')
const root          = require('./root')

webpackConfig.plugins.push(function () {
    this.plugin('after-emit', (compilation, compileCallback) => {
        Object.keys(compilation.assets)
              .some(assetName => {
                  if (assetName.match(/\.html$/) && compilation.assets[assetName].emitted) {
                      hotMiddleware.publish({action: 'reload'})
                      return true
                  }
              })
        
        compileCallback()
    })
})
const compiler      = webpack(webpackConfig)
const hotMiddleware = require('webpack-hot-middleware')(compiler)

const server = new WebpackDevServer(compiler, {
    contentBase       : config.output,
    hot               : true,
    historyApiFallback: config.historyApiFallback,
    quiet             : false,
    noInfo            : false,
    publicPath        : webpackConfig.output.publicPath,
    stats             : {
        colors: true,
        chunks: false
    }
})

server.use(hotMiddleware)

server.listen(config.port, err => {
    if (err) {
        console.log(err)
        return
    }
    
    console.log(`Listening on ${config.port}`)
})
