import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import favorite from './modules/favorite'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart,
    favorite
  }
})
