'use strict'
const config = require('../config')

module.exports = {
  loaders: {
    i18n: '@kazupon/vue-i18n-loader'
  },
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
