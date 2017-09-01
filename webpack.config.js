var path = require('path')
// var webpack = require('webpack')

module.exports = [
{
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'validator.js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
},
{
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'node-validator.js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
},
]