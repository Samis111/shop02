<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
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
      const data = this.chartData.datasets[0].data.map((value, index) => ({
        value,
        name: this.chartData.labels[index]
      }))

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'top'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
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