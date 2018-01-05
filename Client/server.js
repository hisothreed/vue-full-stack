/* about vue-ssr-bundle :
/* When you use Webpack's on-demand code-splitting feature 
/* (via require.ensure or dynamic import),
/* the resulting server-side bundle will contain multiple separate files.
/* This plugin simplifies the workflow by automatically
/* packing these files into a single JSON file that can be passed to bundleRenderer.
*/
const fs = require('fs')
const express = require('express');
const path = require('path');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const Renderer = require('vue-server-renderer')
const devServer = require('./build/dev-server')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const publicPath = path.resolve(__dirname, 'public');


const isProd = process.env.NODE_ENV === 'production'

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})
app.use('/dist', serve('./dist', true))
// app.use(favicon(path.resolve(__dirname, 'src/assets/logo.png')))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

let renderer

if (isProd) {
  /* if prod 
    get the ssr bundle (which contains all the vue ssr ready 
    components scripts to inject in the page source)
  */
  const bundle = require('./dist/vue-ssr-bundle.json')

  const template = fs.readFileSync(resolve('./dist/index.html'), 'utf-8')
  renderer = Renderer.createBundleRenderer(bundle, {
    template,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}else{
  /*
    else 
    call devServer() and pass the app instace and wait for the callback(bundle, template)
    render the new ready template again on update or refresh using the hot-middle-ware
  */
  console.log(__dirname);
  devServer(app, (bundle, template) => {
      renderer = Renderer.createBundleRenderer(bundle, {
      template,
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    })
  })
}
/**
 * on request 
 * 63: check if there is a renderer -> print waiting message on false
 * 71: prepare error handling function
 * 83: call the renderer provided previuesly and call the instace methode renderToStream
 */
app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }
  const s = Date.now()
  
  
  res.setHeader("Content-Type", "text/html")

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }

  renderer.renderToStream({ url: req.url })
    .on('error', errorHandler)
    .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
    .pipe(res)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
