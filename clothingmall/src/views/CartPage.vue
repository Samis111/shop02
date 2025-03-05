<template>
  <div class="cart-page">
    <app-header />
    
    <div class="main-content">
      <h2>购物车</h2>
      
      <!-- 购物车列表 -->
      <div class="cart-list" v-loading="loading">
        <el-table
          :data="cartItems"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          
          <el-table-column label="商品信息">
            <template slot-scope="scope">
              <div class="product-info">
                <img :src="scope.row.trappings.url" :alt="scope.row.trappings.name" class="product-image">
                <div class="product-details">
                  <div class="product-name">{{ scope.row.trappings.name }}</div>
                  <div class="product-type">{{ scope.row.trappings.type }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="单价" width="120">
            <template slot-scope="scope">
              <span class="price">¥{{ scope.row.trappings.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number 
                v-model="scope.row.num" 
                :min="1"
                @change="value => handleQuantityChange(scope.row, value)"
              ></el-input-number>
            </template>
          </el-table-column>
          
          <el-table-column label="小计" width="120">
            <template slot-scope="scope">
              <span class="subtotal">¥{{ calculateSubtotal(scope.row).toFixed(2) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button 
                type="text" 
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空购物车提示 -->
        <el-empty 
          v-if="!loading && (!cartItems || cartItems.length === 0)"
          description="购物车是空的"
        >
          <el-button type="primary" @click="$router.push('/products')">
            去购物
          </el-button>
        </el-empty>
      </div>

      <!-- 购物车底部 -->
      <div class="cart-footer" v-if="cartItems && cartItems.length > 0">
        <div class="left">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
          <el-button type="text" @click="handleClearCart">清空购物车</el-button>
        </div>
        <div class="right">
          <div class="total-info">
            <span>已选择 {{ selectedCount }} 件商品</span>
            <span class="total-price">总计：¥{{ totalPrice }}</span>
          </div>
          <el-button 
            type="primary" 
            size="large"
            :disabled="selectedCount === 0"
            @click="handleCheckout"
          >
            结算
          </el-button>
        </div>
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
      loading: false,
      selectedItems: [],
      selectAll: false
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    selectedCount() {
      return this.selectedItems.length || 0
    },
    totalPrice() {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        return '0.00'
      }
      const total = this.selectedItems.reduce((sum, item) => {
        return sum + (item.trappings.price * Number(item.num))
      }, 0)
      return total.toFixed(2)
    }
  },
  methods: {
    ...mapActions('cart', ['updateQuantity', 'removeItem', 'clearCart']),
    ...mapActions('checkout', ['setCheckoutItems']),
    
    calculateSubtotal(item) {
      if (!item || !item.trappings || !item.trappings.price) {
        return 0
      }
      return item.trappings.price * Number(item.num || 0)
    },

    handleQuantityChange(item, value) {
      if (!item || !item.id) return
      this.updateQuantity({
        id: item.id,
        num: value
      })
    },

    handleSelectionChange(items) {
      this.selectedItems = items || []
      this.selectAll = items && items.length === this.cartItems.length
    },

    handleSelectAll(val) {
      if (this.$refs.table) {
        this.$refs.table.toggleAllSelection()
      }
    },

    async handleDelete(item) {
      if (!item || !item.id) return
      try {
        await this.$confirm('确定要删除该商品吗？', '提示', {
          type: 'warning'
        })
        await this.removeItem(item.id)
        this.$message.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + (error.message || '未知错误'))
        }
      }
    },

    async handleClearCart() {
      try {
        await this.$confirm('确定要清空购物车吗？', '提示', {
          type: 'warning'
        })
        await this.clearCart()
        this.$message.success('购物车已清空')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('清空失败：' + (error.message || '未知错误'))
        }
      }
    },

    async handleCheckout() {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        this.$message.warning('请选择要结算的商品')
        return
      }

      try {
        // 保存选中的商品到 checkout store
        await this.setCheckoutItems(this.selectedItems)
        // 跳转到结算页
        this.$router.push('/checkout')
      } catch (error) {
        console.error('结算失败:', error)
        this.$message.error('结算失败：' + (error.message || '未知错误'))
      }
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

h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.cart-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.product-type {
  color: #666;
  font-size: 14px;
}

.price, .subtotal {
  color: #ff4d4f;
  font-weight: bold;
}

.cart-footer {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  text-align: right;
}

.total-price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}
</style> 