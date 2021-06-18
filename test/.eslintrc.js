module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  extends: 'standard',
  settings: {
    "html/html-extensions": [".html", ".mpx"],  // consider .html and .mpx files as HTML
  },
  rules: {
    "prefer-promise-reject-errors": 0,
    "camelcase": 0,
    "no-mixed-operators": 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 0,
    'space-before-function-paren': 0
  },
  plugins: [
    'html'
  ],
  'globals': {
    'wx': true,
    'K': true,
    'getApp': true,
    'App': true,
    '__mpx_mode__': true,
    'mpx': true
  }
}
