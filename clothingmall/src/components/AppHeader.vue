<template>
  <header class="header">
    <!-- Logo区域 -->
    <div class="logo" @click="$router.push('/')">
      <img src="@/assets/logo.png" alt="商城Logo">
      <span class="store-name">时尚商城</span>
    </div>

    <!-- 导航栏 -->
    <nav class="nav-menu">
      <ul>
        <li v-for="(item, index) in navItems" :key="index">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </li>
      </ul>
    </nav>

    <!-- 搜索框 -->
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchKeyword"
        @keyup.enter="handleSearch"
        placeholder="请输入搜索关键词"
      >
      <button @click="handleSearch">搜索</button>
    </div>

    <!-- 用户操作区 -->
    <div class="user-actions">
      <template v-if="!isLoggedIn">
        <router-link to="/login" class="login-btn">登录</router-link>
        <!-- <router-link to="/register" class="register-btn">注册</router-link> -->
      </template>
      <template v-else>
        <div class="user-info" @click="showUserMenu = !showUserMenu">
          <img :src="userInfo.avatar" class="avatar" alt="用户头像">
          <span>{{ userInfo.username }}</span>
          <!-- 用户菜单 -->
          <div v-show="showUserMenu" class="user-menu">
            <router-link to="/user/profile">个人信息</router-link>
            <router-link to="/user/orders">我的订单</router-link>
            <a @click="handleLogout">退出登录</a>
          </div>
        </div>
      </template>
      <div class="icons">
        <router-link to="/cart" class="cart-icon">
          <i class="iconfont icon-cart"></i>
          <span v-if="cartCount" class="cart-count">{{ cartCount }}</span>
        </router-link>
        <router-link to="/favorites" class="favorite-icon">
          <i class="iconfont icon-heart"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
      searchKeyword: '',
      showUserMenu: false,
      navItems: [
        { name: '首页', path: '/' },
        { name: '男装', path: '/category/men' },
        { name: '女装', path: '/category/women' },
        { name: '童装', path: '/category/children' },
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState('user', ['userInfo']),
    ...mapState('cart', ['cartItems']),
    cartCount() {
      return this.cartItems ? this.cartItems.length : 0
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$router.push(`/search?keyword=${encodeURIComponent(this.searchKeyword)}`)
      }
    },
    async handleLogout() {
      try {
        await this.logout()
        this.$message.success('退出登录成功')
        this.$router.push('/login')
      } catch (error) {
        this.$message.error('退出登录失败')
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.store-name {
  font-size: 20px;
  font-weight: bold;
}

.nav-menu {
  margin-left: 40px;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin: 0 15px;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
}

.search-box {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.search-box input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.search-box button {
  padding: 8px 15px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.login-btn,
.register-btn {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}

.user-info {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-menu a {
  display: block;
  padding: 5px 20px;
  color: #333;
  text-decoration: none;
}

.icons {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.cart-icon,
.favorite-icon {
  position: relative;
  margin: 0 10px;
  color: #333;
  text-decoration: none;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: red;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}
</style> 