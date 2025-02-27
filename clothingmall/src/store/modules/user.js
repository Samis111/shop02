import * as userApi from '@/api/user'

const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    if (userInfo && !userInfo.uid && userInfo.id) {
      userInfo.uid = userInfo.id
    }
    state.userInfo = userInfo
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      localStorage.removeItem('userInfo')
    }
  },
  CLEAR_USER_DATA(state) {
    state.userInfo = null
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  async login({ commit }, loginData) {
    try {
      const response = await userApi.login(loginData)
      if (response.code === 200 && response.data) {
        const userInfo = {
          ...response.data,
          uid: response.data.id || response.data.uid
        }
        commit('SET_USER_INFO', userInfo)
        return userInfo
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async register({ commit }, registerData) {
    try {
      const result = await userApi.register(registerData)
      return result
    } catch (error) {
      throw error
    }
  },

  async logout({ commit }) {
    try {
      commit('CLEAR_USER_DATA')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
}

const getters = {
  isLoggedIn: state => state.userInfo !== null,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 