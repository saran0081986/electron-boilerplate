const config   = require('./config')
const packager = require('electron-packager')
const yarn     = require('yarn-install')

const root = require('./root')

const packagerOptions = {
    dir            : config.output,
    out            : `${root}/packages`,
    tmpdir         : `${root}/tmp`,
    platform       : 'win32',
    arch           : 'x64',
    asar           : true,
    ignore         : [
        '.yarn-integrity',
        'empty'
    ],
    name           : 'electron-boilerplate',
    icon           : null,
    'app-copyright': 'Copyright (C) 2016 Maxwellewxam.',
    win32metadata  : {
        CompanyName     : 'Maxwellewxam',
        FileDescription : 'Electron Boilerplate',
        InternalName    : null,
        OriginalFilename: 'electron-boilerplate.exe',
        ProductName     : 'Electron Boilerplate'
    }
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
