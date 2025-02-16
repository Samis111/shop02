<template>
  <div class="hot-recommend">
    <h2 class="section-title">热门推荐</h2>
    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <div class="product-actions">
            <button @click="addToCart(product)" class="action-btn">
              <i class="iconfont icon-cart"></i>
              加入购物车
            </button>
            <button @click="toggleFavorite(product)" class="action-btn">
              <i class="iconfont" :class="product.isFavorite ? 'icon-heart-filled' : 'icon-heart'"></i>
              {{ product.isFavorite ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHotRecommend',
  data() {
    return {
      products: [
        {
          id: 1,
          name: '时尚连衣裙',
          description: '2024春季新款气质显瘦',
          price: 199,
          originalPrice: 299,
          image: '/images/products/dress1.jpg',
          isFavorite: false
        },
        // 可以添加更多商品...
      ]
    }
  },
  methods: {
    addToCart(product) {
      // 实现添加到购物车的逻辑
      this.$emit('add-to-cart', product)
    },
    toggleFavorite(product) {
      product.isFavorite = !product.isFavorite
      // 实现收藏/取消收藏的逻辑
      this.$emit('toggle-favorite', {
        productId: product.id,
        isFavorite: product.isFavorite
      })
    }
  }
}
</script>

<style scoped>
.hot-recommend {
  padding: 20px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(255,255,255,0.9);
  display: flex;
  justify-content: space-around;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.product-image:hover .product-actions {
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
}

.action-btn:hover {
  color: #000;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.product-desc {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 18px;
  color: #f00;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}
</style> 