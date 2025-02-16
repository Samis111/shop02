<template>
  <div class="user-center">
    <app-header />

    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />

      <div class="user-content">
        <!-- 左侧导航 -->
        <div class="side-nav">
          <div class="nav-group">
            <h3 class="group-title">账户管理</h3>
            <div class="nav-item" :class="{ active: currentTab === 'profile' }" @click="switchTab('profile')">
              <i class="iconfont icon-user"></i>
              个人信息
            </div>
            <div class="nav-item" :class="{ active: currentTab === 'address' }" @click="switchTab('address')">
              <i class="iconfont icon-location"></i>
              收货地址
            </div>
          </div>

          <div class="nav-group">
            <h3 class="group-title">交易管理</h3>
            <div class="nav-item" :class="{ active: currentTab === 'orders' }" @click="switchTab('orders')">
              <i class="iconfont icon-order"></i>
              我的订单
            </div>
            <div class="nav-item" :class="{ active: currentTab === 'favorites' }" @click="switchTab('favorites')">
              <i class="iconfont icon-heart"></i>
              我的收藏
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="main-section">
          <keep-alive>
            <component :is="currentComponent" />
          </keep-alive>
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import UserInfo from '@/components/UserInfo.vue'
import AddressManagement from '@/components/AddressManagement.vue'
import OrderManagement from '@/components/OrderManagement.vue'
import FavoriteList from '@/components/FavoriteList.vue'

export default {
  name: 'UserCenter',
  components: {
    AppHeader,
    AppFooter,
    AppBreadcrumb,
    UserInfo,
    AddressManagement,
    OrderManagement,
    FavoriteList
  },
  data() {
    return {
      currentTab: 'profile',
      breadcrumbs: [
        { name: '首页', path: '/' },
        { name: '个人中心', path: '/user' }
      ]
    }
  },
  computed: {
    ...mapState('user', ['info']),
    currentComponent() {
      const componentMap = {
        profile: 'UserInfo',
        address: 'AddressManagement',
        orders: 'OrderManagement',
        favorites: 'FavoriteList'
      }
      return componentMap[this.currentTab]
    }
  },
  created() {
    // 从路由参数获取初始标签
    const { tab } = this.$route.query
    if (tab && ['profile', 'address', 'orders', 'favorites'].includes(tab)) {
      this.currentTab = tab
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
      // 更新 URL，但不重新加载页面
      this.$router.replace({
        query: { ...this.$route.query, tab }
      })
    }
  }
}
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.user-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.side-nav {
  background: #fff;
  border-radius: 8px;
  padding: 20px 0;
}

.nav-group {
  margin-bottom: 30px;
}

.nav-group:last-child {
  margin-bottom: 0;
}

.group-title {
  padding: 0 20px;
  margin: 0 0 10px;
  font-size: 16px;
  color: #999;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  color: #ff4d4f;
  background: #fff1f0;
}

.nav-item.active {
  color: #ff4d4f;
  background: #fff1f0;
  border-right: 2px solid #ff4d4f;
}

.nav-item .iconfont {
  font-size: 18px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .user-content {
    grid-template-columns: 1fr;
  }

  .side-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    margin: -10px -10px 10px;
    border-radius: 0;
    padding: 10px;
  }

  .nav-group {
    margin-bottom: 15px;
  }

  .nav-item {
    padding: 8px 15px;
  }
}
</style>