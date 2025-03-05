<template>
  <div class="order-product-info">
    <h3>商品信息</h3>
    
    <!-- 商品列表 -->
    <div class="product-list">
      <el-table :data="items" border>
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
        
        <el-table-column label="单价" width="120" align="center">
          <template slot-scope="scope">
            <span class="price">¥{{ scope.row.trappings.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            <span class="subtotal">¥{{ calculateSubtotal(scope.row).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 配送方式 -->
    <div class="delivery-section">
      <h4>配送方式</h4>
      <div class="delivery-info">
        <span>{{ deliveryMethod }}</span>
      </div>
    </div>

    <!-- 订单备注 -->
    <div class="remark-section">
      <h4>订单备注</h4>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入订单备注信息（选填）"
        v-model="remark"
        @input="handleRemarkChange"
      ></el-input>
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
  methods: {
    calculateSubtotal(item) {
      if (!item || !item.trappings || !item.trappings.price) {
        return 0
      }
      return item.trappings.price * Number(item.num || 0)
    },
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

h4 {
  margin: 20px 0 10px;
  font-size: 16px;
  color: #333;
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

.delivery-section,
.remark-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.delivery-info {
  color: #666;
}
</style> 