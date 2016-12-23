const mainRendererUrlLoadPlugin = require('./mainRendererUrlLoadPlugin')

const webpackConfig = require('./mainWebpack.base')

webpackConfig.plugins.push(
    new mainRendererUrlLoadPlugin('`file:///${__dirname}/renderer/app.html`')
)

module.exports = webpackConfig
