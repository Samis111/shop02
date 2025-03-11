<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      this.setOptions()
    },
    setOptions() {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.chartData.labels,
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.chartData.datasets[0].data,
            type: 'line',
            name: this.chartData.datasets[0].label,
            smooth: true,
            areaStyle: {
              opacity: 0.3
            }
          }
        ]
      }
      this.chart.setOption(option)
    },
    resizeHandler() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  },
  watch: {
    chartData: {
      handler() {
        this.setOptions()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style> 
</style> 