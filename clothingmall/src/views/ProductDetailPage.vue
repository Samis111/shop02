<template>
  <div class="product-detail-page">
    <app-header />

    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product?.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 商品基本信息区域 -->
      <div class="product-basic" v-if="product">
        <!-- 商品图片 -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="product.url" :alt="product.name">
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-meta">
            <span class="product-type">{{ product.type }}</span>
            <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
          </div>
          
          <!-- 购买操作区 -->
          <div class="purchase-actions">
            <div class="quantity-selector">
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="99"
                size="small"
              />
            </div>
            <el-button 
              type="primary" 
              size="large"
              @click="handleAddToCart"
            >
              加入购物车
            </el-button>
            <el-button 
              :type="isFavorite ? 'danger' : 'default'"
              size="large"
              icon="el-icon-star-off"
              @click="handleToggleFavorite"
            >
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 商品详情区域 -->
      <div class="product-detail" v-if="product">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="detail-content">
              <p>{{ product.node || '暂无详细描述' }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'ProductDetailPage',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      productId: null,
      product: null,
      quantity: 1,
      activeTab: 'detail',
      isFavorite: false
    }
  },
  created() {
    this.productId = this.$route.params.id
    this.fetchProductDetail()
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('favorite', ['toggleFavorite']),
    
    async fetchProductDetail() {
      try {
        const response = await this.$api.product.getDetail(this.productId)
        this.product = response.data
      } catch (error) {
        console.error('获取商品详情失败:', error)
        this.$message.error('获取商品详情失败')
      }
    },
    async handleAddToCart() {
      try {
        await this.addToCart({
          product: this.product,
          quantity: this.quantity
        })
        this.$message.success('添加成功')
      } catch (error) {
        this.$message.error('添加失败：' + error.message)
      }
    },
    async handleToggleFavorite() {
      try {
        const newStatus = await this.toggleFavorite(this.product)
        this.isFavorite = newStatus
        this.$message.success(newStatus ? '收藏成功' : '已取消收藏')
      } catch (error) {
        this.$message.error('操作失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.product-detail-page {
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
}

.breadcrumb {
  margin-bottom: 20px;
}

.product-basic {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-gallery {
  flex: 0 0 500px;
}

.main-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 4px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 20px;
  font-size: 24px;
  color: #333;
}

.product-meta {
  margin-bottom: 30px;
}

.product-type {
  font-size: 16px;
  color: #666;
  margin-right: 20px;
}

.product-price {
  font-size: 28px;
  color: #ff4d4f;
  font-weight: bold;
}

.purchase-actions {
  margin-top: auto;
  display: flex;
  gap: 20px;
  align-items: center;
}

.quantity-selector {
  width: 120px;
}

.product-detail {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

.detail-content {
  padding: 20px 0;
  color: #666;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .product-basic {
    flex-direction: column;
    gap: 20px;
  }

  .product-gallery {
    flex: none;
  }

  .main-image {
    height: 300px;
  }

  .purchase-actions {
    flex-wrap: wrap;
  }
}
</style>