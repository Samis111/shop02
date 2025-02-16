import request from '@/utils/request'

export default {
  /**
   * 获取首页轮播图
   * @returns {Promise} 返回轮播图列表
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: [{
   *     id: 1,
   *     title: "夏季新品",
   *     description: "清凉一夏，超值特惠",
   *     image: "https://example.com/banner1.jpg",
   *     link: "/products?category=summer",
   *     sort: 1
   *   }]
   * }
   */
  getBanners() {
    return request({
      url: '/home/banners',
      method: 'get'
    })
  }
} 