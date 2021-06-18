const path = require('path')
const packageJson = require('../package.json')
const publishPath = packageJson.publishPath || packageJson.name

const isOffline = !!process.env.npm_config_offline
const offlineBranch = process.argv[2]

const Omega = '//tracker.didistatic.com/static/tracker/latest2x/omega.min.js'
const onlineHost = '//static.udache.com/webx/'
const offlineHost = '//webappstatic.intra.xiaojukeji.com/webx/'

const devConfigs = {
  assetsSubDirectory: 'static',

  assetsPublicPath: '/',

  proxyTable: {},

  host: '0.0.0.0', // can be overwritten by process.env.HOST

  port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined

  autoOpenBrowser: false,

  errorOverlay: true,

  notifyOnErrors: true,

  poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

  // If true, eslint errors and warnings will also be shown in the error overlay
  // in the browser.
  showEslintErrorsInOverlay: false,

  devtool: 'source-map',

  // If you have problems debugging vue-files in devtools,
  // set this to false - it *may* help
  // https://vue-loader.vuejs.org/en/options.html#cachebusting
  cacheBusting: true,

  cssSourceMap: true,

  AIO: 'https://dpubstatic.udache.com/static/dpubimg/BjsBshNst9/aio.js',

  Omega,

  Vconsole: true,

  env: {
    NODE_ENV: '"development"',
    ONLINE: false,
    MOCK: !!process.env.npm_config_mock
  }
}

const buildConfig = {
  index: path.resolve(__dirname, '../dist/'),

  assetsRoot: path.resolve(__dirname, '../dist'),

  assetsSubDirectory: 'static',

  assetsPublicPath: `${onlineHost}${publishPath}/`,

  productionSourceMap: false,

  devtool: '#source-map',

  minimizer: true,

  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,

  AIO: '//static.udache.com/agility-sdk/2.0.0/aio.js',

  Omega,

  Vconsole: false,

  env: {
    NODE_ENV: '"production"',
    ONLINE: true,
    MOCK: false
  }
}

const deployConfig = {
  index: path.resolve(__dirname, '../dist/'),

  assetsRoot: path.resolve(__dirname, '../dist'),

  assetsSubDirectory: 'static',

  assetsPublicPath: `${offlineHost}${offlineBranch}/${publishPath}/`,

  productionSourceMap: false,

  devtool: '#source-map',

  minimizer: false,

  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,

  AIO: 'https://dpubstatic.udache.com/static/dpubimg/BjsBshNst9/aio.js',

  Omega,

  Vconsole: true,

  env: {
    NODE_ENV: '"production"',
    ONLINE: false,
    MOCK: false
  }
}

module.exports = {
  dev: devConfigs,
  build: isOffline ? deployConfig : buildConfig
}
