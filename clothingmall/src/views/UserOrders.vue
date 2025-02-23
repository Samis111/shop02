<template>
  <div class="user-orders">
    <h2>我的订单</h2>
    
    <!-- 订单状态标签 -->
    <div class="order-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待付款" name="unpaid"></el-tab-pane>
        <el-tab-pane label="待发货" name="unshipped"></el-tab-pane>
        <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
        <el-tab-pane label="已完成" name="completed"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <el-table
        v-loading="loading"
        :data="orders"
        style="width: 100%"
      >
        <el-table-column label="订单信息" width="400">
          <template slot-scope="scope">
            <div class="order-info">
              <div class="order-number">订单号：{{ scope.row.orderNo }}</div>
              <div class="order-time">下单时间：{{ scope.row.createTime }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template slot-scope="scope">
            <span class="price">¥{{ scope.row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button 
              size="small"
              @click="viewOrderDetail(scope.row.id)"
            >
              查看详情
            </el-button>
            <el-button 
              v-if="scope.row.status === 'unpaid'"
              type="primary" 
              size="small"
              @click="handlePay(scope.row.id)"
            >
              去支付
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
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
  name: 'UserOrders',
  data() {
    return {
      activeTab: 'all',
      loading: false,
      orders: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const response = await this.$api.order.list({
          status: this.activeTab === 'all' ? '' : this.activeTab,
          page: this.currentPage,
          pageSize: this.pageSize
        })
        this.orders = response.data.records
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取订单列表失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    handleTabClick() {
      this.currentPage = 1
      this.fetchOrders()
    },
    handlePageChange() {
      this.fetchOrders()
    },
    getStatusType(status) {
      const typeMap = {
        unpaid: 'warning',
        unshipped: 'info',
        shipped: 'primary',
        completed: 'success'
      }
      return typeMap[status] || 'info'
    },
    getStatusText(status) {
      const textMap = {
        unpaid: '待付款',
        unshipped: '待发货',
        shipped: '待收货',
        completed: '已完成'
      }
      return textMap[status] || status
    },
    viewOrderDetail(id) {
      this.$router.push(`/order/${id}`)
    },
    handlePay(id) {
      // TODO: 实现支付功能
      this.$message.info('跳转到支付页面...')
    }
  }
}
</script>

<style scoped>
.user-orders {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.order-tabs {
  margin-bottom: 20px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-number {
  font-weight: bold;
}

.order-time {
  color: #666;
  font-size: 14px;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 