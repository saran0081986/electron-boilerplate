const webpack = require('webpack')
const config  = require('./config')

const root = require('./root')

const webpackConfig = require('./rendererWebpack.base')

webpackConfig.output.publicPath = `http://localhost:${config.port}/`

Object.keys(webpackConfig.entry)
      .forEach(key => {
          webpackConfig.entry[key] = [`${root}/webpack/server-client`, ...webpackConfig.entry[key]]
      })

webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
)

webpackConfig.module.rules.forEach(rule => {
    if (rule.use && rule.use.includes('css-loader')) {
        rule.use = ['style-loader', ...rule.use]
    }
})

module.exports = webpackConfig
