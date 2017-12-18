import Vue from 'vue'
import App from './App.vue'
import router from './router/router'

// components can be called from the imported UIkit reference
// UIkit.notification('Hello world.');



export function createApp(ssrContext) {
    const app = new Vue({
        router,
        ssrContext,
        render: h => h(App)
    })
    return { app, router }
}