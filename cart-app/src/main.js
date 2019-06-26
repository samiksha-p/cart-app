import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import 'vuetify/dist/vuetify.min.css';
import {store} from '../src/store/store'
import Routes from '../src/router/router'

Vue.use(Vuetify);
Vue.use(VueRouter)
const router = new VueRouter({
  routes : Routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
