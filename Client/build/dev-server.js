const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')

const clientConfig = require('./webpack.client.config')

const serverConfig = require('./webpack.server.config')

const webpackDevMiddleware = require('webpack-dev-middleware')

module.exports = function setupDevServer (app, cb) {
  let bundle
  let template

  /**
   * this function will be called in staging mode to init dev server and hot module replacement
   * will use dev middleware to make hmr work with express
   * the clientConfig file is modified to work with production 
   * but in this file we are going to re modify it to work with the hmr and dev server
   */

  // modify client config to work with hot middleware
  // watch for client side changes and on change just callback and pass the new template with bundle 
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  // call app = express() , and add the middleware to it
  app.use(devMiddleware)
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      template = fs.readFileSync(filePath, 'utf-8')
      if (bundle) {
        cb(bundle, template)
      }
    }
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    // read bundle generated by vue-ssr-webpack-plugin
    const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-bundle.json')
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    if (template) {
      cb(bundle, template)
    }
  })
}
