import request from '@/utils/request'

export default {
  /**
   * 获取品牌列表
   */
  list(params) {
    return request({
      url: '/brands',
      method: 'get',
      params
    })
  },

  /**
   * 添加品牌
   */
  create(data) {
    return request({
      url: '/brands/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新品牌
   */
  update(id, data) {
    return request({
      url: `/brands/update`,
      method: 'post',
      data
    })
  },

  /**
   * 删除品牌
   */
  delete(id) {
    return request({
      url: `/brands/delete/${id}`,
      method: 'get'
    })
  },

  /**
   * 上传品牌logo
   */
  uploadLogo(file) {
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
  }
} 