import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import favorite from './modules/favorite'
import user from './modules/user'
import checkout from './modules/checkout'

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
    favorite,
    user,
    checkout
  }
})
