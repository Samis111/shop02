<template>
  <div class="checkout-page">
    <app-header />
    
    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />
      
      <div class="checkout-content">
        <!-- 左侧内容 -->
        <div class="main-section">
          <!-- 收货地址 -->
          <address-management 
            v-model="selectedAddressId"
            class="section-block"
          />
          
          <!-- 商品信息 -->
          <order-product-info
            :items="orderItems"
            :delivery-method="deliveryMethod"
            @remark-change="handleRemarkChange"
            class="section-block"
          />
        </div>
        
        <!-- 右侧订单信息 -->
        <div class="side-section">
          <order-summary
            :subtotal="subtotal"
            :shipping="shippingFee"
            @order-submit="handleOrderSubmit"
          />
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
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import AddressManagement from '@/components/AddressManagement.vue'
import OrderProductInfo from '@/components/OrderProductInfo.vue'
import OrderSummary from '@/components/OrderSummary.vue'

export default {
  name: 'CheckoutPage',
  components: {
    AppHeader,
    AppFooter,
    AppBreadcrumb,
    AddressManagement,
    OrderProductInfo,
    OrderSummary
  },
  data() {
    return {
      breadcrumbs: [
        { name: '首页', path: '/' },
        { name: '购物车', path: '/cart' },
        { name: '确认订单', path: '/checkout' }
      ],
      selectedAddressId: '',
      orderRemark: '',
      deliveryMethod: '普通快递',
      shippingFee: 0
    }
  },
  computed: {
    ...mapState('checkout', ['orderItems']),
    subtotal() {
      return this.orderItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    }
  },
  created() {
    this.initCheckout()
  },
  methods: {
    ...mapActions('checkout', ['initCheckout']),
    handleRemarkChange(remark) {
      this.orderRemark = remark
    },
    async handleOrderSubmit(orderData) {
      if (!this.selectedAddressId) {
        this.$message.warning('请选择收货地址')
        return
      }
      
      try {
        const response = await this.$api.order.create({
          ...orderData,
          addressId: this.selectedAddressId,
          remark: this.orderRemark,
          items: this.orderItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        })
        
        // 跳转到支付页面
        this.$router.push({
          name: 'Payment',
          params: { orderId: response.data.orderId }
        })
      } catch (error) {
        this.$message.error('订单提交失败')
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 检查是否从购物车页面进入
    if (from.name !== 'Cart') {
      next('/cart')
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  margin-top: 20px;
}

.section-block {
  margin-bottom: 20px;
}

.section-block:last-child {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style> 