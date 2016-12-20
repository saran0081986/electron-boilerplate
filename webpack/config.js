const root = require('./root')

module.exports = {
    browsers          : ['last 2 version'],
    debug             : process.env.NODE_ENV === 'development',
    entry             : {
        app: [`${root}/src/js/main.js`]
    },
    historyApiFallback: false,
    uglifyJsConfig    : {
        compress: {
            warnings: false
        },
        comments: false
    },
    output            : `${root}/build/`,
    outputPublicPath  : './',
    port              : 8080,
    sassIncludePaths  : [
        ...require('bourbon').includePaths,
        `${root}/src/css`
    ]
}
