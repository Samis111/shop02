import request from '@/utils/request'

export default {
  /**
   * 获取轮播图列表
   */
  list() {
    return request({
      url: '/home/adminlist',
      method: 'get'
    })
  },

  /**
   * 添加轮播图
   */
  create(data) {
    return request({
      url: '/home/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新轮播图
   */
  update(id, data) {
    return request({
      url: `/home/update/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除轮播图
   */
  delete(id) {
    return request({
      url: `/home/delete/${id}`,
      method: 'get'
    })
  },

  /**
   * 上传轮播图
   */
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/admin/upload/banner',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 更新排序
   */
  updateSort(data) {
    return request({
      url: '/admin/banners/sort',
      method: 'put',
      data
    })
  }
} 