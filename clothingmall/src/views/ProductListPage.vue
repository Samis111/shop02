<template>
  <div class="product-list-page">
    <app-header />

    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.params.category">
            {{ getCategoryName($route.params.category) }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else>全部商品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="content-wrapper">
        <!-- 筛选区域 -->
        <aside class="filter-sidebar">
          <product-filter :brands="brands" @filter-change="handleFilterChange" />
        </aside>

        <!-- 商品列表区域 -->
        <div class="product-content">
          <!-- 排序工具栏 -->
          <div class="toolbar">
            <div class="result-count">
              找到 {{ total }} 个商品
            </div>
            <div class="view-options">
              <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                <i class="el-icon-s-grid"></i>
              </button>
              <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                <i class="el-icon-menu"></i>
              </button>
            </div>
          </div>

          <!-- 商品列表 -->
          <div :class="['product-list', viewMode]">
            <div v-for="product in products" :key="product.id" class="product-card" @click="goToDetail(product.id)">
              <div class="product-image">
                <img :src="product.url" :alt="product.name">
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-meta">
                  <span class="product-type">{{ product.type }}</span>
                  <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
                </div>
                <div class="product-actions" @click.stop>
                  <el-button type="primary" size="small" @click="handleAddToCart(product)">
                    加入购物车
                  </el-button>
                  <el-button :type="isFavorite(product.id) ? 'danger' : 'default'" size="small" icon="el-icon-star-off"
                    @click="handleToggleFavorite({ productId: product.id })">
                    {{ isFavorite(product.id) ? '已收藏' : '收藏' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <el-pagination :current-page.sync="currentPage" :page-size="pageSize" :total="total"
            layout="prev, pager, next" @current-change="handlePageChange" />
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import AppPagination from '@/components/AppPagination.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import ProductList from '@/components/ProductList.vue'
import { mapActions, mapGetters } from 'vuex'

import cart from '@/api/cart'

import { mapState } from 'vuex'

export default {
  name: 'ProductListPage',
  components: {
    AppHeader,
    AppFooter,
    AppBreadcrumb,
    AppPagination,
    ProductFilter,
    ProductList
  },
  data() {
    return {
      viewMode: 'grid',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      products: [],
      category: 'brand',
      brands: [],
      filters: {
        brand: null,
        sort: 'default',
        price: {
          min: null,
          max: null
        }
      }
    }
  },
  computed: {
    ...mapGetters('cart', ['totalCount']),
    ...mapGetters('favorite', ['isFavorite']),
    ...mapState('user', ['userInfo'])
  },
  created() {
    // 从查询参数中获取排序方式
    if (this.$route.query.sort) {
      this.filters.sort = this.$route.query.sort
    }
    this.fetchInitialData()
  },
  methods: {
    // ...mapActions('cart', ['addToCart']),
    ...mapActions('favorite', ['toggleFavorite']),
    getCategoryName(category) {
      const categoryMap = {
        'brand': '品牌专区'
      }
      return categoryMap[category] || category
    },
    async fetchInitialData() {
      try {
        // 并行获取品牌列表和商品数据
        await Promise.all([
          this.fetchBrands(),
          this.fetchProducts()
        ])
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    async fetchBrands() {
      try {
        const response = await this.$api.brand.list()
        this.brands = response.data
      } catch (error) {
        console.error('获取品牌列表失败:', error)
        this.$message.error('获取品牌列表失败')
      }
    },
    async fetchProducts() {
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          brandId: this.filters.brand,
          sort: this.filters.sort,
          minPrice: this.filters.price.min,
          maxPrice: this.filters.price.max
        }

        console.log('请求参数:', params)
        console.log('当前分类: brand')

        let response = await this.$api.product.getByCategory('brand', params)

        console.log('API响应:', response)

        this.products = response.data.records
        this.total = response.data.total
        this.currentPage = response.data.current
        this.pageSize = response.data.size
      } catch (error) {
        console.error('获取商品列表失败:', error)
        this.$message.error('获取商品列表失败')
      }
    },
    handleFilterChange(filters) {
      this.filters = filters
      this.currentPage = 1 // 重置页码
      this.fetchProducts()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchProducts()
    },
    async handleAddToCart(product) {

   
      // try {
      await cart.add({
        uid: this.userInfo.id,
        tid: product.id,
        num: 1
      })
      this.$message.success('添加成功')
      // } catch (error) {
      //   this.$message.error('添加失败：' + error.message)
      // }
    },
    async handleToggleFavorite({ productId }) {
      try {
        const product = this.products.find(p => p.id === productId)
        if (product) {
          const newStatus = await this.toggleFavorite(product)
          this.$message.success(newStatus ? '收藏成功' : '已取消收藏')
        }
      } catch (error) {
        this.$message.error('操作失败：' + error.message)
      }
    },
    goToDetail(id) {
      this.$router.push(`/products/${id}`)
    }
  },
  watch: {
    // 只监听查询参数变化
    '$route.query': {
      handler(newQuery) {
        console.log('查询参数变化:', newQuery)
        if (newQuery.sort) {
          this.filters.sort = newQuery.sort
        }
        this.currentPage = 1 // 重置页码
        this.fetchProducts()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.product-list-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  /* 为固定头部留出空间 */
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 0;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.filter-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.product-content {
  flex: 1;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.result-count {
  color: #666;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.view-btn:hover,
.view-btn.active {
  color: #333;
  border-color: #333;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  padding-top: 100%;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px;
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
  margin-bottom: 10px;
}

.product-type {
  color: #666;
  font-size: 14px;
}

.product-price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 10px;
  z-index: 1;
}

/* 列表视图样式 */
.product-list.list {
  display: block;
}

.product-list.list .product-card {
  display: flex;
  margin-bottom: 20px;
}

.product-list.list .product-image {
  width: 200px;
  padding-top: 0;
  height: 200px;
}

.product-list.list .product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-list.list .product-actions {
  margin-top: 15px;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
  }

  .product-list.list .product-card {
    flex-direction: column;
  }

  .product-list.list .product-image {
    width: 100%;
    padding-top: 100%;
  }
}
</style>