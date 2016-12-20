const webpack                 = require('webpack')
const config                  = require('./config')
const ExtractTextPlugin       = require('extract-text-webpack-plugin')
const ImageminPlugin          = require('imagemin-webpack-plugin').default
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressBarPlugin       = require('progress-bar-webpack-plugin')

const root = require('./root')

const webpackConfig = require('./webpack.base')

webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].css'),
    new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }),
    new webpack.optimize.UglifyJsPlugin(config.uglifyJsConfig),
    new ImageminPlugin({
        gifsicle: {
            interlaced       : true,
            optimizationLevel: 3
        },
        jpegtran: {
            progressive: true
        },
        optipng : {
            optimizationLevel: 5
        },
        svgo    : {}
    }),
    new ProgressBarPlugin()
)

webpackConfig.module.rules.forEach(rule => {
    if (rule.loaders && rule.loaders.includes('css-loader')) {
        rule.loader = ExtractTextPlugin.extract(rule.loaders)
        delete rule['loaders']
    }
})

module.exports = webpackConfig
