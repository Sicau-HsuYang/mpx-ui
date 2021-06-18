'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

// 针对预览环境做一些访问友好性优化
const isOffline = !!process.env.npm_config_offline
// 获取预览环境构建时候的分支名
const offlineBranch = process.argv[2]

console.log('\n\n====== 环境变量 ========')
console.log('isOffline: ' + isOffline)
console.log('offlineBranch: ' + offlineBranch)

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const utils = require('./utils')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = require('./webpack.prod.conf')

const entries = utils.getEntrys()
if (Object.keys(entries).length === 0) {
  console.log('当前编译没有web，编译结束')
  return
}

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, '*'), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: true, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
