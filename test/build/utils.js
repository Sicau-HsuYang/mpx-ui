'use strict'
const path = require('path')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')
const fs = require('fs')

const entrys = (() => {
  let entrys = {}
  let viewRoot = path.resolve(__dirname, '../src/views')
  let dirs = fs.readdirSync(viewRoot)
  dirs.forEach(i => {
    let entryPath = path.resolve(viewRoot, i, 'app.mpx')
    let pagePath = path.resolve(viewRoot, i, 'index.mpx')
    let htmlPath = path.resolve(viewRoot, i, 'index.ejs')

    let entryExist = fs.existsSync(entryPath)
    let pageExist = fs.existsSync(pagePath)
    let htmlExist = fs.existsSync(htmlPath)
    if (entryExist && htmlExist && pageExist) {
      entrys[i] = {
        script: entryPath,
        html: htmlPath
      }
      return
    }
    if (entryExist || htmlExist) {
      console.warn(`[Missing-Entry-File]: 'app.mpx' and '${i}.ejs' should both exist in '${path.resolve('../src/views', i)}'.\nOtherwise module [${i}] will be ignored.`)
    }
  })
  return entrys
})()

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.getEntrys = (type) => {
  if (!type) {
    return entrys
  }

  let ret = {}
  Object.keys(entrys).forEach(i => {
    if (entrys[i][type]) {
      ret[i] = entrys[i][type]
    }
  })
  return ret
}

const cssLoader = {
  loader: 'css-loader',
  options: {
    minimize: process.env.NODE_ENV === 'production'
      ? config.build.minimizer
      : config.dev.minimizer,
    sourceMap: process.env.NODE_ENV !== 'production'
  }
}

// 抽style的情况下，生产环境用插件，开发模式仍用vue-style-loader
const extractLoader = process.env.NODE_ENV === 'production'
  ? {
    loader: MiniCssExtractPlugin.loader,
    options: {}
  } : {
    loader: 'vue-style-loader'
  }

const styleList = {
  css: {
    loader: 'css'
  },
  less: {
    loader: 'less'
  },
  sass: {
    loader: 'sass',
    option: {indentedSyntax: true}
  },
  scss: {
    loader: 'sass'
  },
  stylus: {
    loader: 'stylus',
    option: {
      'resolve url': true
    }
  },
  styl: {
    loader: 'stylus',
    option: {
      'resolve url': true
    }
  }
}

exports.styleRules = function () {
  let rules = []

  function generateRule(extension, loaderOptions = {}) {
    // 目标：[noExtractLoader/extractLoader, css-loader, css-lang-loader]
    var loaders = [cssLoader]
    // rpx -> vw loader
    loaders.push({
      loader: '@didi/rpx-loader',
      options: {
        designWidth: 750
      }
    })
    if (loaderOptions.loader && loaderOptions.loader !== 'css') {
      loaders.push({
        loader: loaderOptions.loader + '-loader',
        options: Object.assign({}, loaderOptions.option, {
          sourceMap: process.env.NODE_ENV !== 'production'
        })
      })
    }

    var extractLoaders = [extractLoader].concat(loaders)

    return {
      test: new RegExp('\\.' + extension + '$'),
      use: extractLoaders
    }
  }

  for (var style in styleList) {
    rules = rules.concat(generateRule(style, styleList[style]))
  }
  return rules
}
