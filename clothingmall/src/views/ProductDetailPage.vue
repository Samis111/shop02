<template>
  <div class="product-detail-page">
    <app-header />

    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />

      <!-- 商品基本信息区域 -->
      <div class="product-basic">
        <div class="product-gallery">
          <product-image :images="product.images" :alt="product.name" />
        </div>

        <div class="product-info">
          <product-info :product="product" @add-to-cart="handleAddToCart" />
        </div>
      </div>

      <!-- 商品详情区域 -->
      <div class="product-detail">
        <el-tabs v-model="activeTab" class="detail-tabs">


          <el-tab-pane :label="`用户评价(${product.reviewCount})`" name="reviews">
            <product-review :product-id="productId" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 相关推荐 -->
      <related-product :current-product-id="productId" />
    </div>

    <app-footer />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import ProductImage from '@/components/ProductImage.vue'
import ProductInfo from '@/components/ProductInfo.vue'
import ProductReview from '@/components/ProductReview.vue'
import RelatedProduct from '@/components/RelatedProduct.vue'

export default {
  name: 'ProductDetailPage',
  components: {
    AppHeader,
    AppFooter,
    AppBreadcrumb,
    ProductImage,
    ProductInfo,
    ProductReview,
    RelatedProduct
  },
  data() {
    return {
      productId: null,
      product: null,
      activeTab: 'detail',
      breadcrumbs: [
        { name: '首页', path: '/' }
      ]
    }
  },
  created() {
    this.productId = this.$route.params.id
    this.fetchProductDetail()
  },
  methods: {
    async fetchProductDetail() {
      try {
        const response = await this.$api.product.getDetail(this.productId)  // 直接使用导入的方法
        this.product = response.data

        // 更新面包屑
        this.breadcrumbs = [
          { name: '首页', path: '/' },
          { name: '商品列表', path: '/products' },
          { name: this.product.name, path: `/products/${this.productId}` }
        ]
      } catch (error) {
        console.error('获取商品详情失败:', error)
        this.$message.error('获取商品详情失败')
      }
    },
    handleAddToCart(data) {
      // 由ProductInfo组件处理，这里可以添加额外逻辑
      console.log('商品已添加到购物车:', data)
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId && newId !== this.productId) {
          this.productId = newId
          this.fetchProductDetail()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.product-detail-page {
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

.product-basic {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-gallery {
  flex: 0 0 600px;
}

.product-info {
  flex: 1;
}

.product-detail {
  margin-bottom: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-tabs {
  padding: 20px;
}

.detail-content {
  padding: 20px;
  color: #333;
  line-height: 1.8;
}

.params-list {
  padding: 20px;
}

.param-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.param-item:last-child {
  border-bottom: none;
}

.param-label {
  width: 120px;
  color: #999;
}

.param-value {
  flex: 1;
  color: #333;
}

@media (max-width: 768px) {
  .product-basic {
    flex-direction: column;
    gap: 20px;
  }

  .product-gallery {
    flex: none;
    width: 100%;
  }
}
</style>