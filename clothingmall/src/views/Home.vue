<template>
  <div class="home-page">
    <app-header />
    
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="500px">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img :src="banner.image" :alt="banner.title">
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
            <router-link 
              :to="banner.link"
              class="banner-btn"
            >立即查看</router-link>
          </div>
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
        <product-list 
          :products="newProducts"
          :loading="newProductsLoading"
        />
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
        <product-list 
          :products="hotProducts"
          :loading="hotProductsLoading"
        />
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="section recommendations">
      <div class="container">
        <div class="section-header">
          <h2>为您推荐</h2>
          <router-link to="/products" class="more-link">
            查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <product-list 
          :products="recommendProducts"
          :loading="recommendProductsLoading"
        />
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProductList from '@/components/ProductList.vue'

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    ProductList
  },
  data() {
    return {
      banners: [],
      categories: [],
      newProducts: [],
      hotProducts: [],
      recommendProducts: [],
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
          this.fetchHotProducts(),
          this.fetchRecommendProducts()
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
    async fetchNewProducts() {
      this.newProductsLoading = true
      try {
        const response = await this.$api.product.list({
          sort: 'new',
          limit: 8
        })
        this.newProducts = response.data.list
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
        this.hotProducts = response.data.list
      } catch (error) {
        console.error('获取热销商品失败:', error)
      } finally {
        this.hotProductsLoading = false
      }
    },
    async fetchRecommendProducts() {
      this.recommendProductsLoading = true
      try {
        const response = await this.$api.product.recommend({
          limit: 8
        })
        this.recommendProducts = response.data.list
      } catch (error) {
        console.error('获取推荐商品失败:', error)
      } finally {
        this.recommendProductsLoading = false
      }
    },
    goToCategory(categoryId) {
      this.$router.push({
        name: 'CategoryProducts',
        params: { category: categoryId }
      })
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.banner-section {
  margin-bottom: 40px;
}

.banner-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-content h2 {
  font-size: 36px;
  margin: 0 0 15px;
}

.banner-content p {
  font-size: 18px;
  margin: 0 0 30px;
  opacity: 0.9;
}

.banner-btn {
  display: inline-block;
  padding: 12px 30px;
  background: #fff;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.banner-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
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
  
  .banner-content {
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
  }
  
  .banner-content h2 {
    font-size: 24px;
  }
  
  .banner-content p {
    font-size: 14px;
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
</style> 