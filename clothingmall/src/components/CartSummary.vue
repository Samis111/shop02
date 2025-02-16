<template>
  <div class="cart-summary">
    <!-- 结算信息 -->
    <div class="summary-info">
      <div class="selected-count">
        已选商品 <span class="count">{{ selectedCount }}</span> 件
      </div>
      
      <div class="price-info">
        <div class="subtotal">
          商品总价：
          <span class="price">¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="shipping">
          运费：
          <span class="price">¥{{ shipping.toFixed(2) }}</span>
        </div>
        <div class="total">
          合计：
          <span class="price">¥{{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <router-link 
        to="/products" 
        class="continue-shopping"
      >
        继续购物
      </router-link>
      
      <button 
        class="checkout-btn"
        :disabled="!selectedCount"
        @click="handleCheckout"
      >
        去结算({{ selectedCount }})
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartSummary',
  props: {
    items: {
      type: Array,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    }
  },
  computed: {
    selectedItems() {
      return this.items.filter(item => item.selected)
    },
    selectedCount() {
      return this.selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    },
    subtotal() {
      return this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    total() {
      return this.subtotal + this.shipping
    }
  },
  methods: {
    handleCheckout() {
      if (!this.selectedCount) {
        this.$message.warning('请先选择要结算的商品')
        return
      }
      
      // 获取选中的商品ID列表
      const selectedIds = this.selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
      
      // 跳转到结算页面
      this.$router.push({
        name: 'Checkout',
        params: {
          items: selectedIds
        }
      })
    }
  }
}
</script>

<style scoped>
.cart-summary {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 20px;
}

.summary-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.selected-count {
  color: #666;
}

.selected-count .count {
  color: #ff4d4f;
  font-weight: bold;
}

.price-info {
  text-align: right;
}

.price-info > div {
  margin-bottom: 10px;
}

.price-info > div:last-child {
  margin-bottom: 0;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
  margin-left: 5px;
}

.total {
  font-size: 16px;
  font-weight: 500;
}

.total .price {
  font-size: 24px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.continue-shopping,
.checkout-btn {
  padding: 10px 30px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-shopping {
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  text-decoration: none;
}

.continue-shopping:hover {
  border-color: #999;
  color: #333;
}

.checkout-btn {
  border: none;
  background: #ff4d4f;
  color: #fff;
}

.checkout-btn:hover:not(:disabled) {
  background: #ff2629;
}

.checkout-btn:disabled {
  background: #ffb4b4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .summary-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .price-info {
    width: 100%;
    text-align: left;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .continue-shopping,
  .checkout-btn {
    width: 100%;
    text-align: center;
  }
}
</style> 