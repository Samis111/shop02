import { login as loginApi, register as registerApi } from '@/api/user'

const state = {
  token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },
  CLEAR_USER_DATA(state) {
    state.token = ''
    state.userInfo = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  async login({ commit }, loginData) {
    try {
      const { token, userInfo } = await loginApi(loginData)
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
      return { token, userInfo }
    } catch (error) {
      throw error
    }
  },

  async register({ commit }, registerData) {
    try {
      const result = await registerApi(registerData)
      return result
    } catch (error) {
      throw error
    }
  },

  logout({ commit }) {
    commit('CLEAR_USER_DATA')
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 