<template>
  <div class="cart-list">
    <!-- 表头 -->
    <div class="cart-header">
      <div class="col-checkbox">
        <el-checkbox 
          v-model="isAllSelected"
          @change="handleSelectAll"
        >全选</el-checkbox>
      </div>
      <div class="col-product">商品信息</div>
      <div class="col-price">单价</div>
      <div class="col-quantity">数量</div>
      <div class="col-subtotal">小计</div>
      <div class="col-action">操作</div>
    </div>

    <!-- 商品列表 -->
    <div class="cart-items">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="cart-item"
      >
        <div class="col-checkbox">
          <el-checkbox 
            v-model="item.selected"
            @change="handleSelect"
          ></el-checkbox>
        </div>

        <div class="col-product">
          <div class="product-info">
            <router-link 
              :to="{ name: 'ProductDetail', params: { id: item.productId }}"
              class="product-image"
            >
              <img :src="item.image" :alt="item.name">
            </router-link>
            <div class="product-detail">
              <router-link 
                :to="{ name: 'ProductDetail', params: { id: item.productId }}"
                class="product-name"
              >{{ item.name }}</router-link>
              <div class="product-attrs">
                <span class="attr-item">颜色：{{ item.color }}</span>
                <span class="attr-item">尺码：{{ item.size }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-price">
          <span class="current-price">¥{{ item.price }}</span>
          <span 
            v-if="item.originalPrice" 
            class="original-price"
          >¥{{ item.originalPrice }}</span>
        </div>

        <div class="col-quantity">
          <div class="quantity-control">
            <button 
              class="quantity-btn"
              :disabled="item.quantity <= 1"
              @click="updateQuantity(item, -1)"
            >-</button>
            <input 
              type="number"
              v-model.number="item.quantity"
              :min="1"
              :max="item.stock"
              @input="handleQuantityInput($event, item)"
            >
            <button 
              class="quantity-btn"
              :disabled="item.quantity >= item.stock"
              @click="updateQuantity(item, 1)"
            >+</button>
          </div>
          <div class="stock-info" v-if="item.stock <= 10">
            仅剩 {{ item.stock }} 件
          </div>
        </div>

        <div class="col-subtotal">
          <span class="subtotal-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>

        <div class="col-action">
          <button 
            class="remove-btn"
            @click="removeItem(item)"
          >删除</button>
        </div>
      </div>
    </div>

    <!-- 空购物车提示 -->
    <div v-if="!items.length" class="empty-cart">
      <i class="iconfont icon-cart-empty"></i>
      <p>购物车还是空的</p>
      <router-link 
        to="/products" 
        class="shop-now-btn"
      >
        立即购物
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartList',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    isAllSelected: {
      get() {
        return this.items.length > 0 && this.items.every(item => item.selected)
      },
      set(value) {
        this.items.forEach(item => {
          item.selected = value
        })
      }
    }
  },
  methods: {
    handleSelectAll(selected) {
      this.$emit('select-all', selected)
    },
    handleSelect() {
      this.$emit('selection-change', this.items)
    },
    updateQuantity(item, delta) {
      const newQuantity = item.quantity + delta
      if (newQuantity >= 1 && newQuantity <= item.stock) {
        this.$emit('update-quantity', {
          id: item.id,
          quantity: newQuantity
        })
      }
    },
    handleQuantityInput(event, item) {
      const value = parseInt(event.target.value)
      if (isNaN(value)) {
        event.target.value = item.quantity
        return
      }
      
      let newQuantity = value
      if (value < 1) {
        newQuantity = 1
      } else if (value > item.stock) {
        newQuantity = item.stock
      }
      
      if (newQuantity !== value) {
        event.target.value = newQuantity
      }
      
      this.$emit('update-quantity', {
        id: item.id,
        quantity: newQuantity
      })
    },
    removeItem(item) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('remove-item', item.id)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.cart-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cart-header {
  display: grid;
  grid-template-columns: 80px 3fr 1fr 1fr 1fr 100px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  color: #333;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 3fr 1fr 1fr 1fr 100px;
  padding: 20px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail {
  flex: 1;
  min-width: 0;
}

.product-name {
  display: block;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-attrs {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 12px;
}

.current-price {
  color: #ff4d4f;
  font-weight: 500;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
  margin-left: 5px;
}

.quantity-control {
  display: flex;
  align-items: center;
  width: 120px;
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

.quantity-control input {
  width: 56px;
  height: 32px;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  text-align: center;
}

.stock-info {
  margin-top: 5px;
  color: #ff4d4f;
  font-size: 12px;
}

.subtotal-price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
}

.remove-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.empty-cart {
  padding: 40px;
  text-align: center;
  color: #999;
}

.empty-cart .iconfont {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-cart p {
  margin: 0 0 20px;
}

.shop-now-btn {
  display: inline-block;
  padding: 8px 24px;
  background: #333;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.shop-now-btn:hover {
  background: #000;
}

@media (max-width: 768px) {
  .cart-header {
    display: none;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .product-info {
    grid-column: 1 / -1;
  }
  
  .col-price,
  .col-quantity,
  .col-subtotal {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .col-price::before {
    content: '单价：';
    color: #999;
  }
  
  .col-quantity::before {
    content: '数量：';
    color: #999;
  }
  
  .col-subtotal::before {
    content: '小计：';
    color: #999;
  }
  
  .col-action {
    text-align: right;
  }
}
</style> 