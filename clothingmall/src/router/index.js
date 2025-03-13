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
  },
  {
    path: '/payment/success/:orderId',
    name: 'PaymentSuccess',
    component: () => import('@/views/PaymentSuccess.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
 
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'brands',
        name: 'AdminBrands',
        component: () => import('@/views/admin/BrandManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UserManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'banners',
        name: 'AdminBanners',
        component: () => import('@/views/admin/BannerManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: () => import('@/views/admin/analytics/ProductAnalytics.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'analytics/products',
        name: 'AdminProductsAnalytics',
        component: () => import('@/views/admin/analytics/ProductAnalytics.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'analytics/monthly',
        name: 'AdminMonthlyAnalytics',
        component: () => import('@/views/admin/analytics/MonthlyAnalytics.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'analytics/yearly',
        name: 'AdminYearlyAnalytics',
        component: () => import('@/views/admin/analytics/YearlyAnalytics.vue'),
        meta: { requiresAdmin: true }
      }
      
    ]
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
