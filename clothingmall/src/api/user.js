import request from '@/utils/request'

export default {
  /**
   * 用户登录
   * @param {Object} data 登录信息
   * @param {string} data.username 用户名/手机号/邮箱
   * @param {string} data.password 密码
   * @param {boolean} data.remember 是否记住登录
   * @returns {Promise} 返回用户信息和token
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     token: "jwt token",
   *     user: {
   *       id: 1,
   *       username: "用户名",
   *       nickname: "昵称",
   *       avatar: "头像url",
   *       phone: "手机号",
   *       email: "邮箱"
   *     }
   *   }
   * }
   */
  login(data) {
    return request({
      url: '/auto/login',
      method: 'post',
      data
    })
  },

  /**
   * 用户注册
   * @param {Object} data 注册信息
   * @param {string} data.username 用户名
   * @param {string} data.password 密码
   * @param {string} data.phone 手机号
   * @param {string} data.code 验证码
   * @returns {Promise} 返回注册结果
   * @example
   * {
   *   code: 200,
   *   message: "注册成功"
   * }
   */
  register(data) {
    return request({
      url: '/auto/register',
      method: 'post',
      data
    })
  },

  /**
   * 获取用户信息
   * @returns {Promise} 返回用户详细信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     id: 1,
   *     username: "用户名",
   *     nickname: "昵称",
   *     avatar: "头像url",
   *     phone: "手机号",
   *     email: "邮箱",
   *     gender: 1, // 1男 2女 0未知
   *     birthday: "1990-01-01",
   *     memberLevel: "普通会员",
   *     points: 100
   *   }
   * }
   */
  getInfo() {
    return request({
      url: '/user/info',
      method: 'get'
    })
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户信息
   * @returns {Promise} 返回更新结果
   * @example
   * {
   *   code: 200,
   *   message: "更新成功"
   * }
   */
  updateInfo(data) {
    return request({
      url: '/user/info',
      method: 'put',
      data
    })
  },

  /**
   * 修改密码
   * @param {Object} data 密码信息
   * @param {string} data.oldPassword 旧密码
   * @param {string} data.newPassword 新密码
   * @returns {Promise} 返回修改结果
   * @example
   * {
   *   code: 200,
   *   message: "密码修改成功"
   * }
   */
  changePassword(data) {
    return request({
      url: '/user/password',
      method: 'put',
      data
    })
  }
} 