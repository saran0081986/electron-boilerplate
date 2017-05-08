/**
 * @file Renderer configuration variables.
 */

const glob = require('glob')

/**
 * Common configuration variables.
 */
const config = require('./config')
/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')
/**
 * HTML files.
 * @type {Array}
 */
const htmlFiles = glob.sync(`${root}/src/renderer/*.@(html|pug)`)

const uglifyjs = {
  compress: {
    warnings: false
  },
  comments: false
}

module.exports = {
  browsers: ['Chrome >= 56'], // Electron's browser compatibility.
  entry: {
    index: [`${root}/src/renderer/js/index.js`, ...htmlFiles] // Adds HTML files (or equivalent) as entry points.
  },
  output: `${config.output}/renderer`,
  historyApiFallback: false,
  loaders: {
    // sass-loader options.
    sass: {
      includePaths: [
        ...require('bourbon').includePaths, // Bourbon files' path.
        `${root}/src/renderer/css`
      ],
      indentWidth: 2,
      outputStyle: 'expanded'
    }
  },
  optimize: {
    cssnano: {
      safe: true
    },
    htmlminifier: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      minifyJS: uglifyjs,
      processConditionalComments: true,
      quoteCharacter: '"',
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true
    },
    imagemin: {
      gifsicle: {
        interlaced: true,
        optimizationLevel: 3
      },
      jpegtran: {
        progressive: true
      },
      optipng: {
        optimizationLevel: 5
      },
      svgo: {
        optimizationLevel: 5
      }
    },
    uglifyjs
  }
}
