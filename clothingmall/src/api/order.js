import request from '@/utils/request'

export default {
  /**
   * 创建订单
   * @param {Object} data 订单信息
   * @param {Array} data.items 商品列表
   * @param {string} data.addressId 收货地址ID
   * @param {string} data.remark 订单备注
   * @returns {Promise} 返回订单信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     orderId: "订单ID",
   *     orderNo: "订单编号",
   *     totalAmount: 198.00,
   *     paymentAmount: 198.00
   *   }
   * }
   */
  create(data) {
    return request({
      url: '/orders',
      method: 'post',
      data
    })
  },

  /**
   * 获取订单列表
   * @param {Object} params 查询参数
   * @param {string} params.status 订单状态
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @returns {Promise} 返回订单列表
   */
  list(params) {
    return request({
      url: '/order/list',
      method: 'get',
      params
    })
  },

  /**
   * 获取订单详情
   * @param {number} id 订单ID
   * @returns {Promise} 返回订单详情
   */
  getDetail(id) {
    return request({
      url: `/order/detail/${id}`,
      method: 'get'
    })
  },

  /**
   * 取消订单
   * @param {number} id 订单ID
   * @returns {Promise} 返回取消结果
   */
  cancel(id) {
    return request({
      url: `/order/cancel/${id}`,
      method: 'get'
    })
  },

  /**
   * 确认收货
   * @param {number} id 订单ID
   * @returns {Promise} 返回确认结果
   */
  confirm(id) {
    return request({
      url: `/order/confirm/${id}`,
      method: 'get'
    })
  },

  /**
   * 删除订单
   * @param {string} id 订单ID
   * @returns {Promise} 返回删除结果
   * @example
   * {
   *   code: 200,
   *   message: "删除成功"
   * }
   */
  remove(id) {
    return request({
      url: `/orders/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取支付信息
   * @param {string} orderId 订单ID
   * @returns {Promise} 返回支付信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     paymentAmount: 198.00,
   *     qrcode: "支付二维码url",
   *     expireTime: "2023-01-01 12:30:00"
   *   }
   * }
   */
  getPayment(orderId) {
    return request({
      url: `/orders/${orderId}/payment`,
      method: 'get'
    })
  }
} 