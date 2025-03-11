import request from '@/utils/request'

export default {
  /**
   * 获取用户列表
   */
  list(params) {
    return request({
      url: '/admin/users',
      method: 'get',
      params
    })
  },

  /**
   * 更新用户状态
   */
  updateStatus(id, status) {
    return request({
      url: `/admin/users/${id}/status`,
      method: 'put',
      data: { status }
    })
  },

  /**
   * 重置用户密码
   */
  resetPassword(id) {
    return request({
      url: `/admin/users/${id}/reset-password`,
      method: 'post'
    })
  },

  /**
   * 获取用户详细信息
   */
  getDetail(id) {
    return request({
      url: `/admin/users/${id}`,
      method: 'get'
    })
  }
} 