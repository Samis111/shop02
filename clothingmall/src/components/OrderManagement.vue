<template>
  <div class="order-management">
    <div class="section-header">
      <h3>我的订单</h3>
      
      <!-- 订单状态标签 -->
      <div class="order-tabs">
        <div 
          v-for="tab in orderTabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: currentTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="count">({{ tab.count }})</span>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="order-item"
      >
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">订单号：{{ order.orderNo }}</span>
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
          </div>
          <span 
            class="order-status"
            :class="order.status"
          >{{ orderStatusText[order.status] }}</span>
        </div>

        <div class="order-content">
          <div 
            v-for="product in order.products"
            :key="product.id"
            class="product-item"
          >
            <router-link 
              :to="{ name: 'ProductDetail', params: { id: product.productId }}"
              class="product-image"
            >
              <img :src="product.image" :alt="product.name">
            </router-link>
            
            <div class="product-info">
              <router-link 
                :to="{ name: 'ProductDetail', params: { id: product.productId }}"
                class="product-name"
              >{{ product.name }}</router-link>
              <div class="product-attrs">
                <span class="attr-item">颜色：{{ product.color }}</span>
                <span class="attr-item">尺码：{{ product.size }}</span>
              </div>
            </div>
            
            <div class="product-price">
              <span class="price">¥{{ product.price }}</span>
              <span class="quantity">× {{ product.quantity }}</span>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            共 {{ order.totalQuantity }} 件商品
            实付款：<span class="total-price">¥{{ order.totalAmount }}</span>
          </div>
          
          <div class="order-actions">
            <template v-if="order.status === 'pending'">
              <button 
                class="action-btn primary"
                @click="goPay(order.id)"
              >去支付</button>
              <button 
                class="action-btn"
                @click="cancelOrder(order.id)"
              >取消订单</button>
            </template>
            
            <template v-if="order.status === 'shipped'">
              <button 
                class="action-btn primary"
                @click="confirmReceive(order.id)"
              >确认收货</button>
              <button 
                class="action-btn"
                @click="viewLogistics(order.id)"
              >查看物流</button>
            </template>
            
            <template v-if="order.status === 'completed'">
              <button 
                class="action-btn"
                @click="applyAfterSale(order.id)"
              >申请售后</button>
              <button 
                class="action-btn"
                @click="deleteOrder(order.id)"
              >删除订单</button>
            </template>
            
            <button 
              class="action-btn"
              @click="viewOrderDetail(order.id)"
            >订单详情</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination-wrapper">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderManagement',
  data() {
    return {
      currentTab: 'all',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      orders: [],
      orderTabs: [
        { label: '全部订单', value: 'all' },
        { label: '待付款', value: 'pending', count: 0 },
        { label: '待发货', value: 'paid', count: 0 },
        { label: '待收货', value: 'shipped', count: 0 },
        { label: '已完成', value: 'completed' }
      ],
      orderStatusText: {
        pending: '待付款',
        paid: '待发货',
        shipped: '待收货',
        completed: '已完成',
        cancelled: '已取消'
      }
    }
  },
  created() {
    this.fetchOrders()
    this.fetchOrderCounts()
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    async fetchOrders() {
      try {
        const response = await this.$api.order.list({
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.currentTab === 'all' ? '' : this.currentTab
        })
        
        this.orders = response.data.list
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取订单列表失败')
      }
    },
    async fetchOrderCounts() {
      try {
        const response = await this.$api.order.counts()
        this.orderTabs = this.orderTabs.map(tab => ({
          ...tab,
          count: response.data[tab.value] || 0
        }))
      } catch (error) {
        console.error('获取订单数量失败:', error)
      }
    },
    switchTab(tab) {
      this.currentTab = tab
      this.currentPage = 1
      this.fetchOrders()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchOrders()
    },
    async goPay(orderId) {
      this.$router.push({
        name: 'Payment',
        params: { orderId }
      })
    },
    async cancelOrder(orderId) {
      try {
        await this.$confirm('确定要取消该订单吗？')
        await this.$api.order.cancel(orderId)
        this.$message.success('订单已取消')
        this.fetchOrders()
        this.fetchOrderCounts()
      } catch (error) {
        if (error === 'cancel') return
        this.$message.error('取消订单失败')
      }
    },
    // ... 其他操作方法
  }
}
</script>

<style scoped>
.order-management {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0 0 15px;
  font-size: 18px;
  color: #333;
}

.order-tabs {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 10px 0;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #ff4d4f;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff4d4f;
}

.count {
  color: #999;
  font-size: 12px;
}

.order-list {
  display: grid;
  gap: 15px;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f8f8;
}

.order-info {
  display: flex;
  gap: 20px;
  color: #666;
}

.order-status {
  font-weight: 500;
}

.order-status.pending { color: #ff4d4f; }
.order-status.paid { color: #1890ff; }
.order-status.shipped { color: #52c41a; }
.order-status.completed { color: #666; }
.order-status.cancelled { color: #999; }

.order-content {
  padding: 15px;
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  display: block;
}

.product-attrs {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 12px;
}

.product-price {
  text-align: right;
}

.price {
  color: #ff4d4f;
  font-weight: 500;
  display: block;
}

.quantity {
  color: #666;
  font-size: 12px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f8f8;
}

.total-price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  border-color: #999;
  color: #333;
}

.action-btn.primary {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.action-btn.primary:hover {
  background: #ff2629;
  border-color: #ff2629;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .order-management {
    padding: 15px;
  }
  
  .order-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .order-header,
  .order-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .order-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    text-align: center;
  }
  
  .product-item {
    grid-template-columns: 60px 1fr;
  }
  
  .product-price {
    grid-column: 1 / -1;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 