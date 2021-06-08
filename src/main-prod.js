import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
// import './plugins/element'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor, /* { default global options } */)
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


Vue.config.productionTip = false
import instance from './network/request'
Vue.prototype.$axios = instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
