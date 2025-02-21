<template>
  <div class="cart-page">
    <app-header />
    
    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />
      
      <!-- 购物车内容 -->
      <div class="cart-content">
        <cart-list 
          :items="cartItems"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          @update-quantity="handleQuantityUpdate"
          @remove-item="handleRemoveItem"
        />
        
        <cart-summary 
          :items="cartItems"
          :shipping="shippingFee"
        />
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import CartList from '@/components/CartList.vue'
import CartSummary from '@/components/CartSummary.vue'

export default {
  name: 'CartPage',
  components: {
    AppHeader,
    AppFooter,
    AppBreadcrumb,
    CartList,
    CartSummary
  },
  data() {
    return {
      breadcrumbs: [
        { name: '首页', path: '/' },
        { name: '购物车', path: '/cart' }
      ],
      shippingFee: 0 // 运费，可以根据实际情况计算
    }
  },
  computed: {
    ...mapState('cart', ['cartItems', 'loading', 'error'])
  },
  created() {
    this.fetchCartItems()
  },
  methods: {
    ...mapActions('cart', [
      'fetchCartItems',
      'updateCartItem',
      'removeFromCart'
    ]),
    handleSelectAll(selected) {
      const updatedItems = this.cartItems.map(item => ({
        ...item,
        selected
      }))
      this.cartItems = updatedItems
    },
    handleSelectionChange(items) {
      this.cartItems = items
    },
    async handleQuantityUpdate({ id, quantity }) {
      try {
        await this.updateCartItem({ id, quantity })
        this.$message.success('数量更新成功')
      } catch (error) {
        this.$message.error('数量更新失败')
      }
    },
    async handleRemoveItem(id) {
      try {
        await this.removeFromCart(id)
        this.$message.success('商品已移除')
      } catch (error) {
        this.$message.error('移除失败')
      }
    },
    calculateShipping() {
      // TODO: 根据商品重量、配送地址等计算运费
      this.shippingFee = 0
    }
  },
  watch: {
    cartItems: {
      handler() {
        this.calculateShipping()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding-top: 60px;  /* 为固定头部留出空间 */
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.cart-content {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style> 