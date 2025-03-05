import request from '@/utils/request'

export default {
  /**
   * 获取收货地址列表
   * @returns {Promise} 返回地址列表
   */
  list(uid) {
    return request({
      url: `/address/${uid}`,
      method: 'get'
    })
  },

  /**
   * 添加收货地址
   * @param {Object} data 地址信息
   * @returns {Promise} 返回添加结果
   */
  create(data) {
    return request({
      url: '/address/save',
      method: 'post',
      data: {
        uid: data.uid,
        name: data.name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        isDefault: data.isDefault ? 1 : 0
      }
    })
  },

  /**
   * 更新收货地址
   * @param {Object} data 地址信息
   * @returns {Promise} 返回更新结果
   */
  update(data) {
    return request({
      url: `/address/update/${data.id}`,
      method: 'put',
      data: {
        name: data.name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        isDefault: data.isDefault ? 1 : 0
      }
    })
  },

  /**
   * 删除收货地址
   * @param {number} id 地址ID
   * @returns {Promise} 返回删除结果
   */
  delete(id) {
    return request({
      url: `/address/delete/${id}`,
      method: 'delete'
    })
  },

  /**
   * 设置默认地址
   * @param {number} id 地址ID
   * @returns {Promise} 返回设置结果
   */
  setDefault(id) {
    return request({
      url: `/address/default/${id}`,
      method: 'put'
    })
  }
} 