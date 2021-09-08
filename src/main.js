import Vue from 'vue'
import App from './App.vue'
import 'normalize.css'
// 全局引入按需引入UI库 vant
import '@/plugins/vant'
//路由
import router from './router'
//vuex
import store from './store'
import VConsole from 'vconsole'

//加载vconsole
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
if (!IS_PROD) {
  new VConsole()
}

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
