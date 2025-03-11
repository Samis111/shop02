import router from './index'
import store from '@/store'
import { Message } from 'element-ui'

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['user/isLoggedIn']
  const userInfo = store.state.user.userInfo
  console.log('Route guard:', { to, from, isLoggedIn, userInfo })
  
  // 需要登录的页面
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('Route requires auth')
    if (!isLoggedIn || !userInfo || !userInfo.uid) {
      console.log('Not logged in or invalid user info, redirecting to login')
      // 保存当前路由，登录后跳回
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      console.log('User logged in with valid info, proceeding')
      // 管理员路由检查
      const isAdminRoute = to.matched.some(record => record.meta.requiresAdmin)
      if (isAdminRoute) {
        console.log('Redirecting to admin dashboard')
        next('/admin/dashboard')
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    // 游客页面（如登录页）
    if (isLoggedIn && userInfo && userInfo.uid) {
      console.log('Logged in user trying to access guest page')
      next('/')
    } else {
      console.log('Guest accessing guest page')
      next()
    }
  } else {
    // 公共页面
    console.log('Public page, proceeding')
    next()
  }
})