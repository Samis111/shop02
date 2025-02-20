import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// 创建 axios 实例
const service = axios.create({
  baseURL: "/api",
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      // 处理业务错误
      const error = new Error(res.message || '请求失败')
      error.code = res.code
      return Promise.reject(error)
    }
    
    return res
  },
  error => {
    console.error('响应错误：', error)
    return Promise.reject(error)
  }
)

export default service 