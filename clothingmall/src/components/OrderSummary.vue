<template>
  <div class="order-summary">
    <h3 class="section-title">订单信息</h3>
    
    <!-- 价格明细 -->
    <div class="price-detail">
      <div class="price-item">
        <span class="label">商品总价</span>
        <span class="value">¥{{ subtotal.toFixed(2) }}</span>
      </div>
      
      <div class="price-item">
        <span class="label">运费</span>
        <span class="value">¥{{ shipping.toFixed(2) }}</span>
      </div>
      
      <!-- 优惠券 -->
      <div class="price-item coupon-section">
        <div class="coupon-header">
          <span class="label">优惠券</span>
          <button 
            class="select-coupon"
            @click="showCouponList"
            :class="{ 'has-coupon': selectedCoupon }"
          >
            {{ couponText }}
            <i class="iconfont icon-arrow-right"></i>
          </button>
        </div>
        <span class="value discount">-¥{{ discount.toFixed(2) }}</span>
      </div>
      
      <!-- 总计 -->
      <div class="total-price">
        <span class="label">应付总额</span>
        <span class="value">¥{{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-method">
      <h4>支付方式</h4>
      <div class="method-list">
        <div 
          v-for="method in paymentMethods"
          :key="method.value"
          class="method-item"
          :class="{ active: selectedMethod === method.value }"
          @click="selectMethod(method.value)"
        >
          <i :class="['iconfont', method.icon]"></i>
          <span>{{ method.label }}</span>
        </div>
      </div>
    </div>

    <!-- 提交订单 -->
    <div class="submit-section">
      <div class="order-confirm">
        <span class="total-label">实付款：</span>
        <span class="total-value">¥{{ total.toFixed(2) }}</span>
      </div>
      
      <button 
        class="submit-btn"
        :disabled="!canSubmit"
        @click="submitOrder"
      >
        提交订单
      </button>
    </div>

    <!-- 优惠券选择弹窗 -->
    <el-dialog
      title="选择优惠券"
      :visible.sync="showCouponDialog"
      width="500px"
    >
      <div class="coupon-list">
        <div 
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="coupon-item"
          :class="{ 
            active: selectedCoupon?.id === coupon.id,
            disabled: !coupon.available
          }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">
            <span class="currency">¥</span>
            <span class="number">{{ coupon.amount }}</span>
          </div>
          <div class="coupon-info">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-condition">
              满{{ coupon.minAmount }}元可用
            </div>
            <div class="coupon-time">
              有效期至：{{ coupon.expireDate }}
            </div>
          </div>
        </div>
      </div>
      
      <div slot="footer">
        <el-button @click="showCouponDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCoupon">确定</el-button>
      </div>
    </el-dialog>
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
    }
  },
  data() {
    return {
      selectedCoupon: null,
      tempSelectedCoupon: null,
      showCouponDialog: false,
      selectedMethod: 'alipay',
      paymentMethods: [
        { label: '支付宝', value: 'alipay', icon: 'icon-alipay' },
        { label: '微信支付', value: 'wechat', icon: 'icon-wechat' },
        { label: '银联', value: 'unionpay', icon: 'icon-unionpay' }
      ],
      availableCoupons: [
        {
          id: 1,
          name: '新用户专享券',
          amount: 10,
          minAmount: 100,
          expireDate: '2024-12-31',
          available: true
        },
        {
          id: 2,
          name: '满减优惠券',
          amount: 20,
          minAmount: 200,
          expireDate: '2024-12-31',
          available: true
        }
      ]
    }
  },
  computed: {
    discount() {
      return this.selectedCoupon ? this.selectedCoupon.amount : 0
    },
    total() {
      return this.subtotal + this.shipping - this.discount
    },
    couponText() {
      return this.selectedCoupon 
        ? `已选择：${this.selectedCoupon.name}`
        : '请选择优惠券'
    },
    canSubmit() {
      return this.total > 0 && this.selectedMethod
    }
  },
  methods: {
    showCouponList() {
      this.tempSelectedCoupon = this.selectedCoupon
      this.showCouponDialog = true
    },
    selectCoupon(coupon) {
      if (!coupon.available) return
      this.tempSelectedCoupon = coupon
    },
    confirmCoupon() {
      this.selectedCoupon = this.tempSelectedCoupon
      this.showCouponDialog = false
    },
    selectMethod(method) {
      this.selectedMethod = method
    },
    async submitOrder() {
      if (!this.canSubmit) return
      
      try {
        const orderData = {
          paymentMethod: this.selectedMethod,
          couponId: this.selectedCoupon?.id,
          total: this.total
        }
        
        // 提交订单
        const response = await this.$api.order.create(orderData)
        
        // 跳转到支付页面
        this.$router.push({
          name: 'Payment',
          params: { orderId: response.data.orderId }
        })
      } catch (error) {
        this.$message.error('订单提交失败')
      }
    }
  }
}
</script>

<style scoped>
.order-summary {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  margin: 0 0 20px;
  font-size: 18px;
  color: #333;
}

.price-detail {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price-item .label {
  color: #666;
}

.price-item .value {
  color: #333;
}

.coupon-section .coupon-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-coupon {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.select-coupon.has-coupon {
  color: #ff4d4f;
}

.value.discount {
  color: #ff4d4f;
}

.total-price {
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
}

.total-price .value {
  color: #ff4d4f;
  font-size: 20px;
}

.payment-method {
  margin-bottom: 20px;
}

.payment-method h4 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
}

.method-list {
  display: flex;
  gap: 15px;
}

.method-item {
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.method-item:hover {
  border-color: #ff4d4f;
}

.method-item.active {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.method-item .iconfont {
  font-size: 24px;
  margin-bottom: 5px;
}

.submit-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.order-confirm {
  text-align: right;
}

.total-label {
  color: #666;
}

.total-value {
  color: #ff4d4f;
  font-size: 24px;
  font-weight: bold;
}

.submit-btn {
  padding: 12px 40px;
  border: none;
  background: #ff4d4f;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #ff2629;
}

.submit-btn:disabled {
  background: #ffb4b4;
  cursor: not-allowed;
}

.coupon-list {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:hover:not(.disabled) {
  border-color: #ff4d4f;
}

.coupon-item.active {
  border-color: #ff4d4f;
  background: #fff1f0;
}

.coupon-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  color: #ff4d4f;
}

.coupon-amount .currency {
  font-size: 16px;
}

.coupon-amount .number {
  font-size: 28px;
  font-weight: bold;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.coupon-condition,
.coupon-time {
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .method-list {
    flex-direction: column;
  }
  
  .submit-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style> 