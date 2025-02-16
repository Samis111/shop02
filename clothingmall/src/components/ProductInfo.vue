<template>
  <div class="product-info">
    <!-- 基本信息 -->
    <h1 class="product-name">{{ product.name }}</h1>
    <div class="product-brief">{{ product.brief }}</div>
    
    <!-- 价格信息 -->
    <div class="price-section">
      <div class="price-info">
        <span class="current-price">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
        <span v-if="product.discount" class="discount-tag">{{ product.discount }}折</span>
      </div>
      <div class="promotion" v-if="product.promotion">
        <span class="promotion-tag">促销</span>
        <span class="promotion-text">{{ product.promotion }}</span>
      </div>
    </div>

    <!-- 选择区域 -->
    <div class="select-section">
      <!-- 颜色选择 -->
      <div class="select-item">
        <div class="select-label">颜色</div>
        <div class="color-options">
          <div 
            v-for="color in product.colors" 
            :key="color.value"
            class="color-item"
            :class="{ active: selectedColor === color.value }"
            @click="selectColor(color.value)"
          >
            <span 
              class="color-circle"
              :style="{ backgroundColor: color.code }"
            ></span>
            <span class="color-name">{{ color.name }}</span>
          </div>
        </div>
      </div>

      <!-- 尺码选择 -->
      <div class="select-item">
        <div class="select-label">
          尺码
          <span 
            class="size-guide"
            @click="showSizeGuide = true"
          >尺码指南</span>
        </div>
        <div class="size-options">
          <button
            v-for="size in product.sizes"
            :key="size.value"
            class="size-btn"
            :class="{
              active: selectedSize === size.value,
              disabled: !size.stock
            }"
            :disabled="!size.stock"
            @click="selectSize(size.value)"
          >
            {{ size.name }}
            <span v-if="!size.stock" class="out-of-stock">无货</span>
          </button>
        </div>
      </div>

      <!-- 数量选择 -->
      <div class="select-item">
        <div class="select-label">数量</div>
        <div class="quantity-selector">
          <button 
            class="quantity-btn"
            :disabled="quantity <= 1"
            @click="updateQuantity(-1)"
          >-</button>
          <input 
            type="number"
            v-model.number="quantity"
            :min="1"
            :max="maxQuantity"
            @input="handleQuantityInput"
          >
          <button 
            class="quantity-btn"
            :disabled="quantity >= maxQuantity"
            @click="updateQuantity(1)"
          >+</button>
          <span class="stock-info">库存 {{ currentStock }} 件</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button 
        class="action-btn buy-now"
        :disabled="!isValid"
        @click="buyNow"
      >立即购买</button>
      <button 
        class="action-btn add-to-cart"
        :disabled="!isValid"
        @click="addToCart"
      >加入购物车</button>
      <button 
        class="action-btn favorite"
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        <i class="iconfont" :class="isFavorite ? 'icon-heart-filled' : 'icon-heart'"></i>
        {{ isFavorite ? '已收藏' : '收藏' }}
      </button>
    </div>

    <!-- 商品信息 -->
    <div class="product-meta">
      <div class="meta-item">
        <span class="meta-label">商品编号：</span>
        <span class="meta-value">{{ product.sku }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">材质：</span>
        <span class="meta-value">{{ product.material }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">品牌：</span>
        <span class="meta-value">{{ product.brand }}</span>
      </div>
    </div>

    <!-- 尺码指南弹窗 -->
    <el-dialog
      title="尺码指南"
      :visible.sync="showSizeGuide"
      width="600px"
      class="size-guide-dialog"
    >
      <size-guide :category="product.category" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SizeGuide from './SizeGuide.vue'

export default {
  name: 'ProductInfo',
  components: {
    SizeGuide
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedColor: '',
      selectedSize: '',
      quantity: 1,
      showSizeGuide: false
    }
  },
  computed: {
    ...mapGetters('favorite', ['isFavorite']),
    currentStock() {
      if (!this.selectedSize || !this.selectedColor) return 0
      const size = this.product.sizes.find(s => s.value === this.selectedSize)
      return size ? size.stock : 0
    },
    maxQuantity() {
      return Math.min(this.currentStock, 10) // 限制最大购买数量为10
    },
    isValid() {
      return this.selectedColor && 
             this.selectedSize && 
             this.quantity > 0 && 
             this.quantity <= this.maxQuantity
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('favorite', ['toggleFavorite']),
    selectColor(value) {
      this.selectedColor = value
    },
    selectSize(value) {
      this.selectedSize = value
    },
    updateQuantity(delta) {
      const newQuantity = this.quantity + delta
      if (newQuantity >= 1 && newQuantity <= this.maxQuantity) {
        this.quantity = newQuantity
      }
    },
    handleQuantityInput(event) {
      const value = parseInt(event.target.value)
      if (isNaN(value)) {
        this.quantity = 1
      } else if (value < 1) {
        this.quantity = 1
      } else if (value > this.maxQuantity) {
        this.quantity = this.maxQuantity
      }
    },
    async handleAddToCart() {
      if (!this.isValid) return
      
      try {
        await this.addToCart({
          product: this.product,
          color: this.selectedColor,
          size: this.selectedSize,
          quantity: this.quantity
        })
        this.$message.success('已添加到购物车')
      } catch (error) {
        this.$message.error('添加失败：' + error.message)
      }
    },
    async buyNow() {
      if (!this.isValid) return
      
      try {
        // 先添加到购物车
        await this.handleAddToCart()
        // 跳转到结算页面
        this.$router.push({
          name: 'Checkout',
          query: { from: 'buyNow' }
        })
      } catch (error) {
        this.$message.error('操作失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.product-info {
  padding: 20px;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px;
}

.product-brief {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.price-section {
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 4px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 28px;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.discount-tag {
  padding: 2px 6px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
}

.promotion {
  display: flex;
  align-items: center;
  gap: 10px;
}

.promotion-tag {
  padding: 2px 6px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
}

.select-section {
  margin-bottom: 30px;
}

.select-item {
  margin-bottom: 20px;
}

.select-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}

.size-guide {
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-item.active {
  border-color: #333;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  position: relative;
}

.size-btn.active {
  border-color: #333;
  color: #333;
}

.size-btn.disabled {
  cursor: not-allowed;
  color: #999;
  background: #f5f5f5;
}

.out-of-stock {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4d4f;
  color: #fff;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.quantity-btn:disabled {
  cursor: not-allowed;
  color: #999;
}

.quantity-selector input {
  width: 60px;
  height: 32px;
  border: 1px solid #ddd;
  text-align: center;
}

.stock-info {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.buy-now {
  background: #ff4d4f;
  color: #fff;
}

.add-to-cart {
  background: #333;
  color: #fff;
}

.favorite {
  flex: 0 0 auto;
  width: 44px;
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}

.favorite.active {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.product-meta {
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.meta-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.meta-label {
  color: #999;
  width: 80px;
}

.meta-value {
  color: #666;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .favorite {
    width: 100%;
  }
}
</style> 