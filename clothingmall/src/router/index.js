import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/Home.vue'
import ProductListPage from '@/views/ProductListPage.vue'
import ProductDetailPage from '@/views/ProductDetailPage.vue'
import CartPage from '@/views/CartPage.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'
import UserCenter from '@/views/UserCenter.vue'
import LoginPage from '@/views/LoginPage.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductListPage
  },
  {
    path: '/category/:category',
    name: 'CategoryProducts',
    component: ProductListPage
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetailPage,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
    meta: {
      requiresAuth: true  // 需要登录才能访问
    }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: UserCenter,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      guest: true // 只允许未登录用户访问
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  
  // 需要登录的页面
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // 不需要登录的页面
    if (token && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  }
})

export default router
