const mainRendererUrlLoadPlugin = require('./mainRendererUrlLoadPlugin')
const config                    = require('./config')

const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
    new mainRendererUrlLoadPlugin(`'http://localhost:${config.port}/app.html'`)
)

module.exports = webpackConfig
