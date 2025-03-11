import request from '@/utils/request'

export default {
  /**
   * 获取商品列表
   */
  list(params) {
    return request({
      url: '/admin/products',
      method: 'get',
      params
    })
  },

  /**
   * 添加商品
   */
  create(data) {
    return request({
      url: '/admin/products',
      method: 'post',
      data
    })
  },

  /**
   * 更新商品
   */
  update(id, data) {
    return request({
      url: `/admin/products/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除商品
   */
  delete(id) {
    return request({
      url: `/admin/products/${id}`,
      method: 'delete'
    })
  },

  /**
   * 上传商品图片
   */
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/admin/upload/product-image',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 更新商品状态
   */
  updateStatus(id, status) {
    return request({
      url: `/admin/products/${id}/status`,
      method: 'put',
      data: { status }
    })
  }
} 