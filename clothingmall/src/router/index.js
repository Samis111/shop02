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
    },
    children: [
      {
        path: '',  // 空路径表示默认子路由
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue')
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/UserOrders.vue')
      },
      {
        path: 'address',
        name: 'UserAddress',
        component: () => import('@/views/UserAddress.vue')
      }
    ]
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
      next()
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

export default router
