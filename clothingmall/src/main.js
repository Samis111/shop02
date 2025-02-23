import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './router/permission'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import api from './api'
import '@/styles/index.scss'

// 使用中文语言包
Vue.use(ElementUI, { locale })

// 注册 API 到 Vue 实例
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
