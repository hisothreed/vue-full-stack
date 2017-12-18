import Vue from 'vue'
import Router from 'vue-router'

import About from 'src/views/About.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/about', component: About}
    ]
})

export default router