<template>
  <div class="order-summary">
    <h3>订单信息</h3>
    
    <div class="summary-content">
      <div class="summary-item">
        <span>商品总额</span>
        <span class="price">¥{{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="summary-item">
        <span>运费</span>
        <span class="price">¥{{ shipping.toFixed(2) }}</span>
      </div>
      <div class="total">
        <span>应付总额</span>
        <span class="total-price">¥{{ (subtotal + shipping).toFixed(2) }}</span>
      </div>
    </div>

    <div class="submit-section">
      <el-button 
        type="primary" 
        size="large" 
        :loading="loading"
        @click="$emit('order-submit')"
      >
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.order-summary {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.summary-content {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #666;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-weight: bold;
}

.price {
  color: #ff4d4f;
}

.total-price {
  color: #ff4d4f;
  font-size: 20px;
}

.submit-section {
  margin-top: 20px;
  text-align: center;
}

.submit-section .el-button {
  width: 100%;
}
</style> 