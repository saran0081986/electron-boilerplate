const chokidar         = require('chokidar')
const webpack          = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config                = require('./config')
const rendererConfig        = require('./rendererConfig')
const rendererWebpackConfig = require('./rendererWebpack.dev.js')
const root                  = require('./root')

rendererWebpackConfig.plugins.push(function () {
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

const compiler      = webpack(rendererWebpackConfig)
const hotMiddleware = require('webpack-hot-middleware')(compiler)

const server = new WebpackDevServer(compiler, {
    contentBase       : config.output,
    hot               : true,
    historyApiFallback: rendererConfig.historyApiFallback,
    quiet             : false,
    noInfo            : false,
    publicPath        : rendererWebpackConfig.output.publicPath,
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

chokidar.watch(`${root}/src/main/**/*.js`)
        .on('all', function () {
            webpack(require('./mainWebpack.dev'), (err, stats) => {
                if (err) {
                    throw err
                }
        
                process.stdout.write(stats.toString({
                                                        colors      : true,
                                                        modules     : false,
                                                        children    : false,
                                                        chunks      : false,
                                                        chunkModules: false
                                                    }) + '\n')
            })
        })
