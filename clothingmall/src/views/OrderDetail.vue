<template>
  <div class="order-detail">
    <app-header />

    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/user/orders' }">我的订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="detail-content" v-loading="loading">
        <!-- 订单状态 -->
        <div class="status-card">
          <div class="status-info">
            <i class="el-icon-s-order"></i>
            <div class="status-text">
              <h3>订单状态：{{ getStatusText(order.state) }}</h3>
              <p v-if="order.state === '0'">请尽快完成支付</p>
              <p v-else-if="order.state === '1'">商家正在处理您的订单</p>
              <p v-else-if="order.state === '2'">商品正在配送中</p>
              <p v-else>交易已完成</p>
            </div>
          </div>
          <el-steps :active="getStatusStep(order.state)" align-center>
            <el-step title="提交订单" description=""></el-step>
            <el-step title="商家发货" description=""></el-step>
            <el-step title="确认收货" description=""></el-step>
            <el-step title="交易完成" description=""></el-step>
          </el-steps>
        </div>

        <!-- 订单信息 -->
        <div class="info-card">
          <h3>订单信息</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">订单编号：</span>
              <span>{{ order.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span>{{ formatTime(order.thistime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">支付方式：</span>
              <span>在线支付</span>
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="product-card">
          <h3>商品信息</h3>
          <el-table :data="[order]" style="width: 100%">
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
                <span class="price">¥{{ scope.row.trappings.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.num }}</span>
              </template>
            </el-table-column>
            <el-table-column label="小计" width="120" align="center">
              <template slot-scope="scope">
                <span class="subtotal">¥{{ calculateSubtotal(scope.row) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 订单操作 -->
        <div class="action-card">
          <div class="total-amount">
            <span>实付金额：</span>
            <span class="price">¥{{ calculateSubtotal(order) }}</span>
          </div>
          <div class="action-buttons">
            <el-button v-if="order.state === '0'" type="primary" @click="handlePay">
              立即支付
            </el-button>
            <el-button v-if="order.state === '2'" type="success" @click="handleConfirm">
              确认收货
            </el-button>
            <el-button @click="$router.push('/user/orders')">返回列表</el-button>
          </div>
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { formatDate } from '@/utils/date'

export default {
  name: 'OrderDetail',
  components: {
    AppHeader,
    AppFooter
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      order: {
        id: '',
        state: '',
        thistime: '',
        trappings: {}
      }
    }
  },
  created() {
    this.fetchOrderDetail()
  },
  methods: {
    formatTime(timestamp) {
      return formatDate(new Date(timestamp))
    },
    getStatusText(status) {
      const statusMap = {
        '0': '待付款',
        '1': '待发货',
        '2': '待收货',
        '3': '已完成'
      }
      return statusMap[status] || status
    },
    getStatusStep(status) {
      const stepMap = {
        '0': 1,
        '1': 2,
        '2': 3,
        '3': 4
      }
      return stepMap[status] || 0
    },
    calculateSubtotal(item) {
      if (!item || !item.trappings || !item.trappings.price) {
        return 0
      }
      return (item.trappings.price * Number(item.num || 0)).toFixed(2)
    },
    async fetchOrderDetail() {
      this.loading = true
      try {
        const response = await this.$api.order.getDetail(this.id)
        if (response.code === 200) {
          this.order = response.data
        } else {
          throw new Error(response.message || '获取订单详情失败')
        }
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    },
    async handlePay() {
      // TODO: 实现支付功能
      this.$message.info('跳转到支付页面...')
    },
    async handleConfirm() {
      try {
        await this.$confirm('确认已收到商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const response = await this.$api.order.confirm(this.id)
        if (response.code === 200) {
          this.$message.success('确认收货成功')
          this.fetchOrderDetail()
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '操作失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.order-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding-top: 60px;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.breadcrumb {
  margin-bottom: 20px;
}

.detail-content>div {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.status-card {
  .status-info {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    i {
      font-size: 40px;
      color: #409EFF;
      margin-right: 20px;
    }

    .status-text {
      h3 {
        margin: 0 0 10px;
        font-size: 18px;
      }

      p {
        margin: 0;
        color: #666;
      }
    }
  }
}

.info-list {
  .info-item {
    margin-bottom: 10px;

    .label {
      color: #666;
      margin-right: 10px;
    }
  }
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
  .product-name {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .product-type {
    color: #666;
    font-size: 14px;
  }
}

.price,
.subtotal {
  color: #ff4d4f;
  font-weight: bold;
}

.action-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total-amount {
    font-size: 16px;

    .price {
      font-size: 20px;
      margin-left: 10px;
    }
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .action-card {
    flex-direction: column;
    gap: 20px;

    .action-buttons {
      width: 100%;
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>