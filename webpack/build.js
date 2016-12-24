const fs      = require('fs')
const webpack = require('webpack')

const config        = require('./config')
const root          = require('./root')
const webpackConfig = [
    require('./rendererWebpack.build'),
    require('./mainWebpack.build')
]

webpack(webpackConfig, (err, stats) => {
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

const packageFile = require(`${root}/package.json`)
packageFile.main  = 'main.js'
delete packageFile.scripts.pack
packageFile.scripts.start = 'electron .'
delete packageFile.devDependencies
fs.writeFile(`${config.output}/package.json`, JSON.stringify(packageFile, null, 4))
fs.readFile(`${root}/yarn.lock`, (err, data) => {
    if (err) {
        throw err
    }
    
    fs.writeFile(`${config.output}/yarn.lock`, data)
})
