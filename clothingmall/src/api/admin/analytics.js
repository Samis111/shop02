import request from '@/utils/request'

export default {
  /**
   * 获取商品销售数据
   */
  getProductSales(params) {
    return request({
      url: '/admin/analytics/product-sales',
      method: 'get',
      params
    })
  },

  /**
   * 获取月度销售数据
   */
  getMonthlySales(params) {
    return request({
      url: '/admin/analytics/monthly-sales',
      method: 'get',
      params
    })
  },

  /**
   * 获取年度销售数据
   */
  getYearlySales(params) {
    return request({
      url: '/admin/analytics/yearly-sales',
      method: 'get',
      params
    })
  },

  /**
   * 获取销售概览数据
   */
  getSalesOverview() {
    return request({
      url: '/admin/analytics/sales-overview',
      method: 'get'
    })
  }
} 