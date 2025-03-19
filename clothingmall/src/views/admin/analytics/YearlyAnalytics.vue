<template>
  <div class="yearly-analytics">


    <!-- 数据概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">年度总销售额</div>
            <div class="number">¥{{ formatNumber(yearlyTotal) }}</div>

          </div>
        </el-card>
      </el-col>



    </el-row>

    <!-- 年度销售趋势图 -->
    <el-card shadow="hover" class="chart-card">
      <div slot="header">
        <span>年度销售趋势</span>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="amount">销售额</el-radio-button>

        </el-radio-group>
      </div>
      <div class="chart-container">
        <line-chart :chart-data="chartData" />
      </div>
    </el-card>

    <!-- 年度数据表格 -->
    <el-card shadow="hover" class="table-card">
      <div slot="header">年度销售明细</div>
      <el-table :data="yearlyData" border style="width: 100%">
        <el-table-column prop="year" label="年份" width="100"></el-table-column>

        <el-table-column prop="amount" label="销售额" width="180">
          <template slot-scope="scope">
            ¥{{ formatNumber(scope.row.amount) }}
          </template>
        </el-table-column>

        <el-table-column prop="orders" label="订单数" width="150">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.orders) }}
          </template>
        </el-table-column>

        <el-table-column prop="averageOrder" label="平均客单价" width="180">
          <template slot-scope="scope">
            ¥{{ formatNumber(scope.row.averageOrder) }}
          </template>
        </el-table-column>

        <el-table-column prop="growth" label="同比增长">
          <template slot-scope="scope">
            <div class="growth-rate" :class="{ up: scope.row.growth > 0 }">
              {{ scope.row.growth > 0 ? '+' : '' }}{{ scope.row.growth }}%
              <i :class="scope.row.growth > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 年度分析卡片 -->
    <el-row :gutter="20" class="analysis-cards">
      <el-col :span="12">
        <el-card shadow="hover" class="analysis-card">
          <div slot="header">季节性分析</div>
          <div class="chart-container">
            <pie-chart :chart-data="seasonData" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" class="analysis-card">
          <div slot="header">品类分布</div>
          <div class="chart-container">
            <pie-chart :chart-data="categoryData" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import analyticsApi from '@/api/admin/analytics'
import LineChart from '@/components/admin/charts/LineChart.vue'
import PieChart from '@/components/admin/charts/PieChart.vue'
import { formatNumber } from '@/utils/format'

export default {
  name: 'YearlyAnalytics',
  components: {
    LineChart,
    PieChart
  },
  data() {
    return {
      timeRange: '5',
      chartType: 'amount',
      loading: false,

      overview: {
        totalAmount: 0,
        amountGrowth: 0,
        yearlyAverage: 0,
        highestYear: { year: 2023, amount: 0 }
      },

      chartData: {
        labels: [],
        datasets: [{
          label: '销售额',
          data: []
        }]
      },

      yearlyData: [],

      seasonData: {
        labels: ['春季', '夏季', '秋季', '冬季'],
        datasets: [{
          data: [],
          backgroundColor: [
            '#67C23A',
            '#409EFF',
            '#E6A23C',
            '#F56C6C'
          ]
        }]
      },

      categoryData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#409EFF',
            '#67C23A',
            '#E6A23C',
            '#F56C6C',
            '#909399'
          ]
        }]
      }
    }
  },
  computed: {
    yearlyTotal() {
      return this.yearlyData.reduce((sum, item) => sum + (item.total || 0), 0)
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
        const res = await analyticsApi.getYearlySales()

        // this.overview = res.data.overview
        this.yearlyData = res.data
        this.updateChartData()

        // 更新饼图数据
        this.seasonData.datasets[0].data = res.data.seasonDistribution
        this.categoryData.labels = res.data.categoryDistribution.map(item => item.name)
        this.categoryData.datasets[0].data = res.data.categoryDistribution.map(item => item.value)
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    updateChartData() {
      // 按年份排序
      const sortedData = [...this.yearlyData].sort((a, b) => a.year - b.year)
      
      this.chartData = {
        labels: sortedData.map(item => `${item.year}年`),
        datasets: [{
          label: '销售额',
          data: sortedData.map(item => item.total),
          borderColor: '#409EFF',
          backgroundColor: 'rgba(64, 158, 255, 0.1)'
        }]
      }
    },

    getChartLabel() {
      switch (this.chartType) {
        case 'amount':
          return '销售额'

      }
    }
  },
  watch: {
    timeRange() {
      this.fetchData()
    },
    chartType() {
      this.updateChartData()
    }
  }
}
</script>

<style lang="scss" scoped>
.yearly-analytics {
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

      .trend,
      .sub-text {
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
    margin-bottom: 20px;

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

  .analysis-cards {
    .analysis-card {
      .chart-container {
        height: 300px;
      }
    }
  }
}
</style>