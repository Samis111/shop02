import request from '@/utils/request'

// 改为具名导出
export const login = (data) => {
  return request({
    url: '/auto/login',
    method: 'post',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export const sendCode = (phone) => {
  return request({
    url: '/user/sendCode',
    method: 'post',
    data: { phone }
  })
}

export const getInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export const updateInfo = (data) => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

export const changePassword = (data) => {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

export default {
  /**
   * 获取用户信息
   * @returns {Promise} 返回用户信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     id: 1,
   *     username: "张三",
   *     nickname: "昵称",
   *     phone: "13800138000",
   *     email: "example@email.com",
   *     avatar: "头像url"
   *   }
   * }
   */
  getUserInfo() {
    return request({
      url: '/user/info',
      method: 'get'
    })
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户信息
   * @returns {Promise} 返回更新结果
   */
  updateUserInfo(data) {
    return request({
      url: '/user/update',
      method: 'post',
      data
    })
  }
} 