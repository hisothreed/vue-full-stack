const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRPlugin = require('vue-ssr-webpack-plugin')

module.exports = merge(base, {
  target: 'node',
  devtool: 'source-map',
  entry: './src/server-entry.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
    }
  },
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
			"process.env.VUE_ENV": "'server'"
		}),
    new VueSSRPlugin()
  ]
})
