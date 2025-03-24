<template>
  <header class="header">
    <!-- Logo区域 -->
    <div class="logo" @click="$router.push('/')">
      <img src="@/assets/logo.png" alt="商城Logo">
      <span class="store-name">品牌服饰商城</span>
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
        <div class="user-info" @click="handleUserMenuClick">
          <img :src="userInfo.url" class="avatar" alt="用户头像">
          <span>{{ userInfo.username }}</span>
          <!-- 用户菜单 -->
          <div v-show="showUserMenu" class="user-menu">
            <router-link to="/user" @click.native="showUserMenu = false">个人中心</router-link>
            <router-link to="/user/orders" @click.native="showUserMenu = false">我的订单</router-link>
            <a @click="handleLogout">退出登录</a>
          </div>
        </div>
      </template>
      <div class="icons">
        <router-link to="/cart" class="cart-icon" @click.native="handleCartClick">
          <el-badge :value="cartCount" :hidden="!cartCount">
            <i class="el-icon-shopping-cart-2"></i>
          </el-badge>
        </router-link>
        <router-link to="/favorites" class="favorite-icon">
          <i class="el-icon-star-off"></i>
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
        { name: '品牌专区', path: '/category/brand' }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState('user', ['userInfo']),
    ...mapState('cart', ['cartItems']),
    cartCount() {
      return this.cartItems.length
    }
  },
  created() {
    // 如果用户已登录，获取购物车数据
    console.log(this.userInfo)
    console.log(this.isLoggedIn)
    if (this.isLoggedIn) {
      this.fetchCartData()
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    ...mapActions('cart', ['fetchCartItems']),
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$router.push(`/search?keyword=${encodeURIComponent(this.searchKeyword)}`)
      }
    },
    handleUserMenuClick() {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.showUserMenu = !this.showUserMenu
    },
    async handleLogout() {
      try {
        await this.logout()
        this.showUserMenu = false
        this.$message.success('退出登录成功')
        await this.$router.replace('/login')
      } catch (error) {
        console.error('Logout error:', error)
        this.$message.error('退出登录失败：' + (error.message || '未知错误'))
      }
    },
    handleCartClick() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return false
      }
    },
    async fetchCartData() {
      try {
        if (this.userInfo && (this.userInfo.uid || this.userInfo.id)) {
          const userId = this.userInfo.uid || this.userInfo.id
          console.log('Fetching cart data for user:', userId)
          await this.fetchCartItems(userId)
        } else {
          console.warn('No user ID available')
        }
      } catch (error) {
        console.error('Failed to fetch cart data:', error)
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
  font-size: 16px;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #ff4d4f;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ff4d4f;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.nav-menu a:hover::after,
.nav-menu a.router-link-active::after {
  transform: scaleX(1);
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
  gap: 15px;
}

.cart-icon,
.favorite-icon {
  position: relative;
  color: #333;
  text-decoration: none;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.cart-icon:hover,
.favorite-icon:hover {
  color: #ff4d4f;
}

/* 移除旧的购物车数量样式 */
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