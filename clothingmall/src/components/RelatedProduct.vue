<template>
  <div class="related-product">
    <h2 class="section-title">相关推荐</h2>
    
    <!-- 商品滑动区域 -->
    <div class="product-slider" ref="slider">
      <button 
        class="nav-btn prev"
        :disabled="isStart"
        @click="scroll(-1)"
      >
        <i class="iconfont icon-arrow-left"></i>
      </button>

      <div class="product-list" ref="list">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
            <div class="quick-actions">
              <button 
                class="action-btn"
                @click="addToCart(product)"
              >
                <i class="iconfont icon-cart"></i>
                加入购物车
              </button>
            </div>
          </div>

          <div class="product-info">
            <router-link 
              :to="{ name: 'ProductDetail', params: { id: product.id }}"
              class="product-name"
            >
              {{ product.name }}
            </router-link>
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span 
                v-if="product.originalPrice" 
                class="original-price"
              >¥{{ product.originalPrice }}</span>
            </div>
            <div class="product-meta">
              <span class="sales">销量 {{ product.sales }}</span>
              <div class="rating">
                <i class="iconfont icon-star-filled"></i>
                <span>{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        class="nav-btn next"
        :disabled="isEnd"
        @click="scroll(1)"
      >
        <i class="iconfont icon-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RelatedProduct',
  props: {
    currentProductId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      products: [],
      isStart: true,
      isEnd: false,
      scrollStep: 200
    }
  },
  created() {
    this.fetchRelatedProducts()
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    async fetchRelatedProducts() {
      try {
        // TODO: 调用API获取相关商品
        const response = await this.$api.products.getRelated(this.currentProductId)
        this.products = response.data
      } catch (error) {
        console.error('获取相关商品失败:', error)
        this.$message.error('获取推荐商品失败')
      }
    },
    scroll(direction) {
      const list = this.$refs.list
      if (!list) return

      const scrollLeft = list.scrollLeft + (this.scrollStep * direction)
      list.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })

      // 更新按钮状态
      this.$nextTick(() => {
        this.isStart = list.scrollLeft <= 0
        this.isEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth
      })
    },
    async handleAddToCart(product) {
      try {
        await this.addToCart({
          product,
          quantity: 1
        })
        this.$message.success('已添加到购物车')
      } catch (error) {
        this.$message.error('添加失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.related-product {
  padding: 20px;
}

.section-title {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px;
}

.product-slider {
  position: relative;
  padding: 0 40px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.nav-btn.prev {
  left: 0;
}

.nav-btn.next {
  right: 0;
}

.nav-btn:disabled {
  color: #ddd;
  cursor: not-allowed;
}

.product-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.product-list::-webkit-scrollbar {
  display: none;
}

.product-card {
  flex: 0 0 200px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(255,255,255,0.9);
  transform: translateY(100%);
  transition: transform 0.3s;
}

.product-image:hover .quick-actions {
  transform: translateY(0);
}

.action-btn {
  width: 100%;
  padding: 8px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.product-info {
  padding: 15px;
}

.product-name {
  display: block;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  margin-bottom: 10px;
}

.current-price {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 5px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #ffd700;
}

@media (max-width: 768px) {
  .product-slider {
    padding: 0 32px;
  }
  
  .product-card {
    flex: 0 0 160px;
  }
}
</style> 