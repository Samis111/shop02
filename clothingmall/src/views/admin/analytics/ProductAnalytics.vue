<template>
  <div class="product-analytics">
    <!-- 筛选条件 -->


    <!-- 数据概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">总销售额</div>
            <div class="number">¥{{ formatNumber(overview.sumprice) }}</div>

          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div class="overview-item">
            <div class="title">销售数量</div>
            <div class="number">{{ formatNumber(overview.sumnum) }}</div>
          </div>
        </el-card>
      </el-col>


    </el-row>

    <!-- 销售趋势图 -->
    <el-card shadow="hover" class="chart-card">
      <div slot="header">
        <span>销售趋势</span>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="amount">销售量</el-radio-button>
         
        </el-radio-group>
      </div>
      <div class="chart-container">
        <line-chart :chart-data="chartData" />
      </div>
    </el-card>

    <!-- 商品销售排行 -->
    <el-card shadow="hover" class="rank-card">
      <div slot="header">商品销售排行</div>
      <el-table :data="rankList" style="width: 100%" :show-header="false" row-class-name="rank-row">
        <el-table-column width="50">
          <template slot-scope="scope">
            <div class="rank-number" :class="{ top3: scope.$index < 3 }">
              {{ scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <div class="product-info">
              <el-image :src="scope.row.image" :alt="scope.row.name" class="product-image"></el-image>
              <div class="product-detail">
                <div class="name">{{ scope.row.name }}</div>
                <div class="category">{{ scope.row.category }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="150" align="right">
          <template slot-scope="scope">
            <div class="sales-info">
              <div class="amount">¥{{ formatNumber(scope.row.amount) }}</div>
              <div class="quantity">{{ formatNumber(scope.row.quantity) }}件</div>
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
  name: 'ProductAnalytics',
  components: {
    LineChart
  },
  data() {
    return {
      dateRange: [],
      category: '',
      sortBy: 'sales-desc',
      chartType: 'amount',

      loading: false,
      overview: {
        totalAmount: 0,
        totalSales: 0,
        averageOrder: 0,
        amountGrowth: 0,
        salesGrowth: 0,
        orderGrowth: 0
      },

      chartData: {
        labels: [],
        datasets: [{
          label: '销售额',
          data: []
        }]
      },

      rankList: [],
      categories: [],

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.fetchCategories()
    this.fetchData()
  },
  methods: {
    formatNumber,

    async fetchCategories() {
      // 获取商品分类列表
    },

    async fetchData() {
      this.loading = true
      try {
        const [overview, sales] = await Promise.all([
          analyticsApi.getSalesOverview(),
          analyticsApi.getProductSales({
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
            category: this.category,
            sortBy: this.sortBy
          })
        ])

        this.overview = overview.data

        console.log(this.overview)

        this.updateChartData(sales.data)
        this.rankList = sales.data.rank
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    updateChartData(trend) {
      this.chartData = {
        labels: trend.map(item => item.name),
        datasets: [{
         
          data: trend.map(item => this.chartType === 'amount' ? item.num : item.tid),
          borderColor: '#409EFF',
          backgroundColor: 'rgba(64, 158, 255, 0.1)'
        }]
      }
    },

    handleDateChange() {
      this.fetchData()
    },

    handleFilter() {
      this.fetchData()
    }
  },
  watch: {
    chartType() {
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-analytics {
  .filter-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
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

      .trend {
        color: #f56c6c;
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

  .rank-card {
    .rank-row {
      &:hover {
        background-color: #f5f7fa;
      }
    }

    .rank-number {
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #f0f2f5;
      border-radius: 4px;

      &.top3 {
        color: #fff;
        background: #f56c6c;

        &:first-child {
          background: #f7ba2a;
        }

        &:nth-child(2) {
          background: #409EFF;
        }
      }
    }

    .product-info {
      display: flex;
      align-items: center;

      .product-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 4px;
      }

      .product-detail {
        .name {
          margin-bottom: 5px;
        }

        .category {
          color: #909399;
          font-size: 12px;
        }
      }
    }

    .sales-info {
      text-align: right;

      .amount {
        color: #f56c6c;
        margin-bottom: 5px;
      }

      .quantity {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}
</style>