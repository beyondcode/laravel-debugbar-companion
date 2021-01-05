import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import App from './App.vue'

import defaultSettings from './static/settings.json';

const Storage = require('electron-store');

window.mainStorage = new Storage({
  defaults: defaultSettings
});

Vue.config.productionTip = false
Vue.use(VueHighlightJS)

new Vue({
  render: h => h(App),
}).$mount('#app')
