import router from './index'
import store from '@/store'
import { Message } from 'element-ui'

router.beforeEach(async (to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 判断当前是否已登录
    const isLoggedIn = store.getters['user/isLoggedIn']
    
    if (!isLoggedIn) {
      Message.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } 
  // 判断该路由是否只允许未登录用户访问
  else if (to.matched.some(record => record.meta.guest)) {
    const isLoggedIn = store.getters['user/isLoggedIn']
    
    if (isLoggedIn) {
      next('/')
    } else {
      next()
    }
  }
  else {
    next()
  }
}) 