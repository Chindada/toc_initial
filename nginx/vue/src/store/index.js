import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: false,
  state: {
    Authority: JSON.parse(localStorage.getItem('userresource')), //權限
    ver: JSON.parse(localStorage.getItem('version')), //版本
    user: JSON.parse(localStorage.getItem('user')) //個人資訊
  },
  mutations: {
    change(state, n) {
      //取得資源存localstorage

      state.Authority = n
      localStorage.setItem('userresource', JSON.stringify(n))
    },
    change1(state, n) {
      //取得版本存localstorage

      state.ver = n
      localStorage.setItem('version', JSON.stringify(n))
    },
    change2(state, n) {
      //取得個人資[ˋ存localstorage
      state.user = n
      localStorage.setItem('user', JSON.stringify(n))
    },
    change3(state, n) {
      //取得看板istask存localstorage
      state.checkTask = n
      localStorage.setItem('checkTask', JSON.stringify(n))
    }
  }
  // // actions: {},
  // modules: {},
  // getters: {
  //   count: state => state.count
  // }
})
