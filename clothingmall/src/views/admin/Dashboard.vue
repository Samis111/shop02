<template>
  <div class="dashboard">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="title">总销售额</div>
            <i class="el-icon-money icon"></i>
          </div>
          <div class="number">¥{{ formatNumber(totalSales) }}</div>
          <div class="footer">
            <span>日同比 {{ dayGrowth }}%</span>
            <span>周同比 {{ weekGrowth }}%</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="title">订单数</div>
            <i class="el-icon-s-order icon"></i>
          </div>
          <div class="number">{{ formatNumber(totalOrders) }}</div>
          <div class="footer">
            <span>日同比 {{ orderDayGrowth }}%</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="title">用户数</div>
            <i class="el-icon-user icon"></i>
          </div>
          <div class="number">{{ formatNumber(totalUsers) }}</div>
          <div class="footer">
            <span>月增长 {{ userGrowth }}%</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="title">商品数</div>
            <i class="el-icon-s-goods icon"></i>
          </div>
          <div class="number">{{ formatNumber(totalProducts) }}</div>
          <div class="footer">
            <span>库存告警 {{ stockWarning }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header">
            <span>销售趋势</span>
          </div>
          <div class="chart-container">
            <line-chart :chart-data="salesData" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header">
            <span>商品分类占比</span>
          </div>
          <div class="chart-container">
            <pie-chart :chart-data="categoryData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新订单 -->
    <el-card shadow="hover" class="latest-orders">
      <div slot="header">
        <span>最新订单</span>
      </div>
      <el-table :data="latestOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180"></el-table-column>
        <el-table-column prop="user" label="用户"></el-table-column>
        <el-table-column prop="amount" label="金额" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import LineChart from '@/components/admin/charts/LineChart'
import PieChart from '@/components/admin/charts/PieChart'

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PieChart
  },
  data() {
    return {
      totalSales: 126500,
      dayGrowth: 12.5,
      weekGrowth: 8.2,
      totalOrders: 1268,
      orderDayGrowth: 6.8,
      totalUsers: 2150,
      userGrowth: 15.6,
      totalProducts: 856,
      stockWarning: 5,
      
      salesData: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{
          label: '销售额',
          data: [12000, 19000, 15000, 22000, 18000, 24000, 21000]
        }]
      },
      
      categoryData: {
        labels: ['服装', '鞋靴', '配饰', '包包'],
        datasets: [{
          data: [40, 25, 20, 15]
        }]
      },
      
      latestOrders: [
        {
          id: 'DD20230801001',
          user: '张三',
          amount: 299,
          status: '待发货',
          createTime: '2023-08-01 10:25:36'
        }
        // ... 更多订单数据
      ]
    }
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString()
    },
    getOrderStatusType(status) {
      const typeMap = {
        '待付款': 'warning',
        '待发货': 'primary',
        '已发货': 'success',
        '已完成': 'info'
      }
      return typeMap[status] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  .data-card {
    .data-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .title {
        color: #666;
      }
      
      .icon {
        font-size: 24px;
        color: #409EFF;
      }
    }
    
    .number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    
    .footer {
      color: #999;
      font-size: 14px;
      
      span {
        margin-right: 12px;
      }
    }
  }
  
  .chart-row {
    margin-top: 20px;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .latest-orders {
    margin-top: 20px;
  }
}
</style> 