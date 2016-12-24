const glob = require('glob')

const root      = require('./root')
const htmlFiles = glob.sync(`${root}/src/renderer/*.@(html|pug)`)

module.exports = {
    browsers          : ['Chrome >= 53'],
    entry             : {
        app: [`${root}/src/renderer/js/app.js`, ...htmlFiles]
    },
    output            : `${root}/build/renderer`,
    historyApiFallback: false,
    loaders           : {
        sass: {
            includePaths: [
                ...require('bourbon').includePaths,
                `${root}/src/renderer/css`
            ],
            indentWidth : 4,
            outputStyle : 'expanded'
        }
    }
}