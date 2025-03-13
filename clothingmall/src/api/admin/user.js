import request from '@/utils/request'

export default {
  /**
   * 获取用户列表
   */
  list(params) {
    return request({
      url: '/users/list',
      method: 'get',
      params
    })
  },

  /**
   * 更新用户状态
   */
  updateStatus(id, status) {
    return request({
      url: `/users/${id}/status`,
      method: 'post',
      data: { status }
    })
  },

  /**
   * 重置用户密码
   */
  resetPassword(id) {
    return request({
      url: `/users/${id}/reset-password`,
      method: 'post'
    })
  },

  /**
   * 获取用户详细信息
   */
  getDetail(id) {
    return request({
      url: `/users/${id}`,
      method: 'get'
    })
  }
} 