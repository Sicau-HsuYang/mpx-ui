const path = require('path')
const utils = require('./utils')
const config = require('../config/index')
const vueLoaderConfig = require('./vue-loader.conf')
const { VueLoaderPlugin } = require('vue-loader')
const TransformModulesPlugin = require('webpack-transform-modules-plugin')
const BabelRulePlugin = require('@didi/babel-rule-plugin')
const webpack = require('webpack')
const MpxWebpackPlugin = require('@mpxjs/webpack-plugin')
const mpxWebpackPluginConfig = require('./mpx.plugin.conf')
const KjsWebpackPlugin = require('@didi/kjs-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const mpxLoaderConfig = {
  transRpxRules: {
    mode: 'only',
    comment: 'use rpx',
    include: resolve('src')
  }
}

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: utils.getEntrys('script'),

  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.mpx', '.vue'],
    alias: {
      '@': resolve('src')
    }
  },

  module: {
    rules: [
      ...utils.styleRules(),
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          resolve('src'),
          resolve('test')
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.mpx$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              transformToRequire: {
                'mpx-image': 'src',
                'mpx-audio': 'src',
                'mpx-video': 'src'
              }
            }
          },
          MpxWebpackPlugin.loader(mpxLoaderConfig)
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('lib'),
          resolve('node_modules/webpack-dev-server'),
          resolve('node_modules/@didi'),
          resolve('node_modules/@mpxjs')
        ]
      },
      {
        test: /\.json$/,
        resourceQuery: /__component/,
        type: 'javascript/auto'
      },
      {
        test: /\.(wxs|qs|sjs|filter\.js)$/,
        loader: MpxWebpackPlugin.wxsPreLoader(),
        enforce: 'pre'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: MpxWebpackPlugin.urlLoader({
          name: 'img/[name][hash].[ext]'
        })
      }
    ]
  },

  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },

  plugins: [
    new BabelRulePlugin(),
    new TransformModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.npm_config_mock': !!process.env.npm_config_mock
    }),
    new KjsWebpackPlugin({
      mode: 'web',
      productMode: 'didi'
    }),
    new VueLoaderPlugin(),
    new MpxWebpackPlugin(Object.assign({
      mode: 'web',
      srcMode: 'wx'
    }, mpxWebpackPluginConfig))
  ]
}
