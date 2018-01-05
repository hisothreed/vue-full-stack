import Vue from 'vue'
import Router from 'vue-router'
import Home from 'src/views/Home.vue'

Vue.use(Router)

export function createRouter () {
    return new Router({
        mode: 'history',
        base: __dirname,
        routes: [
            { path: '/home' , component: Home },
            { path: '/home' , component: Home }
        ]
    })
}