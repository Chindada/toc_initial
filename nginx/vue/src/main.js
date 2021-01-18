// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vSelect from 'vue-select'
import App from './App'
import router from './router'
import Axios from 'axios'
import English from './language/en'
import 中文 from './language/zh_tw'
import 簡體 from './language/zh_cn'
// import 簡體 from './language/zh_ch'
import '@amcharts/amcharts4/lang/zh_Hant'

$.extend(true, $.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle'
  }
})
import $ from 'jquery'
import layer from 'vue-layer'
import 'vue-layer/lib/vue-layer.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import fullscreen from 'vue-fullscreen' //全螢幕
import Vuex from 'vuex'
// import Buefy from "buefy";
// import "buefy/dist/buefy.css";

// import "bootstrap-table/dist/bootstrap-table.min.css";
// import "bootstrap-table/dist/bootstrap-table.min.js";
// import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";
import 'mdbvue/build/css/mdb.css'
import * as mdbvue from 'mdbvue'
for (const mdbcomponent in mdbvue) {
  Vue.component(mdbcomponent, mdbvue[mdbcomponent])
}
// Vue.use(Buefy);
// import time from 'plugin/func.js'

import pluginfunc from './plugins/func.js' //引用
Vue.use(pluginfunc) //將全域性函式當做外掛來進行註冊
import VueCookies from 'vue-cookies'
import VueI18n from 'vue-i18n'
import XLSX from 'xlsx'
import { store } from './store/index.js'
import toExcel from '@/excel/json2excel' //excel匯出
Vue.prototype.$toExcel = toExcel
import 'vue-search-select/dist/VueSearchSelect.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

var FileSaver = require('file-saver')
Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(VueCookies)
Vue.use(fullscreen)
Vue.use(Vuex)
Vue.prototype.$ = $
Vue.prototype.$layer = layer(Vue)
Vue.prototype.Axios = Axios
Vue.component('v-select', vSelect)
// 取得預設語系
const locale = localStorage.getItem('locale') || '中文'
// 建立 VueI18n 實體
var i18n = new VueI18n({
  locale,
  messages: { English, 中文, 簡體 }
})
export default i18n

router.beforeEach((to, from, next) => {
  if (
    to.name == ' 看板管理 / 客製化看板' ||
    to.name == 'DailyReport' ||
    to.name == 'remoteini' ||
    to.name == 'remotedashboardworkshop' ||
    to.name == 'remotedashboardstation' ||
    to.name == 'iomc5systemFunctionSystemVersion' ||
    to.name == 'remotefactorydashboard' ||
    to.name == ' 看板管理 / 廠區看板' ||
    to.name == ' 夥伴管理' ///test未設定資源
  ) {
    next()
    return
  }

  if (to.path == '/') {
    next()
    return
  } else if (to.path == '/404') {
    next()
    return
  }
  const isLogin = VueCookies.get('access_token')
  //登入後導至即時看版
  if (
    // to.path == '/dashboard/dashboardworkshop' ||
    // to.path == '/dashboard/dashboardstation' ||
    to.path == '/null' ||
    to.path == '/remote/inipage'
  ) {
    next()
    return
  }
  if (isLogin) {
    if (store.state.Authority != null) {
      var flag = false
      /****不用權限****** 
      next()
      return
      /********** */
      /******需要權限**** */
      var tempvalue = to.path.split('/')
      store.state.Authority.forEach(item => {
        if (item.icon == tempvalue[tempvalue.length - 1]) {
          flag = true
          next()
          return
        }
        //分析
        if (
          tempvalue[tempvalue.length - 1] == 'iom' ||
          tempvalue[tempvalue.length - 1] == 'cttime' ||
          tempvalue[tempvalue.length - 1] == 'workhryield' ||
          tempvalue[tempvalue.length - 1] == 'productivity' ||
          tempvalue[tempvalue.length - 1] == 'totalyield' ||
          tempvalue[tempvalue.length - 1] == 'course' ||
          tempvalue[tempvalue.length - 1] == 'productivity' ||
          tempvalue[tempvalue.length - 1] == 'shoot'
        ) {
          if (item.icon == tempvalue[tempvalue.length - 2]) {
            flag = true
            next()
            return
          }
        }
      })
      /********** */
    }
    if (flag == false) {
      if (tempvalue[tempvalue.length - 1] == 'dashboardworkshop') {
        next('/null') //沒有權限，導至空白頁
        return
      } else if (tempvalue[tempvalue.length - 1] == 'dashboardstation') {
        let formpath = from.path.split('/')
        if (formpath[formpath.length - 1] == 'dashboardworkshop2') {
          next('/dashboard/dashboardworkshop2') //有看板一權限、無單站看板權限，不轉跳
        } else {
          next('/dashboard/dashboardworkshop') //有看板一權限、無單站看板權限，不轉跳
        }

        return
      } else {
        next('/404') //沒有權限，導至404
        return
      }
    }
    // next()
  } else {
    if (to.path !== '/') {
      next('/')
    } else {
      next()
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  FileSaver,
  XLSX,
  layer,
  $,
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
