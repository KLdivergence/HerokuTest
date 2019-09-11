// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
// import uuid from 'vue-uuid'
// import VuejsDialog from 'vuejs-dialog'
// import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueResource)
Vue.use(Vuetify, {
  iconfont: 'mdi'})
// Vue.use(uuid)
// Vue.use(VuejsDialog)

Vue.config.productionTip = false
Vue.config.devtools = true
/* eslint-disable no-new */

const opts = {
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
  theme: {
    dark: false,
    themes: {
      light: {
      },
      dark: {
      }
    }
  }
}

new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(opts),
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
