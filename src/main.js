import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueIziToast from 'vue-izitoast'
import 'izitoast/dist/css/iziToast.css';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { routes } from './router';
import '@fortawesome/fontawesome-free/css/all.css'

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#33C4FF'
      },
      dark: {
        primary: '#272727'
      }
    }
  },
  icons: {
    iconfont: 'fa',
  }
}

export const EventBus = new Vue();

Vue.use(Vuetify)
Vue.use(VueRouter);
Vue.use(VueIziToast);

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(opts),
  render: h => h(App)
})
