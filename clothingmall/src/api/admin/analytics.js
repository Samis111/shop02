import request from '@/utils/request'

export default {
  /**
   * 获取商品销售数据
   */
  getProductSales(params) {
    return request({
      url: '/analytics/tidtotal',
      method: 'get',
      params
    })
  },

  /**
   * 获取月度销售数据
   */
  getMonthlySales(params) {
    return request({
      url: '/analytics/monthly',
      method: 'get',
      params
    })
  },

  /**
   * 获取年度销售数据
   */
  getYearlySales(params) {
    return request({
      url: '/analytics/year',
      method: 'get',
      params
    })
  },

  /**
   * 获取销售概览数据
   */
  getSalesOverview() {
    return request({
      url: '/analytics/totalAll',
      method: 'get'
    })
  }
} 