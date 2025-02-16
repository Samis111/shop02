<template>
  <div class="product-filter">
    <!-- 排序选项 -->
    <div class="filter-section sort-options">
      <h3>排序方式</h3>
      <div class="sort-buttons">
        <button 
          v-for="option in sortOptions" 
          :key="option.value"
          :class="{ active: currentSort === option.value }"
          @click="handleSort(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 价格区间 -->
    <div class="filter-section">
      <h3>价格区间</h3>
      <div class="price-range">
        <input 
          type="number" 
          v-model.number="priceRange.min" 
          placeholder="最低价"
        >
        <span>-</span>
        <input 
          type="number" 
          v-model.number="priceRange.max" 
          placeholder="最高价"
        >
        <button @click="applyPriceFilter">确定</button>
      </div>
    </div>

    <!-- 尺码选择 -->
    <div class="filter-section">
      <h3>尺码</h3>
      <div class="size-options">
        <label 
          v-for="size in sizes" 
          :key="size"
          class="size-checkbox"
        >
          <input 
            type="checkbox"
            :value="size"
            v-model="selectedSizes"
            @change="applyFilters"
          >
          {{ size }}
        </label>
      </div>
    </div>

    <!-- 颜色选择 -->
    <div class="filter-section">
      <h3>颜色</h3>
      <div class="color-options">
        <div 
          v-for="color in colors" 
          :key="color.value"
          class="color-item"
          :class="{ active: selectedColors.includes(color.value) }"
          @click="toggleColor(color.value)"
        >
          <span 
            class="color-circle"
            :style="{ backgroundColor: color.code }"
          ></span>
          <span class="color-name">{{ color.label }}</span>
        </div>
      </div>
    </div>

    <!-- 品牌筛选 -->
    <div class="filter-section">
      <h3>品牌</h3>
      <div class="brand-search">
        <input 
          type="text" 
          v-model="brandSearch" 
          placeholder="搜索品牌"
        >
      </div>
      <div class="brand-list">
        <label 
          v-for="brand in filteredBrands" 
          :key="brand.id"
          class="brand-item"
        >
          <input 
            type="checkbox"
            :value="brand.id"
            v-model="selectedBrands"
            @change="applyFilters"
          >
          {{ brand.name }}
        </label>
      </div>
    </div>

    <!-- 款式筛选 -->
    <div class="filter-section">
      <h3>款式</h3>
      <div class="style-options">
        <label 
          v-for="style in styles" 
          :key="style.value"
          class="style-item"
        >
          <input 
            type="checkbox"
            :value="style.value"
            v-model="selectedStyles"
            @change="applyFilters"
          >
          {{ style.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductFilter',
  data() {
    return {
      currentSort: 'default',
      sortOptions: [
        { label: '默认排序', value: 'default' },
        { label: '价格从低到高', value: 'price-asc' },
        { label: '价格从高到低', value: 'price-desc' },
        { label: '销量从高到低', value: 'sales-desc' },
        { label: '最新上架', value: 'time-desc' }
      ],
      priceRange: {
        min: null,
        max: null
      },
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      selectedSizes: [],
      colors: [
        { label: '黑色', value: 'black', code: '#000000' },
        { label: '白色', value: 'white', code: '#FFFFFF' },
        { label: '红色', value: 'red', code: '#FF0000' },
        { label: '蓝色', value: 'blue', code: '#0000FF' },
        { label: '灰色', value: 'gray', code: '#808080' }
      ],
      selectedColors: [],
      brands: [
        { id: 1, name: 'Nike' },
        { id: 2, name: 'Adidas' },
        { id: 3, name: 'Puma' },
        { id: 4, name: 'Under Armour' }
      ],
      brandSearch: '',
      selectedBrands: [],
      styles: [
        { label: '休闲', value: 'casual' },
        { label: '正装', value: 'formal' },
        { label: '运动', value: 'sports' },
        { label: '商务', value: 'business' }
      ],
      selectedStyles: []
    }
  },
  computed: {
    filteredBrands() {
      return this.brands.filter(brand => 
        brand.name.toLowerCase().includes(this.brandSearch.toLowerCase())
      )
    }
  },
  methods: {
    handleSort(value) {
      this.currentSort = value
      this.applyFilters()
    },
    toggleColor(value) {
      const index = this.selectedColors.indexOf(value)
      if (index === -1) {
        this.selectedColors.push(value)
      } else {
        this.selectedColors.splice(index, 1)
      }
      this.applyFilters()
    },
    applyPriceFilter() {
      if (this.priceRange.min > this.priceRange.max) {
        [this.priceRange.min, this.priceRange.max] = 
        [this.priceRange.max, this.priceRange.min]
      }
      this.applyFilters()
    },
    applyFilters() {
      const filters = {
        sort: this.currentSort,
        price: this.priceRange,
        sizes: this.selectedSizes,
        colors: this.selectedColors,
        brands: this.selectedBrands,
        styles: this.selectedStyles
      }
      this.$emit('filter-change', filters)
    }
  }
}
</script>

<style scoped>
.product-filter {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
}

/* 排序按钮样式 */
.sort-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sort-buttons button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-buttons button.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

/* 价格区间样式 */
.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-range input {
  width: 80px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.price-range button {
  padding: 6px 12px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 尺码选择样式 */
.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* 颜色选择样式 */
.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.color-item.active {
  background: #f5f5f5;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* 品牌搜索样式 */
.brand-search {
  margin-bottom: 10px;
}

.brand-search input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.brand-list {
  max-height: 200px;
  overflow-y: auto;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  cursor: pointer;
}

/* 款式选择样式 */
.style-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.style-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
</style> 