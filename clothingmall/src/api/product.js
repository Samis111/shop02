import request from '@/utils/request'

export default {
  /**
   * 获取所有商品列表
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} [params.sort] 排序方式(default/price-asc/price-desc/sales)
   * @param {number} [params.minPrice] 最低价格
   * @param {number} [params.maxPrice] 最高价格
   * @returns {Promise} 返回商品列表和分页信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     total: 100,
   *     list: [{
   *       id: 1,
   *       name: "夏季短袖T恤",
   *       price: 99.00,
   *       originalPrice: 199.00,
   *       image: "https://example.com/t-shirt.jpg",
   *       sales: 1000,
   *       rating: 4.5,
   *       ratingCount: 200
   *     }]
   *   }
   * }
   */
  list(params) {
    return request({
      url: '/products',
      method: 'get',
      params
    })
  },

  /**
   * 获取分类商品列表
   * @param {string} category 分类(men/women/children)
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} [params.sort] 排序方式(default/price-asc/price-desc/sales)
   * @param {number} [params.minPrice] 最低价格
   * @param {number} [params.maxPrice] 最高价格
   */
  getByCategory(category, params) {
    return request({
      url: `/category/${category}/products`,
      method: 'get',
      params
    })
  },

  /**
   * 获取商品详情
   * @param {string} id 商品ID
   * @returns {Promise} 返回商品详细信息
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: {
   *     id: 1,
   *     name: "夏季短袖T恤",
   *     price: 99.00,
   *     originalPrice: 199.00,
   *     description: "商品描述...",
   *     images: ["url1", "url2"],
   *     specs: [{
   *       name: "颜色",
   *       values: ["白色", "黑色"]
   *     }, {
   *       name: "尺码",
   *       values: ["S", "M", "L"]
   *     }],
   *     stock: 100,
   *     sales: 1000,
   *     rating: 4.5,
   *     ratingCount: 200,
   *     reviews: [{
   *       id: 1,
   *       user: {
   *         id: 1,
   *         nickname: "用户名",
   *         avatar: "头像url"
   *       },
   *       rating: 5,
   *       content: "评价内容",
   *       images: ["图片url"],
   *       createTime: "2023-01-01 12:00:00"
   *     }]
   *   }
   * }
   */
  getDetail(id) {
    return request({
      url: `/products/${id}`,
      method: 'get'
    })
  },

  /**
   * 获取推荐商品
   * @param {Object} params 查询参数
   * @param {number} params.limit 获取数量
   * @returns {Promise} 返回推荐商品列表
   * @example
   * {
   *   code: 200,
   *   message: "success",
   *   data: [{
   *     id: 1,
   *     name: "商品名称",
   *     price: 99.00,
   *     image: "商品图片url"
   *   }]
   * }
   */
  recommend(params) {
    return request({
      url: '/products/recommend',
      method: 'get',
      params
    })
  }
} 