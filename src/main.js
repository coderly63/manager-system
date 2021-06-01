import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './plugins/element'
Vue.config.productionTip = false
import instance from './network/request'
Vue.prototype.$axios = instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
