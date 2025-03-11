import AdminLayout from '@/views/admin/Layout.vue'

export const adminRoutes = {
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/dashboard',  // 添加顶层重定向
  meta: { 
    requiresAuth: true,
    requiresAdmin: true  // 需要管理员权限
  },
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { title: '控制台' }
    },
    {
      path: 'brands',
      name: 'BrandManagement',
      component: () => import('@/views/admin/BrandManagement.vue'),
      meta: { title: '品牌管理' }
    },
    {
      path: 'products',
      name: 'ProductManagement',
      component: () => import('@/views/admin/ProductManagement.vue'),
      meta: { title: '商品管理' }
    },
    {
      path: 'users',
      name: 'UserManagement',
      component: () => import('@/views/admin/UserManagement.vue'),
      meta: { title: '用户管理' }
    },
    {
      path: 'analytics',
      name: 'Analytics',
      redirect: '/admin/analytics/products',  // 修改为完整路径
      children: [
        {
          path: 'products',
          name: 'ProductAnalytics',
          component: () => import('@/views/admin/analytics/ProductAnalytics.vue'),
          meta: { title: '商品销售分析' }
        },
        {
          path: 'monthly',
          name: 'MonthlyAnalytics',
          component: () => import('@/views/admin/analytics/MonthlyAnalytics.vue'),
          meta: { title: '月销售量分析' }
        },
        {
          path: 'yearly',
          name: 'YearlyAnalytics',
          component: () => import('@/views/admin/analytics/YearlyAnalytics.vue'),
          meta: { title: '年销售量分析' }
        }
      ]
    }
  ]
} 