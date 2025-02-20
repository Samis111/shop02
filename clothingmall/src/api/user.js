import request from '@/utils/request'

// 改为具名导出
export const login = (data) => {
  return request({
    url: '/auto/login',
    method: 'post',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export const sendCode = (phone) => {
  return request({
    url: '/user/sendCode',
    method: 'post',
    data: { phone }
  })
}

export const getInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export const updateInfo = (data) => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

export const changePassword = (data) => {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
} 