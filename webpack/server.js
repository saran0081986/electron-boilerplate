const chokidar         = require('chokidar')
const compileHTMLFile  = require('./compileHTMLFile')
const webpack          = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config        = require('./config')
const webpackConfig = require('./webpack.dev')
const compiler      = webpack(webpackConfig)
const root          = require('./root')

const hotMiddleware = require('webpack-hot-middleware')(compiler)

const HTMLFileChanged = path => {
    console.log(`-> ${path} changed`)
    compileHTMLFile.file(path, false, () => {
        hotMiddleware.publish({action: 'reload'})
    })
}

compileHTMLFile.allFiles()

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

    chokidar.watch(`${root}/src/*.@(html|pug)`)
            .on('change', HTMLFileChanged)
    console.log(`Listening on ${config.port}`)
})
