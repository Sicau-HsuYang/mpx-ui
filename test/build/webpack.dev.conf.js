const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const fs = require('fs')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const stripJsonComments = require('strip-json-comments')
const WebxControlCenterWebpackPlugin = require('@didi/webx-control-center-webpack-plugin')

const getIPv4Addr = function () {
  const networkInterfaces = require('os').networkInterfaces()
  const addresses = []

  Object.keys(networkInterfaces).forEach(function (networkInterface) {
    networkInterfaces[networkInterface].forEach(function (address) {
      if (address.internal === false && address.family === 'IPv4') {
        addresses.push(address.address)
      }
    })
  })
  return addresses.length > 0 ? addresses[0] : 'localhost'
}

const showHost = getIPv4Addr()

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // mock数据
    setup(app) {
      const mockRoot = path.resolve(__dirname, '../mockData')
      app.use((req, res, next) => {
        let jsonName = req.path.split('/').reverse().slice(0, -1).join('-') + '.json'
        fs.readFile(path.join(mockRoot, jsonName), 'utf8', (err, data) => {
          if (!err) {
            res.send(stripJsonComments(data))
          } else {
            next()
          }
        })
      })
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  optimization: {
    noEmitOnErrors: true
  }
})

if (process.env.npm_config_use_control_center) {
  devWebpackConfig.plugins.push(new WebxControlCenterWebpackPlugin())
}

let htmls = utils.getEntrys('html')
Object.keys(htmls).forEach(chunk => {
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: chunk + '.html',
    template: htmls[chunk],
    inject: true,
    chunks: [chunk],
    AIO: config.dev.AIO,
    Omega: config.dev.Omega,
    Vconsole: config.dev.Vconsole
  }))
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: ['Your application is running here:']
            .concat(Object.keys(htmls).map(item => `  http://${showHost}:${port}/${item}.html`))
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
