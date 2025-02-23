<template>
  <div class="cart-page">
    <app-header />
    
    <div class="main-content">
      <div class="cart-container">
        <h2>购物车</h2>
        
        <!-- 购物车为空时显示 -->
        <div v-if="!cartItems.length" class="empty-cart">
          <i class="el-icon-shopping-cart-2"></i>
          <p>购物车是空的</p>
          <el-button type="primary" @click="$router.push('/')">去购物</el-button>
        </div>

        <!-- 购物车列表 -->
        <template v-else>
          <!-- 全选和表头 -->
          <div class="cart-header">
            <el-checkbox 
              v-model="selectAll"
              @change="handleSelectAllChange"
            >
              全选
            </el-checkbox>
            <div class="header-labels">
              <span class="label-product">商品信息</span>
              <span class="label-price">单价</span>
              <span class="label-quantity">数量</span>
              <span class="label-total">小计</span>
              <span class="label-action">操作</span>
            </div>
          </div>

          <!-- 购物车商品列表 -->
          <div class="cart-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <el-checkbox 
                v-model="item.selected"
                @change="handleItemSelectChange"
              ></el-checkbox>
              
              <div class="item-info">
                <img :src="item.image" :alt="item.name">
                <div class="item-details">
                  <h3>{{ item.name }}</h3>
                  <p class="specs">{{ item.specs }}</p>
                </div>
              </div>

              <div class="item-price">¥{{ item.price.toFixed(2) }}</div>

              <div class="item-quantity">
                <el-input-number 
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  @change="value => handleQuantityChange(item.id, value)"
                ></el-input-number>
              </div>

              <div class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</div>

              <div class="item-actions">
                <el-button 
                  type="text"
                  @click="handleRemoveItem(item.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- 购物车底部 -->
          <div class="cart-footer">
            <div class="selected-info">
              已选择 {{ selectedCount }} 件商品
            </div>
            <div class="total-info">
              <span class="total-label">合计：</span>
              <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
              <el-button 
                type="primary" 
                size="large"
                :disabled="!selectedCount"
                @click="handleCheckout"
              >
                结算
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'CartPage',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      selectAll: false
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    },
    totalPrice() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  methods: {
    ...mapActions('cart', ['updateCartItem', 'removeFromCart']),
    handleSelectAllChange(value) {
      this.cartItems.forEach(item => {
        item.selected = value
      })
    },
    handleItemSelectChange() {
      this.selectAll = this.cartItems.every(item => item.selected)
    },
    async handleQuantityChange(id, quantity) {
      try {
        await this.updateCartItem({ id, quantity })
      } catch (error) {
        this.$message.error('更新数量失败')
      }
    },
    async handleRemoveItem(id) {
      try {
        await this.$confirm('确定要删除这个商品吗？')
        await this.removeFromCart(id)
        this.$message.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    handleCheckout() {
      const selectedItems = this.cartItems.filter(item => item.selected)
      if (!selectedItems.length) {
        this.$message.warning('请选择要结算的商品')
        return
      }
      this.$router.push('/checkout')
    }
  }
}
</script>

<style scoped>
.cart-page {
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

.cart-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.empty-cart i {
  font-size: 48px;
  color: #999;
  margin-bottom: 20px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 20px;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.header-labels {
  display: flex;
  flex: 1;
  margin-left: 50px;
}

.label-product {
  flex: 1;
}

.label-price,
.label-quantity,
.label-total,
.label-action {
  width: 120px;
  text-align: center;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid #eee;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.item-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 20px;
}

.item-details h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.specs {
  color: #666;
  font-size: 14px;
}

.item-price,
.item-quantity,
.item-total,
.item-actions {
  width: 120px;
  text-align: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  margin-top: 20px;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .item-info {
    width: 100%;
    margin-bottom: 15px;
  }

  .item-price,
  .item-quantity,
  .item-total,
  .item-actions {
    width: auto;
    flex: 1;
  }
}
</style> 