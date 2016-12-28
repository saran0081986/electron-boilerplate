const config   = require('./config')
const packager = require('electron-packager')
const yarn     = require('yarn-install')

const root            = require('./root')
const packagerOptions = require(`${root}/pack.json`)

packagerOptions.dir    = config.output
packagerOptions.out    = `${root}/packages`
packagerOptions.tmpdir = `${root}/tmp`
if (packagerOptions.icon === '') {
    packagerOptions.icon = null
} else {
    packagerOptions.icon = `${root}/${packagerOptions.icon}`
}

const yarnResult = yarn({cwd: config.output})

if (yarnResult.error) {
    throw yarnResult.error
}

packager(packagerOptions, err => {
    if (err) {
        throw err
    }
})
