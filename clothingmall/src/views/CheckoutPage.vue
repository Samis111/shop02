<template>
  <div class="checkout-page">
    <app-header />
    
    <div class="main-content">
      <!-- 面包屑导航 -->
      <app-breadcrumb :breadcrumbs="breadcrumbs" />
      
      <div class="checkout-content">
        <!-- 收货地址 -->
        <address-management 
          v-model="selectedAddressId"
          class="section-block"
        />
        
        <!-- 商品信息 -->
        <order-product-info
          :items="checkoutItems"
          :delivery-method="deliveryMethod"
          @remark-change="handleRemarkChange"
          class="section-block"
        />

        <!-- 订单信息 -->
        <order-summary
          :subtotal="subtotal"
          :shipping="shippingFee"
          :loading="loading"
          @order-submit="handleOrderSubmit"
          class="section-block"
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
      shippingFee: 0,
      loading: false
    }
  },
  computed: {
    ...mapState('checkout', ['checkoutItems']),
    subtotal() {
      return this.checkoutItems.reduce((sum, item) => {
        return sum + (item.trappings.price * Number(item.num))
      }, 0)
    }
  },
  async created() {
    try {
      await this.initCheckout()
    } catch (error) {
      this.$message.warning(error.message || '请先选择要结算的商品')
      this.$router.replace('/cart')
    }
  },
  methods: {
    ...mapActions('checkout', ['initCheckout', 'createOrder']),
    
    handleRemarkChange(remark) {
      this.orderRemark = remark
    },
    
    async handleOrderSubmit() {
      if (!this.selectedAddressId) {
        this.$message.warning('请选择收货地址')
        return
      }
      
      try {
        this.loading = true
        const orderResult = await this.createOrder({
          addressId: this.selectedAddressId,
          remark: this.orderRemark
        })
        
        // 跳转到支付页面
        this.$router.push({
          name: 'Payment',
          params: { orderId: orderResult.orderId }
        })
      } catch (error) {
        this.$message.error(error.message || '订单提交失败')
      } finally {
        this.loading = false
      }
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
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-block {
  margin-bottom: 0;  /* 移除底部间距，使用 gap 控制间距 */
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style> 