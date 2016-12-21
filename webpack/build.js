const webpack = require('webpack')

const config        = require('./config')
const root          = require('./root')
const webpackConfig = require('./webpack.build')

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
