const config  = require('./config')
const fs      = require('fs')
const glob    = require('glob')
const htmlmin = require('htmlmin')
const pug     = require('pug')

const root = require('./root')

module.exports = {
    file (path, minify = true, callback = null) {
        if (!callback) {
            callback = function () {
            }
        }
        const filename     = /\w+\.(html|pug)$/.exec(path)[0]
        const isPug        = filename.slice(-3) == 'pug'
        let outputFilePath = config.output + filename
        fs.readFile(path, 'utf8', (err, content) => {
            if (err) {
                throw err
            }

            if (isPug) {
                content        = pug.render(content, {
                    filename: path,
                    pretty  : '    '
                })
                outputFilePath = outputFilePath.slice(0, -3) + 'html'
            }
            if (minify) {
                content = htmlmin(content, {
                    html5                     : true,
                    collapseWhitespace        : true,
                    removeComments            : true,
                    minifyCSS                 : true,
                    minifyJS                  : config.uglifyJsConfig,
                    processConditionalComments: true,
                    quoteCharacter            : "\"",
                    removeEmptyAttributes     : true,
                    removeRedundantAttributes : true,
                    collapseBooleanAttributes : true
                })
            }

            fs.writeFile(outputFilePath, content, err => {
                if (err) {
                    throw err
                }
                callback(outputFilePath)
            })
        })
    },
    allFiles () {
        const that = this

        glob(`${root}/src/*.@(html|pug)`, (err, matches) => {
            if (err) {
                throw err
            }

            matches.forEach(path => that.file(path))
        })
    }
}
