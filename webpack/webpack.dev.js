const webpack = require('webpack')
const config  = require('./config')

const root = require('./root')

let webpackConfig = require('./webpack.base')

webpackConfig.output.publicPath = `http://localhost:${config.port}/`
webpackConfig.output.path       = `${root}/tmp`

for (let name in webpackConfig.entry) {
    webpackConfig.entry[name] = [`${root}/webpack/server-client`, ...webpackConfig.entry[name]]
}

webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
)

webpackConfig.module.rules.forEach(rule => {
    if (rule.loaders && rule.loaders.includes('css-loader')) {
        rule.loaders = ['style-loader', ...rule.loaders]
    }
})

module.exports = webpackConfig
