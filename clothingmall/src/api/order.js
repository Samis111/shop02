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
   * @param {number} params.limit 每页数量
   * @returns {Promise} 返回订单列表
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     total: 10,
   *     list: [{
   *       id: "订单ID",
   *       orderNo: "订单编号",
   *       status: "pending", // pending/paid/shipped/completed/cancelled
   *       totalAmount: 198.00,
   *       paymentAmount: 198.00,
   *       createTime: "2023-01-01 12:00:00",
   *       products: [{
   *         id: 1,
   *         name: "商品名称",
   *         image: "商品图片",
   *         price: 99.00,
   *         quantity: 1,
   *         specs: {
   *           color: "白色",
   *           size: "M"
   *         }
   *       }]
   *     }]
   *   }
   * }
   */
  list(params) {
    return request({
      url: '/orders',
      method: 'get',
      params
    })
  },

  /**
   * 获取订单详情
   * @param {string} id 订单ID
   * @returns {Promise} 返回订单详细信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     id: "订单ID",
   *     orderNo: "订单编号",
   *     status: "pending",
   *     totalAmount: 198.00,
   *     paymentAmount: 198.00,
   *     createTime: "2023-01-01 12:00:00",
   *     payTime: "2023-01-01 12:01:00",
   *     shipTime: "2023-01-02 12:00:00",
   *     completeTime: "2023-01-03 12:00:00",
   *     address: {
   *       name: "收货人",
   *       phone: "手机号",
   *       province: "省份",
   *       city: "城市",
   *       district: "区县",
   *       detail: "详细地址"
   *     },
   *     products: [{
   *       id: 1,
   *       name: "商品名称",
   *       image: "商品图片",
   *       price: 99.00,
   *       quantity: 1,
   *       specs: {
   *         color: "白色",
   *         size: "M"
   *       }
   *     }],
   *     logistics: {
   *       company: "物流公司",
   *       trackingNo: "物流单号",
   *       traces: [{
   *         time: "2023-01-02 12:00:00",
   *         content: "物流信息"
   *       }]
   *     }
   *   }
   * }
   */
  getDetail(id) {
    return request({
      url: `/orders/${id}`,
      method: 'get'
    })
  },

  /**
   * 取消订单
   * @param {string} id 订单ID
   * @returns {Promise} 返回取消结果
   * @example
   * {
   *   code: 200,
   *   message: "取消成功"
   * }
   */
  cancel(id) {
    return request({
      url: `/orders/${id}/cancel`,
      method: 'post'
    })
  },

  /**
   * 确认收货
   * @param {string} id 订单ID
   * @returns {Promise} 返回确认结果
   * @example
   * {
   *   code: 200,
   *   message: "确认成功"
   * }
   */
  confirm(id) {
    return request({
      url: `/orders/${id}/confirm`,
      method: 'post'
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