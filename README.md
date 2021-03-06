# Electron Boilerplate - TEMPORARILY NOT MAINTAINED (06/10/2018)
Based on [Front Boilerplate 4.3.8](https://github.com/Maxwellewxam/front-boilerplate/releases/tag/4.3.8).

[![GitHub release](https://img.shields.io/github/release/Maxwellewxam/electron-boilerplate.svg?style=flat-square)](https://github.com/Maxwellewxam/electron-boilerplate/releases)
[![Travis](https://img.shields.io/travis/Maxwellewxam/electron-boilerplate.svg?style=flat-square)](https://travis-ci.org/Maxwellewxam/electron-boilerplate)
[![Code Climate](https://img.shields.io/codeclimate/github/Maxwellewxam/electron-boilerplate.svg?style=flat-square)](https://codeclimate.com/github/Maxwellewxam/electron-boilerplate)
[![David](https://img.shields.io/david/dev/Maxwellewxam/electron-boilerplate.svg?style=flat-square)](https://github.com/Maxwellewxam/electron-boilerplate/blob/master/package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/Maxwellewxam/electron-boilerplate.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/Maxwellewxam/electron-boilerplate.svg?style=flat-square)](https://github.com/Maxwellewxam/electron-boilerplate/blob/master/LICENSE)

## Included
[SCSS](http://sass-lang.com), ES6 with [Babel](http://babeljs.io), [Pug](http://pugjs.org).
### Building
Build is done with [Webpack](http://webpack.js.org).
### Linting
Linting with [ESLint](http://eslint.org), following [Standard](http://standardjs.com) rules, [StyleLint](http://stylelint.io), [HTMLHint](http://htmlhint.com/) and [Pug-lint](http://github.com/pugjs/pug-lint).
### Testing
Unit testing with [Mocha](http://mochajs.org), run by [Karma](http://karma-runner.github.io) for renderer or [electron-mocha](https://github.com/jprichardson/electron-mocha) for main.
Coverage reports are generated by [Istanbul](http://istanbul.js.org) (currently only for renderer).
End to end testing is not yet implemented.
### Integrations
This project provides integrations with:
  - [Git](http://git-scm.com)
  - [GitLab](http://gitlab.com)
  - [Travis CI](http://travis-ci.org)
  - [Code Climate](http://codeclimate.com)
  - [SonarQube](http://sonarqube.org)
  - [Electron](http://electron.atom.io)

It can be adapted for:
  - [VueJS](http://vuejs.org) ([Gist](http://gist.github.com/Maxwellewxam/1c000503b2e6a585ce34991c414c8c30))

## Configuration
If not using tests:
  - remove testing related uses in CI files
  - remove following dependencies:
    - babel-register
    - electron-mocha
    - istanbul-instrumenter-loader
    - karma
    - karma-coverage-istanbul-reporter
    - karma-electron
    - karma-mocha
    - karma-mocha-reporter
    - karma-webpack
    - mocha

Uncomment 'yarn.lock' file copy in `webpack/build.js`.

Remove commented paths in:
  - .eslintignore
  - .stylelintignore

Update values in:
  - sonar-project.properties
