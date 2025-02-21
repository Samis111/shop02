import request from '@/utils/request'

export default {
  /**
   * 获取品牌列表
   * @returns {Promise} 返回品牌列表
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: [{
   *     id: 1,
   *     name: "Nike",
   *     logo: "品牌logo url"
   *   }]
   * }
   */
  list() {
    return request({
      url: '/brands',
      method: 'get'
    })
  }
} 