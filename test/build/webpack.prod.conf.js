const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebxControlCenterWebpackPlugin = require('@didi/webx-control-center-webpack-plugin')

const htmls = utils.getEntrys('html')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',

  devtool: config.build.productionSourceMap ? config.build.devtool : false,

  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js')
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[chunkhash].css')
    }),

    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin()
  ],

  optimization: {
    splitChunks: {
      chunks: 'async', // 只抽异步chunk
      maxAsyncRequests: 1, // 覆盖webpack的默认值，因为我们希望每一个异步chunk独立成包，不再继续分拆
      cacheGroups: {
        // 将同步chunk里面，通用的node_modules代码抽到vender中
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          minSize: 1,
          minChunks: Object.keys(htmls).length
        }
      }
    },

    minimizer: config.build.minimizer ? [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          },
          mangle: {
            safari10: true // See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/92
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      })
    ] : []
  }
})

if (config.build.minimizer) {
  webpackConfig.plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessorOptions: config.build.productionSourceMap
      ? {
        safe: true,
        map: { inline: false },
        autoprefixer: { remove: false }
      }
      : {
        safe: true,
        autoprefixer: { remove: false }
      }
  }))
}

Object.keys(htmls).forEach(chunk => {
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: config.build.index + '/' + chunk + '.html',
    template: htmls[chunk],
    inject: true,
    minify: config.build.minimizer ? {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    } : false,
    chunks: ['vendor', chunk],
    chunksSortMode: 'dependency',
    AIO: config.build.AIO,
    Omega: config.build.Omega,
    Vconsole: config.build.Vconsole
  }))
})

webpackConfig.plugins.push(
  new ScriptExtHtmlWebpackPlugin({
    custom: [
      {
        test: /\.js$/,
        attribute: 'crossorigin',
        value: 'anonymous'
      }
    ]
  })
)

if (process.env.npm_config_use_control_center) {
  webpackConfig.plugins.push(new WebxControlCenterWebpackPlugin())
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
