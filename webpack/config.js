module.exports = {
    debug           : process.env.NODE_ENV === 'development',
    port            : 8080,
    outputPublicPath: './',
    optimize        : {
        imagemin: {
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
        }
    }
}
