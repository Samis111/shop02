<template>
  <div class="monthly-analytics">
    <!-- 筛选条件 -->
    <div class="filter-bar">
      <el-date-picker
        v-model="year"
        type="year"
        placeholder="选择年份"
        @change="handleYearChange"
      ></el-date-picker>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">年度总销售额</div>
            <div class="number">¥{{ formatNumber(overview.yearAmount) }}</div>
            <div class="trend" :class="{ up: overview.yearGrowth > 0 }">
              同比{{ Math.abs(overview.yearGrowth) }}%
              <i :class="overview.yearGrowth > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">月均销售额</div>
            <div class="number">¥{{ formatNumber(overview.monthlyAverage) }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">最高月销售额</div>
            <div class="number">¥{{ formatNumber(overview.highestMonth.amount) }}</div>
            <div class="sub-text">{{ overview.highestMonth.month }}月</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">最低月销售额</div>
            <div class="number">¥{{ formatNumber(overview.lowestMonth.amount) }}</div>
            <div class="sub-text">{{ overview.lowestMonth.month }}月</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 月度销售趋势图 -->
    <el-card shadow="hover" class="chart-card">
      <div slot="header">
        <span>月度销售趋势</span>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="amount">销售额</el-radio-button>
          <el-radio-button label="orders">订单数</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-container">
        <line-chart :chart-data="chartData" />
      </div>
    </el-card>

    <!-- 月度数据表格 -->
    <el-card shadow="hover" class="table-card">
      <div slot="header">月度销售明细</div>
      <el-table
        :data="monthlyData"
        border
        style="width: 100%"
      >
        <el-table-column prop="month" label="月份" width="100">
          <template slot-scope="scope">
            {{ scope.row.month }}月
          </template>
        </el-table-column>
        
        <el-table-column prop="amount" label="销售额" width="150">
          <template slot-scope="scope">
            ¥{{ formatNumber(scope.row.amount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="orders" label="订单数" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.orders) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="averageOrder" label="平均客单价" width="150">
          <template slot-scope="scope">
            ¥{{ formatNumber(scope.row.averageOrder) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="growth" label="环比">
          <template slot-scope="scope">
            <div 
              class="growth-rate" 
              :class="{ up: scope.row.growth > 0 }"
            >
              {{ scope.row.growth > 0 ? '+' : '' }}{{ scope.row.growth }}%
              <i :class="scope.row.growth > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import analyticsApi from '@/api/admin/analytics'
import LineChart from '@/components/admin/charts/LineChart.vue'
import { formatNumber } from '@/utils/format'

export default {
  name: 'MonthlyAnalytics',
  components: {
    LineChart
  },
  data() {
    return {
      year: new Date(),
      chartType: 'amount',
      loading: false,
      
      overview: {
        yearAmount: 0,
        yearGrowth: 0,
        monthlyAverage: 0,
        highestMonth: { month: 1, amount: 0 },
        lowestMonth: { month: 1, amount: 0 }
      },
      
      chartData: {
        labels: [],
        datasets: [{
          label: '销售额',
          data: []
        }]
      },
      
      monthlyData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatNumber,
    
    async fetchData() {
      this.loading = true
      try {
        const res = await analyticsApi.getMonthlySales({
          year: this.year.getFullYear()
        })
        
        this.overview = res.data.overview
        this.monthlyData = res.data.monthly
        this.updateChartData()
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },
    
    updateChartData() {
      this.chartData = {
        labels: this.monthlyData.map(item => `${item.month}月`),
        datasets: [{
          label: this.chartType === 'amount' ? '销售额' : '订单数',
          data: this.monthlyData.map(item => 
            this.chartType === 'amount' ? item.amount : item.orders
          ),
          borderColor: '#409EFF',
          backgroundColor: 'rgba(64, 158, 255, 0.1)'
        }]
      }
    },
    
    handleYearChange() {
      this.fetchData()
    }
  },
  watch: {
    chartType() {
      this.updateChartData()
    }
  }
}
</script>

<style lang="scss" scoped>
.monthly-analytics {
  .filter-bar {
    margin-bottom: 20px;
  }
  
  .overview-cards {
    margin-bottom: 20px;
    
    .overview-item {
      text-align: center;
      
      .title {
        color: #666;
        margin-bottom: 10px;
      }
      
      .number {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .trend, .sub-text {
        color: #909399;
        font-size: 14px;
        
        &.up {
          color: #67c23a;
        }
        
        i {
          margin-left: 5px;
        }
      }
    }
  }
  
  .chart-card {
    margin-bottom: 20px;
    
    :deep(.el-card__header) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chart-container {
      height: 400px;
    }
  }
  
  .table-card {
    .growth-rate {
      color: #f56c6c;
      
      &.up {
        color: #67c23a;
      }
      
      i {
        margin-left: 5px;
      }
    }
  }
}
</style> 