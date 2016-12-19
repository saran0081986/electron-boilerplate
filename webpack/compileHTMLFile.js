const config  = require('./config')
const fs      = require('fs')
const htmlmin = require('htmlmin')
const pug     = require('pug')

const root = require('./root')

module.exports = (path, minify = true, callback = null) => {
    if (!callback) {
        callback = function () {
        }
    }
    let filename = /\w+\.(html|pug)$/.exec(path)[0]
    let isPug    = filename.slice(-3) == 'pug'
    fs.readFile(path, 'utf8', (err, content) => {
        if (err) {
            throw err
        }

        if (isPug) {
            content  = pug.render(content, {
                filename: path,
                pretty  : '    '
            })
            filename = filename.slice(0, -3) + 'html'
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

        fs.writeFile(config.output + filename, content, callback)
    })
}
