const webpack = require('webpack')
const config  = require('./config')

const root = require('./root')

module.exports = {
    target     : 'electron',
    node       : {
        __dirname : false,
        __filename: false
    },
    externals: [require('webpack-node-externals')()],
    entry      : {
        main: `${root}/src/main/index.js`
    },
    output     : {
        path      : config.output,
        filename  : '[name].js',
        publicPath: config.outputPublicPath
    },
    module     : {
        rules: [
            {
                test  : /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins    : [],
    performance: {
        hints: config.debug ? false : 'warning'
    }
}
