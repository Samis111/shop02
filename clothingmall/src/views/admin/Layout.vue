<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo">
        <span>商城管理系统</span>
      </div>
      
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <i class="el-icon-s-home"></i>
          <span>控制台</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/brands">
          <i class="el-icon-s-flag"></i>
          <span>品牌管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/products">
          <i class="el-icon-s-goods"></i>
          <span>商品管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/users">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/banners">
          <i class="el-icon-picture"></i>
          <span>轮播图管理</span>
        </el-menu-item>
        
        <el-submenu index="analytics">
          <template slot="title">
            <i class="el-icon-s-data"></i>
            <span>数据分析</span>
          </template>
          <el-menu-item index="/admin/analytics/products">
            商品销售分析
          </el-menu-item>
          <el-menu-item index="/admin/analytics/monthly">
            月销售量分析
          </el-menu-item>
          <el-menu-item index="/admin/analytics/yearly">
            年销售量分析
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!-- 主要内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left">
          <i 
            class="el-icon-s-fold toggle-sidebar" 
            @click="toggleSidebar"
          ></i>
          <breadcrumb />
        </div>
        
        <div class="right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="avatar-container">
              <img :src="userAvatar" class="avatar">
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="app-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'

export default {
  name: 'AdminLayout',
  components: {
    Breadcrumb
  },
  computed: {
    ...mapState('user', ['userInfo']),
    userAvatar() {
      return this.userInfo?.avatar
    }
  },
  methods: {
    toggleSidebar() {
      // 实现侧边栏折叠功能
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/admin/profile')
          break
        case 'logout':
          this.$store.dispatch('user/logout')
          this.$router.push('/login')
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 210px;
  background: #304156;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: #fff;
    
    img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
  }
  
  .sidebar-menu {
    border: none;
  }
}

.main-container {
  flex: 1;
  margin-left: 210px;
  display: flex;
  flex-direction: column;
  
  .navbar {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    
    .left {
      display: flex;
      align-items: center;
      
      .toggle-sidebar {
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    
    .avatar-container {
      cursor: pointer;
      
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
  
  .app-main {
    flex: 1;
    padding: 20px;
    background: #f0f2f5;
  }
}
</style> 