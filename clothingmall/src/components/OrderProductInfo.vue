<template>
  <div class="order-product-info">
    <div class="section-header">
      <h3>商品清单</h3>
      <span class="item-count">共 {{ totalQuantity }} 件商品</span>
    </div>

    <!-- 商品列表 -->
    <div class="product-list">
      <div class="list-header">
        <span class="col-product">商品信息</span>
        <span class="col-price">单价</span>
        <span class="col-quantity">数量</span>
        <span class="col-subtotal">小计</span>
      </div>

      <div 
        v-for="item in items" 
        :key="item.id"
        class="product-item"
      >
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
          <span class="quantity">× {{ item.quantity }}</span>
        </div>

        <div class="col-subtotal">
          <span class="subtotal-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 配送信息 -->
    <div class="delivery-info">
      <div class="info-item">
        <span class="label">配送方式：</span>
        <span class="value">{{ deliveryMethod }}</span>
      </div>
      <div class="info-item">
        <span class="label">预计送达：</span>
        <span class="value">{{ estimatedDelivery }}</span>
      </div>
    </div>

    <!-- 订单备注 -->
    <div class="order-remark">
      <span class="label">订单备注：</span>
      <el-input
        v-model="remark"
        type="textarea"
        :rows="2"
        placeholder="选填，请填写其他需求"
        @input="handleRemarkChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderProductInfo',
  props: {
    items: {
      type: Array,
      required: true
    },
    deliveryMethod: {
      type: String,
      default: '普通快递'
    }
  },
  data() {
    return {
      remark: ''
    }
  },
  computed: {
    totalQuantity() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    estimatedDelivery() {
      // 计算预计送达时间（示例：当前时间后3天）
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  },
  methods: {
    handleRemarkChange(value) {
      this.$emit('remark-change', value)
    }
  }
}
</script>

<style scoped>
.order-product-info {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.item-count {
  color: #666;
  font-size: 14px;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  color: #999;
  font-size: 14px;
}

.product-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
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

.quantity {
  color: #666;
}

.subtotal-price {
  color: #ff4d4f;
  font-weight: bold;
}

.delivery-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 4px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.value {
  color: #333;
}

.order-remark {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .list-header {
    display: none;
  }
  
  .product-item {
    grid-template-columns: 1fr;
    gap: 10px;
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
}
</style> 