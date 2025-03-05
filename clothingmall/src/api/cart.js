import request from '@/utils/request'

export default {
  /**
   * 获取购物车列表
   * @returns {Promise} 返回购物车商品列表
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     total: 2,
   *     totalPrice: 198.00,
   *     items: [{
   *       id: 1,
   *       productId: 1,
   *       name: "商品名称",
   *       image: "商品图片",
   *       price: 99.00,
   *       quantity: 1,
   *       selected: true,
   *       stock: 100,
   *       specs: {
   *         color: "白色",
   *         size: "M"
   *       }
   *     }]
   *   }
   * }
   */
  list(uid) {
    return request({
      url: `/Cart/userFind/${uid}`,
      method: 'get'
    })
  },

  /**
   * 添加商品到购物车
   * @param {Object} data 商品信息
   * @param {number} data.productId 商品ID
   * @param {number} data.quantity 数量
   * @param {Object} data.specs 规格信息
   * @returns {Promise} 返回添加结果
   * @example
   * {
   *   code: 200,
   *   message: "添加成功"
   * }
   */
  add(data) {
    return request({
      url: '/Cart/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新购物车商品数量
   * @param {number} id 购物车项ID
   * @param {number} quantity 新数量
   * @returns {Promise} 返回更新结果
   * @example
   * {
   *   code: 200,
   *   message: "更新成功"
   * }
   */
  update(data) {
    return request({
      url: `/Cart/update`,
      method: 'post',
      data
    })
  },

  /**
   * 删除购物车商品
   * @param {number} id 购物车项ID
   * @returns {Promise} 返回删除结果
   * @example
   * {
   *   code: 200,
   *   message: "删除成功"
   * }
   */
  delete(id) {
    return request({
      url: `/Cart/delete/${id}`,
      method: 'get'
    })
  },

  /**
   * 选择/取消选择商品
   */
  select(data) {
    return request({
      url: '/cart/select',
      method: 'post',
      data: {
        ids: data.ids,
        selected: data.selected
      }
    })
  },

  /**
   * 清空购物车
   * @returns {Promise} 返回清空结果
   * @example
   * {
   *   code: 200,
   *   message: "清空成功"
   * }
   */
  clear() {
    return request({
      url: '/cart/clear',
      method: 'delete'
    })
  }
} 