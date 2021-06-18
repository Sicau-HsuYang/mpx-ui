const path = require('path');

const webpack = require('webpack');
const MpxWebpackPlugin = require("@mpxjs/webpack-plugin")
// const i18nMessages = require('../build/i18nFormat')
const KjsWebpackPlugin = require('@didi/kjs-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, '../', dir);
}

module.exports = async ({
  config
}) => {
  config.plugins[0].options.template = path.join(__dirname, 'index.ejs') // 将源码中的模板拿出来，方便控制，增加js或css

  config.module.rules = [
    {
        test: /\.(vue|js|mpx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: [resolve('package')],
        enforce: 'pre'
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('package'),resolve('test'), resolve('node_modules/webpack-dev-server/client')]
    },
    {
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      include: [path.resolve(__dirname, '../stories')],
      enforce: 'pre',
    },
    {
      test: /\.pug$/,
      oneOf: [{
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        },
        {
          use: ['raw-loader', 'pug-plain-loader']
        }
      ]
    },
    {
      test: /\.(svg|otf|ttf|woff2?|eot)(\?\S*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000 * 1000,
        name: path.posix.join('static', '[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(gif|png|jpe?g)(\?\S*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: path.posix.join('static', '[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.css$/,
      loaders: [
        'vue-style-loader',
        'css-loader',
        {
          loader: '@didi/rpx-loader',
          options: {
            outputMode: 'vw'
          }
        }
      ]
    },
    {
      test: /\.scss$/,
      loaders: [
        'vue-style-loader',
        'css-loader',
        {
          loader: '@didi/rpx-loader',
          options: {
            outputMode: 'vw'
          }
        },
        'sass-loader'
      ]
    },
    {
      test: /\.styl$/,
      loader: [
        'vue-style-loader',
        'css-loader',
        {
          loader: '@didi/rpx-loader',
          options: {
            outputMode: 'vw'
          }
        },
        'stylus-loader'
      ]},
    {
      test: /\.stylus$/,
      loader: [
        'vue-style-loader',
        'css-loader',
        {
          loader: '@didi/rpx-loader',
          options: {
            outputMode: 'vw'
          }
        },
        'stylus-loader'
      ]
    },
    {
        test: /\.mpx$/,
        oneOf: [
            {
                resourceQuery: /(app|page|component)/,
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
                    MpxWebpackPlugin.loader({})
                ]
            },
            {
                use: MpxWebpackPlugin.loader({})
            }
        ],
    },
    {
        test: /\.json$/,
        resourceQuery: /_component/,
        type: 'javascript/auto'
    },
    {
        test: /\.(wxs|sjs\.js)$/,
        loader: MpxWebpackPlugin.wxsPreLoader(),
        enforce: 'pre'
    },
  ]

  config.resolve.alias['@'] = resolve('packages')
  config.resolve.alias['makeStory'] = resolve('stories/makeStory.js')
  config.resolve.extensions = [ '.mjs', '.js', '.jsx', '.json', '.mpx', '.vue' ]

  config.plugins.push(new MpxWebpackPlugin({
    mode: 'web',
    srcMode: 'wx',
    // i18n: {
    //   locale: 'zh-CN',
    //   messages: i18nMessages
    // }
  }))

  config.plugins.push(new webpack.DefinePlugin({
    'process.env.MODE': '"h5"',
  }))

  config.plugins.push(new webpack.LoaderOptionsPlugin(
    {
      minimize: true,
      debug: false,
      options: {
        context: __dirname
      }
    }
  ))
  config.plugins.push(new KjsWebpackPlugin({
    mode: 'web',
    productMode: 'didi'
  }))

  return config
};
