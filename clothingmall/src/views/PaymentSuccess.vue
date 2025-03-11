<template>
  <div class="payment-success">
    <app-header />
    
    <div class="main-content">
      <div class="success-card">
        <div class="success-icon">
          <i class="el-icon-success"></i>
        </div>
        
        <h2>订单提交成功！</h2>
        
        <div class="order-info">
          <p class="order-number">订单号：{{ orderId }}</p>
          <p class="tips">我们会尽快为您安排发货</p>
        </div>
        
        <div class="action-buttons">
          <el-button type="primary" @click="viewOrder">查看订单</el-button>
          <el-button @click="continueShopping">继续购物</el-button>
        </div>
      </div>
    </div>
    
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'PaymentSuccess',
  components: {
    AppHeader,
    AppFooter
  },
  props: {
    orderId: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    viewOrder() {
      this.$router.push({
        name: 'UserOrders',
        query: { highlight: this.orderId }
      })
    },
    continueShopping() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding-top: 60px;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.success-card {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.success-icon {
  font-size: 72px;
  color: #67c23a;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.order-info {
  margin-bottom: 30px;
}

.order-number {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.tips {
  color: #999;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .success-card {
    padding: 30px 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}
</style> 