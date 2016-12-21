const glob = require('glob')

const root      = require('./root')
const htmlFiles = glob.sync(`${root}/src/*.@(html|pug)`)

const uglifyjs = {
    compress: {
        warnings: false
    },
    comments: false
}

module.exports = {
    browsers          : ['last 2 version'],
    debug             : process.env.NODE_ENV === 'development',
    port              : 8080,
    historyApiFallback: false,
    entry             : {
        app: [`${root}/src/js/app.js`, ...htmlFiles]
    },
    output            : `${root}/build/`,
    outputPublicPath  : './',
    loaders           : {
        sass: {
            includePaths: [
                ...require('bourbon').includePaths,
                `${root}/src/css`
            ],
            indentWidth : 4,
            outputStyle : 'expanded'
        }
    },
    optimize          : {
        cssnano     : {
            safe: true
        },
        htmlminifier: {
            collapseBooleanAttributes : true,
            collapseWhitespace        : true,
            html5                     : true,
            minifyCSS                 : true,
            minifyJS                  : uglifyjs,
            processConditionalComments: true,
            quoteCharacter            : '\"',
            removeComments            : true,
            removeEmptyAttributes     : true,
            removeRedundantAttributes : true
        },
        imagemin    : {
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
            svgo    : {
                optimizationLevel: 5
            }
        },
        uglifyjs
    }
}
