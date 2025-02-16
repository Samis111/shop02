<template>
  <div class="pagination" v-if="total > 0">
    <div class="pagination-info">
      共 {{ total }} 条，每页 {{ pageSize }} 条
    </div>
    
    <div class="pagination-buttons">
      <!-- 上一页 -->
      <button 
        class="page-btn prev"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <i class="iconfont icon-arrow-left"></i>
      </button>

      <!-- 页码按钮 -->
      <template v-for="(item, index) in pageItems">
        <!-- 省略号 -->
        <span 
          v-if="item === '...'" 
          :key="'dot' + index" 
          class="page-dots"
        >...</span>
        
        <!-- 页码 -->
        <button
          v-else
          :key="item"
          class="page-btn"
          :class="{ active: currentPage === item }"
          @click="handlePageChange(item)"
        >
          {{ item }}
        </button>
      </template>

      <!-- 下一页 -->
      <button 
        class="page-btn next"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        <i class="iconfont icon-arrow-right"></i>
      </button>
    </div>

    <!-- 跳转 -->
    <div class="pagination-jumper">
      <span>前往</span>
      <input
        type="number"
        v-model.number="jumpPage"
        @keyup.enter="handleJumpPage"
        :min="1"
        :max="totalPages"
      >
      <span>页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    // 显示的页码按钮数量
    pagerCount: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      jumpPage: this.currentPage
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageItems() {
      const array = []
      const pagerCount = this.pagerCount
      const totalPages = this.totalPages
      const currentPage = this.currentPage
      
      // 当总页数小于等于要显示的页码数时，全部显示
      if (totalPages <= pagerCount) {
        for (let i = 1; i <= totalPages; i++) {
          array.push(i)
        }
      } else {
        // 当总页数大于要显示的页码数时
        const halfPagerCount = Math.floor((pagerCount - 1) / 2)
        
        // 处理左边界
        if (currentPage <= halfPagerCount + 1) {
          for (let i = 1; i <= pagerCount - 1; i++) {
            array.push(i)
          }
          array.push('...')
          array.push(totalPages)
        }
        // 处理右边界
        else if (currentPage >= totalPages - halfPagerCount) {
          array.push(1)
          array.push('...')
          for (let i = totalPages - (pagerCount - 2); i <= totalPages; i++) {
            array.push(i)
          }
        }
        // 处理中间情况
        else {
          array.push(1)
          array.push('...')
          for (let i = currentPage - halfPagerCount; i <= currentPage + halfPagerCount; i++) {
            array.push(i)
          }
          array.push('...')
          array.push(totalPages)
        }
      }
      
      return array
    }
  },
  watch: {
    currentPage(val) {
      this.jumpPage = val
    }
  },
  methods: {
    handlePageChange(page) {
      if (page !== this.currentPage) {
        this.$emit('update:currentPage', page)
        this.$emit('change', page)
      }
    },
    handleJumpPage() {
      let page = this.jumpPage
      
      // 边界处理
      if (page < 1) {
        page = 1
      } else if (page > this.totalPages) {
        page = this.totalPages
      }
      
      this.handlePageChange(page)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  color: #333;
  border-color: #333;
}

.page-btn.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.page-btn:disabled {
  cursor: not-allowed;
  color: #d9d9d9;
}

.page-dots {
  color: #999;
}

.pagination-jumper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.pagination-jumper input {
  width: 50px;
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
}

.pagination-jumper input:focus {
  outline: none;
  border-color: #333;
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .page-btn {
    min-width: 28px;
    height: 28px;
  }
  
  .pagination-info,
  .pagination-jumper {
    font-size: 12px;
  }
  
  .pagination-jumper input {
    width: 40px;
    height: 28px;
  }
}
</style> 