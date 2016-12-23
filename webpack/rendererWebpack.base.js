const webpack        = require('webpack')
const config         = require('./config')
const rendererConfig = require('./rendererConfig')

const root    = require('./root')
const postcss = [
    require('autoprefixer')({
                                rendererConfig: config.browsers
                            }),
    require('css-mqpacker')()
]
const loaders = {
    html: [
        'file-loader?name=[name].html',
        `extract-loader?publicPath=${config.outputPublicPath}`
    ],
    css : [
        'css-loader',
        'postcss-loader'
    ]
}

module.exports = {
    target     : 'electron-renderer',
    entry      : rendererConfig.entry,
    output     : {
        path      : rendererConfig.output,
        filename  : 'js/[name].js',
        publicPath: config.outputPublicPath
    },
    module     : {
        rules: [
            {
                test   : /\.js$/,
                loader : 'babel-loader',
                exclude: [/node_modules/]
            },
            {
                test   : /\.scss$/,
                loaders: [...loaders.css, 'sass-loader']
            },
            {
                test   : /\.css$/,
                loaders: loaders.css
            },
            {
                test  : /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                query : {
                    limit: 5000,
                    name : 'img/[name].[ext]'
                }
            },
            {
                test  : /\.(woff2?|eot|ttf|otf)$/,
                loader: 'url-loader',
                query : {
                    limit: 5000,
                    name : 'font/[name].[ext]'
                }
            },
            {
                test  : /\.json$/,
                loader: 'json-loader'
            },
            {
                test   : /\.pug$/,
                loaders: [...loaders.html, 'pug-html-loader?pretty=    ']
            },
            {
                test   : /\.html$/,
                loaders: [...loaders.html, 'html-loader']
            }
        ]
    },
    plugins    : [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss,
                sassLoader: rendererConfig.loaders.sass
            }
        }),
        new webpack.WatchIgnorePlugin([
            `${root}/build/`,
            `${root}/node_modules/`,
            `${root}/webpack/`
        ])
    ],
    devServer  : {
        headers: {'Access-Control-Allow-Origin': '*'}
    },
    performance: {
        hints: config.debug ? false : 'warning'
    }
}
