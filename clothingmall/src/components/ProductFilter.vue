<template>
  <div class="product-filter">
    <!-- 品牌筛选 -->
    <div class="filter-section">
      <h3>品牌筛选</h3>
      <el-select v-model="localFilters.brand" placeholder="选择品牌" clearable @change="handleFilterChange">
        <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id">
          <div class="brand-option">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo">
            <span>{{ brand.type }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <!-- 排序选项 -->
    <div class="filter-section">
      <h3>排序方式</h3>
      <el-radio-group v-model="localFilters.sort" @change="handleFilterChange">
        <el-radio label="default">默认</el-radio>
        <el-radio label="price-asc">价格从低到高</el-radio>
        <el-radio label="price-desc">价格从高到低</el-radio>
        <el-radio label="sales">销量优先</el-radio>
      </el-radio-group>
    </div>

    <!-- 价格区间 -->
    <div class="filter-section">
      <h3>价格区间</h3>
      <div class="price-range">
        <el-input-number v-model="localFilters.price.min" :min="0" placeholder="最低价" @change="handleFilterChange" />
        <span class="separator">-</span>
        <el-input-number v-model="localFilters.price.max" :min="0" placeholder="最高价" @change="handleFilterChange" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductFilter',
  props: {
    brands: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localFilters: {
        brand: null,
        sort: 'default',
        price: {
          min: null,
          max: null
        }
      }
    }
  },
  methods: {
    handleFilterChange() {

      this.$emit('filter-change', { ...this.localFilters })
    }
  }
}
</script>
<style scoped>
.product-filter {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  color: #999;
}

.el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.el-radio {
  margin-right: 0;
  margin-bottom: 8px;
}

.brand-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>