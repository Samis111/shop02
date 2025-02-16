<template>
  <div class="product-list-page">
    <app-header />
    
    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />
      
      <div class="content-wrapper">
        <!-- 筛选区域 -->
        <aside class="filter-sidebar">
          <product-filter @filter-change="handleFilterChange" />
        </aside>

        <!-- 商品列表区域 -->
        <div class="product-content">
          <!-- 排序工具栏 -->
          <div class="toolbar">
            <div class="result-count">
              找到 {{ total }} 个商品
            </div>
            <div class="view-options">
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <i class="iconfont icon-grid"></i>
              </button>
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <i class="iconfont icon-list"></i>
              </button>
            </div>
          </div>

          <!-- 商品列表 -->
          <product-list
            :products="products"
            :class="viewMode"
            @add-to-cart="handleAddToCart"
            @toggle-favorite="handleToggleFavorite"
          />

          <!-- 分页 -->
          <app-pagination
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @change="handlePageChange"
          />
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
      breadcrumbs: [
        { name: '首页', path: '/' },
        { name: '商品列表', path: '/products' }
      ],
      viewMode: 'grid', // 'grid' 或 'list'
      currentPage: 1,
      pageSize: 20,
      total: 0,
      products: [],
      filters: {
        sort: 'default',
        price: { min: null, max: null },
        sizes: [],
        colors: [],
        brands: [],
        styles: []
      }
    }
  },
  computed: {
    ...mapGetters('cart', ['totalCount']),
    ...mapGetters('favorite', ['isFavorite'])
  },
  created() {
    // 从路由参数中获取分类信息
    const { category } = this.$route.params
    if (category) {
      this.breadcrumbs.push({ 
        name: this.getCategoryName(category), 
        path: `/category/${category}` 
      })
    }
    
    this.fetchProducts()
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('favorite', ['toggleFavorite']),
    getCategoryName(category) {
      // TODO: 根据category获取分类名称
      return category
    },
    async fetchProducts() {
      try {
        // TODO: 调用API获取商品数据
        // const response = await this.$api.products.getList({
        //   page: this.currentPage,
        //   pageSize: this.pageSize,
        //   ...this.filters
        // })
        // this.products = response.data.items
        // this.total = response.data.total

        // 模拟数据
        this.products = [
          {
            id: 1,
            name: '时尚连衣裙',
            description: '2024春季新款气质显瘦',
            price: 199,
            originalPrice: 299,
            image: '/images/products/dress1.jpg',
            rating: 4.5,
            ratingCount: 128,
            sales: 1000,
            stock: 50,
            tags: ['新品', '热销'],
            isFavorite: false
          },
          // ... 更多商品数据
        ]
        this.total = 100
      } catch (error) {
        console.error('获取商品列表失败:', error)
        // TODO: 错误提示
      }
    },
    handleFilterChange(filters) {
      this.filters = filters
      this.currentPage = 1 // 重置页码
      this.fetchProducts()
    },
    handlePageChange(page) {
      this.fetchProducts()
    },
    async handleAddToCart(product) {
      try {
        await this.addToCart({ product })
        this.$message.success('添加成功')
      } catch (error) {
        this.$message.error('添加失败：' + error.message)
      }
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
    }
  }
}
</script>

<style scoped>
.product-list-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
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

.product-list.list {
  /* 列表视图样式 */
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
  padding: 20px;
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