import { createApp } from './app'
import Vue from 'vue'
import uikit from 'uikit'

const { app , router } = createApp()

app.$mount('#app')

Vue.use(uikit)
