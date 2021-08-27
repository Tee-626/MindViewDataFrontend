import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios
// axios.defaults.baseURL= '/'
// axios.defaults.headers.post['Content-Type'] = 'application/json';

//axios.defaults.withCredentials = true 尝试让cookie跨域的解决方式（失败）

//时间戳转换为标准时间格式
Vue.filter('dateFormat',function (originTime) {
  const dateTime = new Date(originTime)
  const y = dateTime.getFullYear()
  const m = (dateTime.getMonth() + 1 +'').padStart(2, '0')
  const d = (dateTime.getDate() + '').padStart(2, '0')
  const hh = (dateTime.getHours() + '').padStart(2, '0')
  const mm = (dateTime.getMinutes() + '').padStart(2, '0')
  const ss = (dateTime.getSeconds() + '').padStart(2, '0')

  return  `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(Vuex)
Vue.use(router);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
