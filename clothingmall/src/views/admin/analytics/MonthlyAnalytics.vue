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
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">月度总销售额</div>
            <div class="number">¥{{ formatNumber(monthlyTotal) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 月度销售趋势图 -->
    <el-card shadow="hover" class="chart-card">
      <div slot="header">
        <span>月度销售趋势</span>
      </div>
      <div class="chart-container">
        <line-chart :chart-data="chartData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import analyticsApi from '@/api/admin/analytics'
import LineChart from '@/components/admin/charts/LineChart'
import { formatNumber } from '@/utils/format'

export default {
  name: 'MonthlyAnalytics',
  components: {
    LineChart
  },
  data() {
    return {
      year: new Date(),
      loading: false,
      monthlyData: [],
      chartData: {
        labels: [],
        datasets: [{
          label: '销售额',
          data: []
        }]
      }
    }
  },
  computed: {
    monthlyTotal() {
      return this.monthlyData.reduce((sum, item) => sum + (item.total || 0), 0)
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
        
        this.monthlyData = res.data
        this.updateChartData()
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },
    
    updateChartData() {
      // 按月份排序
      const sortedData = [...this.monthlyData].sort((a, b) => a.mont - b.mont)
      
      this.chartData = {
        labels: sortedData.map(item => `${item.mont}月`),
        datasets: [{
          label: '销售额',
          data: sortedData.map(item => item.total),
          borderColor: '#409EFF',
          backgroundColor: 'rgba(64, 158, 255, 0.1)'
        }]
      }
    },
    
    handleYearChange() {
      this.fetchData()
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
}
</style> 