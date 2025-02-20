import * as userApi from '@/api/user'

const state = {
  // token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const mutations = {
  // SET_TOKEN(state, token) {
  //   state.token = token
  //   localStorage.setItem('token', token)
  // },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },
  CLEAR_USER_DATA(state) {
    // state.token = ''
    state.userInfo = {}
    // localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  async login({ commit }, loginData) {
    try {
      const response = await userApi.login(loginData)
      
      // 确保 API 返回了正确的数据结构
      if (!response.data) {
        throw new Error('登录接口返回数据格式错误')
      }

      const userInfo = response.data

      // if (!token) {
      //   throw new Error('登录失败：未获取到token')
      // }

      // 存储认证信息
      // commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)

      return { userInfo }
    } catch (error) {
      console.error('登录 action 错误：', error)
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

  logout({ commit }) {
    commit('CLEAR_USER_DATA')
  }
}

const getters = {
  // isLoggedIn: state => !!state.token,
  isLoggedIn: state => !!state.userInfo,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 