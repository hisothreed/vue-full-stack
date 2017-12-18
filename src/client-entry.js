import { createApp } from './app'
import Vue from 'vue'
import uikit from 'uikit'
/**
 * HEAD MANGEMENT
*/

import TitleInfo from "./mixins/title-mixin"
Vue.mixin(TitleInfo)

const { app , router } = createApp()


app.$mount('#app')

Vue.use(uikit)
