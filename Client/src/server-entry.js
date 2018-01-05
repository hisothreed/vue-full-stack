/**
 * The server entry uses a default export which is a function that can be
 * called repeatedly for each render. At this moment, it doesn't do much 
 * other than creating and returning the app instance -
 * but later when we will perform server-side route matching and data pre-fetching
 * logic here
 * this will be called on server only and not on client side (before even sending the rendered page)
 */

import { createApp } from './app'
import { log } from 'util';
import { loadavg } from 'os';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    // set server-side router's location
    router.push(context.url)    
    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }      
      // have matched components and the matched has asyncData() implemented ?
      // useful when trying to fetch items from the store prior to rendering the view or component
      // i.e when implemeting items() => { this.$store.state.items }
      // the state will be ready and has all the required data fetched in asyncData()
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // When we attach the state to the context, and the `template` option
        // is used for the renderer, the state will automatically be
        // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
        context.state = store.state
        resolve(app)
      }).catch(reject)
      // the Promise should resolve to the app instance so it can be rendered
      resolve(app)
    }, reject)
  })
}
