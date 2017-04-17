/**
 * @file Renderer karma runner configuration.
 */

/**
 * Renderer testing webpack configuration.
 * @type {Object}
 */
const webpack = require('./webpack/rendererWebpack.test')

module.exports = config => {
  config.set({
    // Webpack configuration.
    webpack,
    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: '',
    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter.
    frameworks: ['mocha'],
    // List of files / patterns to load in the browser.
    files: [
      'tests/renderer/**/*.spec.js'
    ],
    // List of files to exclude.
    exclude: [],
    // Preprocess matching files before serving them to the browser.
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor.
    preprocessors: {
      'tests/renderer/**/*.spec.js': ['electron', 'webpack']
    },
    // Webpack middleware configuration.
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true
      }
    },
    // Test results reporter to use.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter.
    reporters: ['mocha', 'coverage-istanbul'],
    // Coverage configuration.
    coverageIstanbulReporter: {
      // Clover: used by SonarQube.
      // lcov: used by Code Climate.
      reports: ['clover', 'lcovonly', 'html'],
      dir: 'coverage/renderer',
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      fixWebpackSourcePaths: true
    },
    // Web server port.
    port: 9876,
    // Enable / disable colors in the output (reporters and logs).
    colors: true,
    // Level of logging.
    // Possible values: config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO or config.LOG_DEBUG.
    logLevel: config.LOG_INFO,
    // Enable / disable watching file and executing tests whenever any file changes.
    autoWatch: false,
    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher.
    browsers: ['Electron'],
    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    // Concurrency level.
    // How many browser should be started simultaneous.
    concurrency: Infinity
  })
}
