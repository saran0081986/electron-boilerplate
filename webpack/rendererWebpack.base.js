/**
 * @file Renderer base webpack configuration.
 */

const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

/**
 * Common configuration variables.
 * @type {Object}
 */
const config = require('./config')
/**
 * Renderer configuration variables.
 * @type {Object}
 */
const rendererConfig = require('./rendererConfig')
/**
 * Absolute path to root folder.
 * @type {String}
 */
const root = require('./root')

/**
 * PostCSS plugins.
 * @type {Array}
 */
const postcss = [
  require('autoprefixer')({
    browsers: rendererConfig.browsers
  }),
  require('css-mqpacker')()
]
/**
 * Common loaders.
 * @type {Object}
 */
const loaders = {
  html: [
    `file-loader?context=${root}/src/renderer&name=[path][name].html`,
    `extract-loader?publicPath=${config.outputPublicPath}`,
    'html-loader'
  ],
  css: [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => postcss
      }
    }
  ]
}

module.exports = {
  target: 'electron-renderer',
  entry: rendererConfig.entry,
  output: {
    path: rendererConfig.output,
    filename: 'js/[name].js',
    publicPath: config.outputPublicPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.scss$/,
        use: [
          ...loaders.css,
          {
            loader: 'sass-loader',
            options: rendererConfig.loaders.sass
          }
        ]
      },
      {
        test: /\.css$/,
        use: loaders.css
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'font/[name].[ext]'
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.pug$/,
        use: [
          ...loaders.html,
          {
            loader: 'pug-html-loader',
            options: {
              pretty: '  '
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: loaders.html
      }
    ]
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      config.output,
      `${root}/node_modules/`,
      `${root}/webpack/`
    ]),
    new CopyWebpackPlugin(
      [
        // Static files copy.
        {
          from: {
            glob: `${root}/src/renderer/static/**/*`,
            dot: true
          },
          to: rendererConfig.output,
          context: `${root}/src/renderer/static`
        }
      ],
      {
        ignore: [
          'empty' // Ignore placeholder files.
        ]
      })
  ],
  performance: {
    hints: config.debug ? false : 'warning'
  }
}
