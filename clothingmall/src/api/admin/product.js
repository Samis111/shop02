import request from '@/utils/request'

export default {
  /**
   * 获取商品列表
   */
  list(params) {
    return request({
      url: '/products',
      method: 'get',
      params
    })
  },

  /**
   * 添加商品
   */
  create(data) {
    return request({
      url: '/products/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新商品
   */
  update(id, data) {
    return request({
      url: `/products/update`,
      method: 'post',
      data
    })
  },

  /**
   * 删除商品
   */
  delete(id) {
    return request({
      url: `/products/delete/${id}`,
      method: 'get'
    })
  },

  /**
   * 上传商品图片
   */
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/file/Adminupload',
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
      url: `/products/${id}/status`,
      method: 'put',
      data: { status }
    })
  }
} 