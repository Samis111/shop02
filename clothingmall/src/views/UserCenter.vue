<template>
  <div class="user-center">
    <app-header />
    
    <div class="main-content">
      <!-- 侧边栏导航 -->
      <aside class="sidebar">
        <h2>个人中心</h2>
        <el-menu
          :default-active="$route.path"
          router
        >
          <el-menu-item index="/user">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/user/orders">
            <i class="el-icon-s-order"></i>
            <span>我的订单</span>
          </el-menu-item>
          <el-menu-item index="/user/address">
            <i class="el-icon-location"></i>
            <span>收货地址</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 内容区域 -->
      <div class="content">
        <p>当前路径: {{ $route.path }}</p>
        <router-view></router-view>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'UserCenter',
  components: {
    AppHeader,
    AppFooter
  },
  created() {
    console.log('UserCenter created')
    console.log('Current route:', this.$route)
  }
}
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px 0;
}

.sidebar h2 {
  padding: 0 20px;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.content {
  flex: 1;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>