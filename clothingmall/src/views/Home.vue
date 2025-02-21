<template>
  <div class="home-page">
    <app-header />
    
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="500px">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img :src="banner.valueurl" :alt="banner.thiskey">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="container">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="goToCategory(category.id)"
        >
          <img :src="category.icon" :alt="category.name">
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 新品上架 -->
    <div class="section new-arrivals">
      <div class="container">
        <div class="section-header">
          <h2>新品上架</h2>
          <router-link to="/products?sort=new" class="more-link">
            查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <div class="product-grid">
          <div v-for="product in newProducts" :key="product.id" class="product-card" @click="$router.push(`/products/${product.id}`)">
            <div class="product-image">
              <img :src="product.url" :alt="product.name">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-meta">
                <span class="product-type">{{ product.type }}</span>
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热销商品 -->
    <div class="section hot-sales">
      <div class="container">
        <div class="section-header">
          <h2>热销商品</h2>
          <router-link to="/products?sort=sales" class="more-link">
            查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <div class="product-grid">
          <div v-for="product in hotProducts" :key="product.id" class="product-card" @click="$router.push(`/products/${product.id}`)">
            <div class="product-image">
              <img :src="product.url" :alt="product.name">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-meta">
                <span class="product-type">{{ product.type }}</span>
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      banners: [],
      categories: [],
      newProducts: [],
      hotProducts: [],
      newProductsLoading: false,
      hotProductsLoading: false,
      recommendProductsLoading: false
    }
  },
  created() {
    this.fetchHomeData()
  },
  methods: {
    ...mapActions('category', ['fetchCategories']),
    async fetchHomeData() {
      try {
        // 并行请求数据
        await Promise.all([
          this.fetchBanners(),
          this.fetchCategories(),
          this.fetchNewProducts(),
          this.fetchHotProducts()
        ])
      } catch (error) {
        console.error('获取首页数据失败:', error)
      }
    },
    async fetchBanners() {
      try {
        const response = await this.$api.home.getBanners()
        this.banners = response.data
      } catch (error) {
        console.error('获取轮播图失败:', error)
      }
    },
    async fetchCategories() {
      try {
        const response = await this.$api.category.list()
        this.categories = response.data
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    },
    async fetchNewProducts() {
      this.newProductsLoading = true
      try {
        const response = await this.$api.product.list({
          sort: 'new',
          limit: 8
        })
        this.newProducts = response.data
      } catch (error) {
        console.error('获取新品失败:', error)
      } finally {
        this.newProductsLoading = false
      }
    },
    async fetchHotProducts() {
      this.hotProductsLoading = true
      try {
        const response = await this.$api.product.list({
          sort: 'sales',
          limit: 8
        })
        this.hotProducts = response.data
      } catch (error) {
        console.error('获取热销商品失败:', error)
      } finally {
        this.hotProductsLoading = false
      }
    },
    goToCategory(id) {
      this.$router.push(`/category/${id}`)
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

.banner-section {
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.banner-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.category-nav {
  margin-bottom: 40px;
  padding: 30px 0;
  background: #fff;
}

.category-nav .container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
}

.category-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  transform: translateY(-2px);
}

.category-item img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.category-item span {
  color: #333;
  font-size: 14px;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.more-link {
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s;
}

.more-link:hover {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .banner-section {
    margin-bottom: 20px;
  }
  
  .container {
    padding: 0 10px;
  }
  
  .category-nav {
    margin-bottom: 20px;
    padding: 15px 0;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
}

.hot-products {
  padding: 20px;
}

.hot-products h2 {
  text-align: center;
  margin-bottom: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 12px;
}

.product-name {
  margin: 0;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.product-type {
  color: #666;
  font-size: 14px;
}

.product-price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
}
</style> 