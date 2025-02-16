<template>
  <div class="product-list">
    <!-- 商品网格 -->
    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <div class="product-tags" v-if="product.tags && product.tags.length">
            <span 
              v-for="tag in product.tags" 
              :key="tag"
              class="tag"
            >{{ tag }}</span>
          </div>
          <div class="quick-actions">
            <button 
              @click.stop="addToCart(product)" 
              class="action-btn"
            >
              <i class="iconfont icon-cart"></i>
              加入购物车
            </button>
            <button 
              @click.stop="toggleFavorite(product)"
              class="action-btn"
              :class="{ active: isFavorite(product.id) }"
            >
              <i class="iconfont" :class="isFavorite(product.id) ? 'icon-heart-filled' : 'icon-heart'"></i>
              {{ isFavorite(product.id) ? '已收藏' : '收藏' }}
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
          <div class="product-brief">
            <p class="description">{{ product.description }}</p>
            <div class="rating">
              <span class="stars">
                <i 
                  v-for="n in 5" 
                  :key="n"
                  class="iconfont"
                  :class="n <= product.rating ? 'icon-star-filled' : 'icon-star'"
                ></i>
              </span>
              <span class="rating-count">({{ product.ratingCount }})</span>
            </div>
          </div>
          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
            <span class="discount" v-if="product.discount">{{ product.discount }}折</span>
          </div>
          <div class="product-meta">
            <span class="sales">销量 {{ product.sales }}</span>
            <span class="stock" v-if="product.stock <= 10">仅剩 {{ product.stock }} 件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="!products.length" class="no-data">
      <i class="iconfont icon-empty"></i>
      <p>暂无商品数据</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    addToCart(product) {
      this.$emit('add-to-cart', product)
    },
    toggleFavorite(product) {
      this.$emit('toggle-favorite', {
        productId: product.id,
        isFavorite: !product.isFavorite
      })
    },
    goToDetail(productId) {
      this.$router.push({
        name: 'ProductDetail',
        params: { id: productId }
      })
    },
    isFavorite(productId) {
      // Implement the logic to check if a product is favorite
      return false; // Placeholder return, actual implementation needed
    }
  }
}
</script>

<style scoped>
.product-list {
  min-height: 200px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.product-card {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.tag {
  padding: 2px 8px;
  background: rgba(255,0,0,0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
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
  z-index: 1;
}

.product-image:hover .quick-actions {
  transform: translateY(0);
}

.action-btn {
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #000;
}

.action-btn.active {
  color: #ff4d4f;
}

.product-info {
  padding: 15px;
}

.product-name {
  display: block;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  font-weight: 500;
}

.product-name:hover {
  color: #000;
}

.description {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.stars {
  color: #ffd700;
}

.rating-count {
  font-size: 12px;
  color: #999;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 20px;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount {
  font-size: 12px;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  padding: 0 4px;
  border-radius: 2px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.stock {
  color: #ff4d4f;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }

  .product-name {
    font-size: 14px;
  }

  .description {
    font-size: 12px;
  }

  .current-price {
    font-size: 16px;
  }
}
</style> 