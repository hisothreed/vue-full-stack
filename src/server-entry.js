import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // set server-side router's location
    router.push(context.url)

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // the Promise should resolve to the app instance so it can be rendered
      resolve(app)
    }, reject)
  })
}
