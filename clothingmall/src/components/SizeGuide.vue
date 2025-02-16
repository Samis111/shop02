<template>
  <div class="size-guide">
    <div class="guide-header">
      <h3>{{ category }}尺码对照表</h3>
      <p class="guide-tips">温馨提示：下表尺寸为人体测量尺寸，仅供参考。</p>
    </div>

    <!-- 尺码表格 -->
    <div class="size-table">
      <table>
        <thead>
          <tr>
            <th>尺码</th>
            <th v-for="measure in measures" :key="measure.key">
              {{ measure.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="size in sizeData" :key="size.name">
            <td class="size-name">{{ size.name }}</td>
            <td v-for="measure in measures" :key="measure.key">
              {{ size[measure.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 测量说明 -->
    <div class="measure-guide">
      <h4>测量说明</h4>
      <div class="measure-items">
        <div 
          v-for="measure in measures" 
          :key="measure.key"
          class="measure-item"
        >
          <div class="measure-image">
            <img :src="measure.image" :alt="measure.label">
          </div>
          <div class="measure-info">
            <h5>{{ measure.label }}</h5>
            <p>{{ measure.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SizeGuide',
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      measures: [
        {
          key: 'bust',
          label: '胸围',
          image: '/images/measure/bust.png',
          description: '沿胸部最丰满处水平围量'
        },
        {
          key: 'waist',
          label: '腰围',
          image: '/images/measure/waist.png',
          description: '沿腰部最细处水平围量'
        },
        {
          key: 'hip',
          label: '臀围',
          image: '/images/measure/hip.png',
          description: '沿臀部最丰满处水平围量'
        },
        {
          key: 'length',
          label: '衣长',
          image: '/images/measure/length.png',
          description: '从领肩点至下摆的直线距离'
        }
      ],
      sizeData: [
        {
          name: 'S',
          bust: '84-88',
          waist: '66-70',
          hip: '90-94',
          length: '60'
        },
        {
          name: 'M',
          bust: '88-92',
          waist: '70-74',
          hip: '94-98',
          length: '61'
        },
        {
          name: 'L',
          bust: '92-96',
          waist: '74-78',
          hip: '98-102',
          length: '62'
        },
        {
          name: 'XL',
          bust: '96-100',
          waist: '78-82',
          hip: '102-106',
          length: '63'
        }
      ]
    }
  },
  created() {
    // 根据不同品类加载对应的尺码数据
    this.loadSizeData()
  },
  methods: {
    loadSizeData() {
      // TODO: 根据category加载对应的尺码数据
      switch (this.category) {
        case '连衣裙':
          // 加载连衣裙的尺码数据
          break
        case '上衣':
          // 加载上衣的尺码数据
          break
        case '裤子':
          // 加载裤子的尺码数据
          break
        default:
          // 使用默认尺码数据
      }
    }
  }
}
</script>

<style scoped>
.size-guide {
  padding: 20px;
}

.guide-header {
  text-align: center;
  margin-bottom: 30px;
}

.guide-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 10px;
}

.guide-tips {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.size-table {
  margin-bottom: 30px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  padding: 12px;
  border: 1px solid #eee;
}

th {
  background: #f8f8f8;
  font-weight: 500;
  color: #333;
}

td {
  color: #666;
}

.size-name {
  font-weight: 500;
  color: #333;
}

.measure-guide {
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

.measure-guide h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 20px;
}

.measure-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.measure-item {
  display: flex;
  gap: 15px;
}

.measure-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.measure-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.measure-info h5 {
  font-size: 14px;
  color: #333;
  margin: 0 0 5px;
}

.measure-info p {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .measure-items {
    grid-template-columns: 1fr;
  }
  
  .size-table {
    margin: 0 -20px;
    padding: 0 20px;
  }
}
</style> 