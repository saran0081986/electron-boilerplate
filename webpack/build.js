const compileHTMLFile = require('./compileHTMLFile')
const glob            = require('glob')
const webpack         = require('webpack')

const config        = require('./config')
const root          = require('./root')
const webpackConfig = require('./webpack.build')

glob(`${root}/src/*.@(html|pug)`, (err, matches) => {
    if (err) {
        throw err
    }

    matches.forEach(file => compileHTMLFile(file))
})

webpack(webpackConfig, function (err, stats) {
    if (err) {
        throw err
    }

    process.stdout.write(stats.toString({
                                            colors      : true,
                                            modules     : false,
                                            children    : false,
                                            chunks      : false,
                                            chunkModules: false
                                        }) + '\n')
})
