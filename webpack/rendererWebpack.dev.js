const webpack = require('webpack')
const config  = require('./config')

const root = require('./root')

const webpackConfig = require('./rendererWebpack.base')

webpackConfig.output.publicPath = `http://localhost:${config.port}/`
webpackConfig.output.path       = `${root}/tmp`

Object.keys(webpackConfig.entry)
      .forEach(key => {
          webpackConfig.entry[key] = [`${root}/webpack/server-client`, ...webpackConfig.entry[key]]
      })

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
